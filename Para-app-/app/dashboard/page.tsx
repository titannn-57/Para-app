import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AiCoachCard } from "@/components/dashboard/ai-coach-card";
import { StartChallengeCard } from "@/components/dashboard/start-challenge-card";
import { ActiveChallengeCard } from "@/components/dashboard/active-challenge-card";
import {
  getCurrentUser,
  getCurrentChallenge,
  getTransactions,
} from "@/app/lib/data";

function sanitizeChallenge(raw: any) {
  const tasks = raw?.tasks || [];

  return {
    _id: raw._id?.toString?.() || "",
    userId: raw.userId?.toString?.() || "",
    title: raw.title || "",
    goal: raw.goal || "",
    startDate: raw.startDate ? new Date(raw.startDate) : new Date(),
    endDate: raw.endDate ? new Date(raw.endDate) : new Date(),
    isActive: raw.isActive || false,
    tasks: tasks.map((task: any) => ({
      id: task.id || task._id?.toString?.() || "",
      day: task.day,
      title: task.title,
      completed: task.completed || false,
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    })),
    currentDay: raw.currentDay || 1, // ✅ FIXED
    totalDays: tasks.length,
  };
}

function sanitizeTransactions(raw: any[]) {
  return raw.map((tx) => ({
    _id: tx._id?.toString?.() || "",
    userId: tx.userId?.toString?.() || "",
    type: tx.type || "earned",
    amount: tx.amount || 0,
    reason: tx.reason || "",
    timestamp: new Date(tx.timestamp),
  }));
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const rawChallenge = await getCurrentChallenge();
  const challenge = rawChallenge ? sanitizeChallenge(rawChallenge) : null;
  const rawTransactions = await getTransactions(5);
  const transactions = sanitizeTransactions(rawTransactions);

  // --- Level logic ---
  let coinsForNextLevel = 0;
  let nextLevel = 1;

  if (user) {
    if (user.level === 1) {
      nextLevel = 2;
      coinsForNextLevel = 200 - user.coins;
    } else if (user.level === 2) {
      nextLevel = 3;
      coinsForNextLevel = 500 - user.coins;
    }
    coinsForNextLevel = Math.max(0, coinsForNextLevel);
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Track your transformation journey and progress."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Current Level"
          value={user?.level.toString() || "1"}
          description={
            nextLevel > (user?.level || 1)
              ? `${coinsForNextLevel} coins to Level ${nextLevel}`
              : "Max Level Reached"
          }
          icon="trophy"
        />
        <StatsCard
          title="PARA Coins"
          value={user?.coins.toString() || "0"}
          description="Earn coins by completing tasks"
          icon="coins"
        />
        <StatsCard
          title="Current Streak"
          value={challenge ? challenge.currentDay.toString() : "0"}
          description={challenge ? "Days in challenge" : "Start a challenge"}
          icon="flame"
        />
        <StatsCard
          title="Tasks Completed"
          value={
            challenge
              ? challenge.tasks.filter((t: { completed: boolean }) => t.completed).length.toString()
              : "0"
          }
          description={
            challenge
              ? `Out of ${challenge.totalDays} total`
              : "No active tasks"
          }
          icon="check-circle"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <div className="lg:col-span-2">
          {challenge ? (
            <ActiveChallengeCard challenge={challenge} />
          ) : (
            <StartChallengeCard userId={user?._id.toString() || ""} />
          )}
        </div>
        <div>
          <AiCoachCard />
        </div>
      </div>

      <div className="mt-4">
        <RecentActivity transactions={transactions} />
      </div>
    </DashboardShell>
  );
}

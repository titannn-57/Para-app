import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CoinsHistory } from "@/components/para-coins/coins-history"
import { RewardsGrid } from "@/components/para-coins/rewards-grid"
import { Coins, ArrowUp, ArrowDown } from "lucide-react"
import { getCurrentUser, getTransactions } from "@/lib/auth"
import { cookies } from "next/headers"

export default async function ParaCoinsPage() {
  // Get user ID from cookie
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value

  // Get user data
  const user = userId ? await getCurrentUser(userId) : null

  // Get transactions
  const transactions = userId ? await getTransactions(userId, 20) : []

  // Calculate coins earned and spent in last 7 days
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const recentTransactions = transactions.filter((t) => new Date(t.timestamp) >= sevenDaysAgo)

  const earned = recentTransactions.filter((t) => t.type === "earned").reduce((sum, t) => sum + t.amount, 0)

  const spent = recentTransactions.filter((t) => t.type === "spent").reduce((sum, t) => sum + Math.abs(t.amount), 0)

  // Calculate progress to next level
  let progress = 0
  let nextLevelCoins = 0
  const currentLevel = user?.level || 1

  if (currentLevel === 1) {
    nextLevelCoins = 200
    progress = ((user?.coins || 0) / 200) * 100
  } else if (currentLevel === 2) {
    nextLevelCoins = 500
    progress = ((user?.coins || 0) / 500) * 100
  } else {
    progress = 100 // Max level
  }

  // Ensure progress doesn't exceed 100%
  progress = Math.min(progress, 100)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="PARA Coins"
        text="Earn and spend virtual currency to enhance your transformation journey."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Balance</CardTitle>
            <CardDescription>Your available PARA Coins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-amber-500" />
              <span className="text-3xl font-bold">{user?.coins || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Level Progress</CardTitle>
            <CardDescription>
              {currentLevel < 3
                ? `${nextLevelCoins - (user?.coins || 0)} more coins to reach Level ${currentLevel + 1}`
                : "Maximum level reached"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-4 mb-2" />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Level {currentLevel}</span>
              {currentLevel < 3 && <span>Level {currentLevel + 1}</span>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Coin Flow</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Earned</p>
                  <p className="font-medium">+{earned}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                  <p className="font-medium">-{spent}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Unlockables</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <CoinsHistory transactions={transactions} />
        </TabsContent>
        <TabsContent value="rewards">
          <RewardsGrid userCoins={user?.coins || 0} userId={userId || ""} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}


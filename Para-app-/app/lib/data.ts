import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) return null;

    const client = await clientPromise;
    const db = client.db("para");

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) return null;

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      coins: user.coins,
      level: user.level,
      lastLogin: user.lastLogin?.toISOString?.() || null,
      createdAt: user.createdAt?.toISOString?.() || null,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getTransactions(limit = 10) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) return [];

    const client = await clientPromise;
    const db = client.db("para");

    const transactions = await db
      .collection("transactions")
      .find({ userId: new ObjectId(userId) })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return transactions.map((t) => ({
      ...t,
      _id: t._id.toString(),
      userId: t.userId.toString(),
      timestamp: t.timestamp?.toISOString?.() || null,
    }));
  } catch (error) {
    console.error("Error getting transactions:", error);
    return [];
  }
}

export async function getCurrentChallenge() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) return null;

    const client = await clientPromise;
    const db = client.db("para");

    const challenge = await db.collection("challenges").findOne({
      userId: new ObjectId(userId),
      isActive: true,
    });

    if (!challenge) return null;

    return {
      ...challenge,
      _id: challenge._id.toString(),
      userId: challenge.userId?.toString?.() || null,
      startDate: challenge.startDate?.toISOString?.() || null,
      endDate: challenge.endDate?.toISOString?.() || null,
      createdAt: challenge.createdAt?.toISOString?.() || null,
      updatedAt: challenge.updatedAt?.toISOString?.() || null,
      tasks: challenge.tasks?.map((task: any) => ({
        ...task,
        completedAt: task.completedAt?.toISOString?.() || null,
      })) || [],
    };
  } catch (error) {
    console.error("Error getting current challenge:", error);
    return null;
  }
}

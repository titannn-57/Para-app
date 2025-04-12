"use server"

import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

interface Task {
  id: string
  day: number
  title: string
  completed: boolean
  completedAt?: Date
}

interface Challenge {
  _id: ObjectId
  userId: ObjectId
  title: string
  goal: string
  startDate: Date
  endDate: Date
  currentDay: number
  totalDays: number
  tasks: Task[]
  isActive: boolean
  createdAt: Date
}

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

function toObjectId(id: string): ObjectId {
  return new ObjectId(id)
}

export async function createChallengeAction(userId: string, goal: string): Promise<any> {
  console.log("Creating challenge for user:", userId, "with goal:", goal)

  const client = await clientPromise
  const db = client.db("para")

  const tasks = await generateTasksWithAI(goal)

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 40)

  const userObjectId = isValidObjectId(userId) ? new ObjectId(userId) : userId

  const challenge: Omit<Challenge, "_id"> = {
    userId: userObjectId as ObjectId,
    title: "41-Day Transformation",
    goal,
    startDate,
    endDate,
    currentDay: 1,
    totalDays: 41,
    tasks,
    isActive: true,
    createdAt: new Date(),
  }

  const result = await db.collection("challenges").insertOne(challenge)

  return {
    _id: result.insertedId.toString(),
    userId: userId,
    title: challenge.title,
    goal: challenge.goal,
    startDate: challenge.startDate.toISOString(),
    endDate: challenge.endDate.toISOString(),
    currentDay: challenge.currentDay,
    totalDays: challenge.totalDays,
    tasks: challenge.tasks.map(task => ({
      id: task.id,
      day: task.day,
      title: task.title,
      completed: task.completed,
      completedAt: task.completedAt ? task.completedAt.toISOString() : undefined,
    })),
    isActive: challenge.isActive,
    createdAt: challenge.createdAt.toISOString(),
  }
}

export async function getCurrentChallengeAction(userId: string): Promise<any> {
  const client = await clientPromise
  const db = client.db("para")

  const challenge = await db.collection("challenges").findOne<Challenge>({
    userId: isValidObjectId(userId) ? new ObjectId(userId) : userId,
    isActive: true,
  })

  if (!challenge) return null

  return {
    _id: challenge._id.toString(),
    userId: challenge.userId.toString(),
    title: challenge.title,
    goal: challenge.goal,
    startDate: challenge.startDate.toISOString(),
    endDate: challenge.endDate.toISOString(),
    currentDay: challenge.currentDay,
    totalDays: challenge.totalDays,
    isActive: challenge.isActive,
    createdAt: challenge.createdAt.toISOString(),
    tasks: challenge.tasks.map(task => ({
      id: task.id,
      day: task.day,
      title: task.title,
      completed: task.completed,
      completedAt: task.completedAt ? task.completedAt.toISOString() : undefined,
    })),
  }
}

export async function completeTaskAction(userId: string, taskId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db("para")

  await db.collection("challenges").updateOne(
    {
      userId: isValidObjectId(userId) ? new ObjectId(userId) : userId,
      isActive: true,
      "tasks.id": taskId,
    },
    {
      $set: {
        "tasks.$.completed": true,
        "tasks.$.completedAt": new Date(),
      },
    }
  )

  await addCoinsAction(userId, 5, "Completed task")
}

export async function advanceDayAction(userId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db("para")

  const challenge = await getCurrentChallengeAction(userId)
  if (!challenge) return

  const todaysTasks = challenge.tasks.filter((task: Task) => task.day === challenge.currentDay)
  const allCompleted = todaysTasks.every((task: Task) => task.completed)

  if (allCompleted) {
    const newDay = challenge.currentDay + 1

    if (newDay > challenge.totalDays) {
      await db.collection("challenges").updateOne(
        { _id: new ObjectId(challenge._id) },
        { $set: { isActive: false } }
      )
    } else {
      await db.collection("challenges").updateOne(
        { _id: new ObjectId(challenge._id) },
        { $set: { currentDay: newDay } }
      )
    }
  }
}

async function generateTasksWithAI(goal: string): Promise<Task[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
      I need to create a 41-day challenge to help someone achieve this goal: "${goal}".

      Please generate a set of daily tasks for all 41 days. Each day should have 3-4 specific, actionable tasks that build progressively toward the goal.

      Format your response as a JSON array with this structure:
      [
        {
          "day": 1,
          "tasks": [
            "Task description 1",
            "Task description 2",
            "Task description 3"
          ]
        },
        ...
      ]

      Make sure the tasks are:
      1. Specific and actionable
      2. Progressively more challenging
      3. Directly related to the goal
      4. Realistic to complete in a day

      Only return the JSON array, nothing else.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonStart = text.indexOf("[")
    const jsonEnd = text.lastIndexOf("]") + 1
    const jsonStr = text.substring(jsonStart, jsonEnd)

    const daysData = JSON.parse(jsonStr)

    if (!Array.isArray(daysData)) {
      throw new Error("Invalid AI response format")
    }

    const tasks: Task[] = []

    daysData.forEach((dayData: any) => {
      const day = dayData.day
      dayData.tasks.forEach((taskDescription: string, index: number) => {
        tasks.push({
          id: `task-${day}-${index}`,
          day,
          title: taskDescription,
          completed: false,
        })
      })
    })

    return tasks
  } catch (error) {
    console.error("Error generating tasks with AI:", error)
    return generateFallbackTasks(goal)
  }
}

function generateFallbackTasks(goal: string): Task[] {
  const tasks: Task[] = []

  for (let day = 1; day <= 41; day++) {
    tasks.push({
      id: `task-${day}-1`,
      day,
      title: `Spend 15 minutes reflecting on your goal: ${goal}`,
      completed: false,
    })
    tasks.push({
      id: `task-${day}-2`,
      day,
      title: `Take one small action toward your goal`,
      completed: false,
    })
    tasks.push({
      id: `task-${day}-3`,
      day,
      title: `Journal about your progress`,
      completed: false,
    })
  }

  return tasks
}

async function addCoinsAction(userId: string, amount: number, reason: string): Promise<number> {
  const client = await clientPromise
  const db = client.db("para")

  const result = await db.collection("users").findOneAndUpdate(
    { _id: isValidObjectId(userId) ? new ObjectId(userId) : userId },
    { $inc: { coins: amount } },
    { returnDocument: "after" }
  )

  await db.collection("transactions").insertOne({
    userId: isValidObjectId(userId) ? new ObjectId(userId) : userId,
    type: amount > 0 ? "earned" : "spent",
    amount,
    reason,
    timestamp: new Date(),
  })

  const updatedUser = result?.value
  const newCoins = updatedUser?.coins ?? 0
  let newLevel = updatedUser?.level ?? 1

  if (newCoins >= 500 && newLevel < 3) {
    newLevel = 3
    await db.collection("users").updateOne(
      { _id: isValidObjectId(userId) ? new ObjectId(userId) : userId },
      { $set: { level: newLevel } }
    )
  } else if (newCoins >= 200 && newLevel < 2) {
    newLevel = 2
    await db.collection("users").updateOne(
      { _id: isValidObjectId(userId) ? new ObjectId(userId) : userId },
      { $set: { level: newLevel } }
    )
  }

  return newCoins
}

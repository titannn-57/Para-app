import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

interface Challenge {
  _id: string
  userId: string
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

interface Task {
  id: string
  day: number
  title: string
  completed: boolean
  completedAt?: Date
}

export async function createChallenge(userId: string, goal: string): Promise<Challenge> {
  const client = await clientPromise
  const db = client.db("para")

  // Generate tasks using Gemini AI
  const tasks = await generateTasksWithAI(goal)

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 40) // 41 days including today

  const challenge = {
    userId: new ObjectId(userId),
    title: "41-Day Transformation",
    goal: goal,
    startDate: startDate,
    endDate: endDate,
    currentDay: 1,
    totalDays: 41,
    tasks: tasks,
    isActive: true,
    createdAt: new Date(),
  }

  const result = await db.collection("challenges").insertOne(challenge)

  return {
    _id: result.insertedId.toString(),
    userId: userId,
    ...challenge,
  }
}

export async function getCurrentChallenge(userId: string): Promise<Challenge | null> {
  const client = await clientPromise
  const db = client.db("para")

  const challenge = await db.collection("challenges").findOne({
    userId: new ObjectId(userId),
    isActive: true,
  })

  if (!challenge) return null

  return {
    ...challenge,
    _id: challenge._id.toString(),
    userId: challenge.userId.toString(),
  }
}

export async function getTodaysTasks(userId: string): Promise<Task[]> {
  const challenge = await getCurrentChallenge(userId)
  if (!challenge) return []

  // Filter tasks for the current day
  return challenge.tasks.filter((task) => task.day === challenge.currentDay)
}

export async function completeTask(userId: string, taskId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db("para")

  // Mark task as completed
  await db.collection("challenges").updateOne(
    {
      userId: new ObjectId(userId),
      isActive: true,
      "tasks.id": taskId,
    },
    {
      $set: {
        "tasks.$.completed": true,
        "tasks.$.completedAt": new Date(),
      },
    },
  )

  // Add coins for completing a task
  const { addCoins } = await import("./auth")
  await addCoins(userId, 5, "Completed task")
}

export async function advanceDay(userId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db("para")

  const challenge = await getCurrentChallenge(userId)
  if (!challenge) return

  // Only advance if all tasks for the current day are completed
  const todaysTasks = challenge.tasks.filter((task) => task.day === challenge.currentDay)
  const allCompleted = todaysTasks.every((task) => task.completed)

  if (allCompleted) {
    const newDay = challenge.currentDay + 1

    if (newDay > challenge.totalDays) {
      // Challenge is complete
      await db.collection("challenges").updateOne({ _id: new ObjectId(challenge._id) }, { $set: { isActive: false } })
    } else {
      // Advance to next day
      await db
        .collection("challenges")
        .updateOne({ _id: new ObjectId(challenge._id) }, { $set: { currentDay: newDay } })
    }
  }
}

async function generateTasksWithAI(goal: string): Promise<Task[]> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Prompt for generating tasks
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
        {
          "day": 2,
          "tasks": [
            "Task description 1",
            "Task description 2",
            "Task description 3"
          ]
        }
      ]
      
      Make sure the tasks are:
      1. Specific and actionable
      2. Progressively more challenging
      3. Directly related to the goal
      4. Realistic to complete in a day
      
      Only return the JSON array, nothing else.
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const jsonStart = text.indexOf("[")
    const jsonEnd = text.lastIndexOf("]") + 1
    const jsonStr = text.substring(jsonStart, jsonEnd)

    const daysData = JSON.parse(jsonStr)

    // Convert to our Task format
    const tasks: Task[] = []

    daysData.forEach((dayData: any) => {
      const day = dayData.day

      dayData.tasks.forEach((taskDescription: string, index: number) => {
        tasks.push({
          id: `task-${day}-${index}`,
          day: day,
          title: taskDescription,
          completed: false,
        })
      })
    })

    return tasks
  } catch (error) {
    console.error("Error generating tasks with AI:", error)

    // Fallback to basic tasks if AI fails
    return generateFallbackTasks(goal)
  }
}

function generateFallbackTasks(goal: string): Task[] {
  const tasks: Task[] = []

  // Generate basic tasks for 41 days
  for (let day = 1; day <= 41; day++) {
    tasks.push({
      id: `task-${day}-1`,
      day: day,
      title: `Spend 15 minutes reflecting on your goal: ${goal}`,
      completed: false,
    })

    tasks.push({
      id: `task-${day}-2`,
      title: `Take one small action toward your goal`,
      day: day,
      completed: false,
    })

    tasks.push({
      id: `task-${day}-3`,
      title: `Journal about your progress`,
      day: day,
      completed: false,
    })
  }

  return tasks
}


import { GoogleGenerativeAI } from "@google/generative-ai"
import { getCurrentChallenge, getTodaysTasks } from "./challenge"
import { getCurrentUser } from "./auth"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function getAICoachResponse(userId: string, message: string): Promise<string> {
  try {
    // Get user data
    const user = await getCurrentUser(userId)
    if (!user) {
      return "I'm sorry, I couldn't retrieve your user information. Please try again later."
    }

    // Get current challenge and tasks
    const challenge = await getCurrentChallenge(userId)
    const todaysTasks = challenge ? await getTodaysTasks(userId) : []

    // Calculate progress
    let progress = "You haven't started a challenge yet."
    let completedTasksCount = 0
    let totalTasksCount = 0

    if (challenge) {
      const allTasks = challenge.tasks
      totalTasksCount = allTasks.length
      completedTasksCount = allTasks.filter((task) => task.completed).length

      const progressPercentage = Math.round((completedTasksCount / totalTasksCount) * 100)
      progress = `You're on day ${challenge.currentDay} of your 41-day challenge (${progressPercentage}% complete). You've completed ${completedTasksCount} out of ${totalTasksCount} total tasks.`
    }

    // Format today's tasks
    let tasksInfo = "You don't have any active tasks today."
    if (todaysTasks.length > 0) {
      tasksInfo = "Today's tasks:\n"
      todaysTasks.forEach((task, index) => {
        tasksInfo += `${index + 1}. ${task.title} - ${task.completed ? "Completed" : "Not completed yet"}\n`
      })
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create context for the AI
    const context = `
      You are an AI coach for the PARA transformation platform. Your name is PARA Coach.
      
      USER INFORMATION:
      Name: ${user.name}
      Level: ${user.level}
      Coins: ${user.coins}
      
      CHALLENGE INFORMATION:
      ${challenge ? `Goal: ${challenge.goal}` : "No active challenge"}
      ${progress}
      
      TASKS INFORMATION:
      ${tasksInfo}
      
      Your role is to:
      1. Provide guidance specifically related to the user's goal and tasks
      2. Be encouraging and supportive
      3. Offer practical advice for completing tasks
      4. Acknowledge progress and achievements
      5. Keep responses focused on the transformation journey
      
      DO NOT:
      - Discuss topics unrelated to the user's goals or tasks
      - Provide medical advice
      - Make promises about specific outcomes
      
      Keep your responses concise, practical, and focused on helping the user achieve their goal.
    `

    // Generate response
    const result = await model.generateContent([context, message])
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error getting AI coach response:", error)
    return "I'm having trouble connecting right now. Please try again in a moment."
  }
}


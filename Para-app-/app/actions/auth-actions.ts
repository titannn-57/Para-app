"use server"

import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

interface SignupData {
  name: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

export async function createUserAction(data: SignupData) {
  const client = await clientPromise
  const db = client.db("para")

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: data.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create new user with 50 initial coins
  const now = new Date()
  const newUser = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
    coins: 50, // Initial coins for new account
    level: 1,
    lastLogin: now,
    createdAt: now,
    loginStreak: 1,
    lastLoginDate: now.toDateString(),
  }

  const result = await db.collection("users").insertOne(newUser)

  // Create transaction record for initial coins
  await db.collection("transactions").insertOne({
    userId: result.insertedId,
    type: "earned",
    amount: 50,
    reason: "Account creation bonus",
    timestamp: now,
  })

  // Set cookie
  ;(await
    // Set cookie
    cookies()).set("userId", result.insertedId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return {
    _id: result.insertedId.toString(),
    name: data.name,
    email: data.email,
    coins: 50,
    level: 1,
  }
}

export async function loginUserAction(data: LoginData) {
  const client = await clientPromise
  const db = client.db("para")

  // Find user
  const user = await db.collection("users").findOne({ email: data.email })
  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Verify password
  const isValid = await bcrypt.compare(data.password, user.password)
  if (!isValid) {
    throw new Error("Invalid email or password")
  }

  const now = new Date()
  const today = now.toDateString()

  // Check if this is a new login day to award daily login coins
  let coinsToAdd = 0
  let newStreak = user.loginStreak || 1

  if (user.lastLoginDate !== today) {
    coinsToAdd = 5 // Award 5 coins for daily login
    newStreak += 1

    // Create transaction record for login coins
    await db.collection("transactions").insertOne({
      userId: user._id,
      type: "earned",
      amount: 5,
      reason: "Daily login bonus",
      timestamp: now,
    })

    // Update user's login info and coins
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: now,
          lastLoginDate: today,
          loginStreak: newStreak,
        },
        $inc: { coins: coinsToAdd },
      },
    )
  } else {
    // Just update the last login time
    await db.collection("users").updateOne({ _id: user._id }, { $set: { lastLogin: now } })
  }

  // Set cookie
  /*cookies().set("userId", user._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })*/
    const cookieStore = await cookies()
    cookieStore.set("userId", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    })
    

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    coins: user.coins + coinsToAdd,
    level: user.level,
  }
}

export async function logoutUserAction() {
  (await cookies()).delete("userId")
}

export async function addCoinsAction(userId: string, amount: number, reason: string) {
  const client = await clientPromise
  const db = client.db("para")

  // Update user's coins
  const result = await db
    .collection("users")
    .findOneAndUpdate({ _id: new ObjectId(userId) }, { $inc: { coins: amount } }, { returnDocument: "after" })

  // Create transaction record
  await db.collection("transactions").insertOne({
    userId: new ObjectId(userId),
    type: amount > 0 ? "earned" : "spent",
    amount: amount,
    reason: reason,
    timestamp: new Date(),
  })

  // Check if user should level up
  const newCoins = result.coins
  let newLevel = result.level

  // Simple level up logic based on coins
  if (newCoins >= 500 && newLevel < 3) {
    newLevel = 3
    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { level: newLevel } })
  } else if (newCoins >= 200 && newLevel < 2) {
    newLevel = 2
    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { level: newLevel } })
  }

  return newCoins
}


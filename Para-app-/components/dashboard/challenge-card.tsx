"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { createChallengeAction } from "@/app/actions/challenge-actions"

interface StartChallengeCardProps {
  userId: string
}

export function StartChallengeCard({ userId }: StartChallengeCardProps) {
  const [goal, setGoal] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStart = () => {
    if (!goal.trim()) return alert("Please enter a goal.")

    startTransition(async () => {
      try {
        const result = await createChallengeAction(userId, goal)
        console.log("Challenge created:", result)
        router.refresh()
      } catch (err) {
        console.error("Failed to start challenge:", err)
        alert("Failed to start challenge. Please try again.")
      }
    })
  }

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Start Your 41-Day Journey</h2>
      <p className="text-sm mb-2">Enter your transformation goal:</p>
      <input
        className="w-full border p-2 rounded mb-2"
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="e.g., Get fit, Build discipline..."
      />
      <button
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={handleStart}
        disabled={isPending}
      >
        {isPending ? "Starting..." : "Start my 41-day journey"}
      </button>
    </div>
  )
}

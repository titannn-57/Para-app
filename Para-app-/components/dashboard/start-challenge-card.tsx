"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, ArrowRight } from "lucide-react"
import { createChallengeAction } from "@/app/actions/challenge-actions"
import { useRouter } from "next/navigation"

interface StartChallengeCardProps {
  userId: string
}

export function StartChallengeCard({ userId }: StartChallengeCardProps) {
  const router = useRouter()
  const [goal, setGoal] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleStartChallenge = async () => {
    if (!goal.trim()) {
      setError("Please enter your goal to start the challenge")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      await createChallengeAction(userId, goal)
      router.refresh() // Refresh the page to show the new challenge
    } catch (error) {
      console.error("Error creating challenge:", error)
      setError("Failed to create challenge. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Start Your 41-Day Challenge</CardTitle>
            <CardDescription>Define your transformation goal</CardDescription>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm mb-2">
              What do you want to achieve in the next 41 days? Be specific about your goal.
            </p>
            <Textarea
              placeholder="e.g., Establish a daily meditation practice and improve my focus"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={4}
              className="resize-none"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">How it works:</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Enter your specific transformation goal</li>
              <li>• Our AI will create personalized daily tasks for 41 days</li>
              <li>• Complete tasks to earn PARA Coins</li>
              <li>• Track your progress and stay accountable</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          onClick={handleStartChallenge}
          disabled={isLoading}
        >
          {isLoading ? "Creating Challenge..." : "Start My 41-Day Journey"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}

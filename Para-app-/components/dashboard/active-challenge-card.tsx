"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar, RefreshCw } from "lucide-react"
import { completeTaskAction } from "@/app/actions/challenge-actions"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  day: number
  title: string
  completed: boolean
  completedAt?: Date
}

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
}

interface ActiveChallengeCardProps {
  challenge: Challenge
}

export function ActiveChallengeCard({ challenge }: ActiveChallengeCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Get today's tasks
  const todaysTasks = challenge.tasks.filter((task) => task.day === challenge.currentDay)

  // Calculate progress
  const completedTasks = challenge.tasks.filter((task) => task.completed).length
  const progress = (completedTasks / challenge.tasks.length) * 100

  // Format dates
  const startDate = new Date(challenge.startDate).toLocaleDateString()
  const endDate = new Date(challenge.endDate).toLocaleDateString()
  const today = new Date().toLocaleDateString()

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (completed) return // Don't allow unchecking

    try {
      setIsLoading(true)
      await completeTaskAction(challenge.userId, taskId)
      router.refresh() // Refresh the page to get updated data
    } catch (error) {
      console.error("Error completing task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{challenge.title}</CardTitle>
            <CardDescription>
              Day {challenge.currentDay} of {challenge.totalDays}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{today}</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="text-sm font-medium mb-1">Goal: {challenge.goal}</div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Started: {startDate}</span>
            <span>Ends: {endDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Today&apos;s Tasks</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {todaysTasks.filter((t) => t.completed).length}/{todaysTasks.length} completed
            </span>
          </div>
          <div className="space-y-2">
            {todaysTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id, task.completed)}
                  disabled={isLoading || task.completed}
                />
                <Label
                  htmlFor={task.id}
                  className={`text-sm font-medium cursor-pointer ${
                    task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </Label>
              </div>
            ))}

            {todaysTasks.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No tasks for today. Check back tomorrow!
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm" onClick={() => router.refresh()} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Tasks
        </Button>
      </CardFooter>
    </Card>
  )
}


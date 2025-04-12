import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus, Trophy, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export default function ChallengesPage() {
  const activeChallenge = {
    id: 1,
    title: "41-Day Transformation",
    description: "Build mental clarity and physical fitness",
    progress: 29, // percentage
    currentDay: 12,
    totalDays: 41,
    startDate: "March 25, 2025",
    endDate: "May 5, 2025",
  }

  const availableChallenges = [
    {
      id: 2,
      title: "Morning Routine Master",
      description: "Establish a powerful morning routine in 21 days",
      duration: "21 days",
      difficulty: "Beginner",
      participants: 1243,
      premium: false,
      icon: <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400" />,
    },
    {
      id: 3,
      title: "Mindfulness Marathon",
      description: "30 days of mindfulness practices for mental clarity",
      duration: "30 days",
      difficulty: "Intermediate",
      participants: 856,
      premium: false,
      icon: <Sparkles className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      id: 4,
      title: "Elite Fitness Challenge",
      description: "Transform your physical fitness in 60 days",
      duration: "60 days",
      difficulty: "Advanced",
      participants: 621,
      premium: true,
      icon: <Trophy className="h-10 w-10 text-amber-600 dark:text-amber-400" />,
    },
  ]

  const completedChallenges = [
    {
      id: 5,
      title: "7-Day Meditation Starter",
      description: "Introduction to daily meditation practice",
      completedDate: "February 15, 2025",
      achievements: ["Perfect Streak", "Early Riser"],
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Challenges" text="Track your current challenge and discover new ones.">
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Create Custom Challenge
        </Button>
      </DashboardHeader>

      {activeChallenge && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{activeChallenge.title}</CardTitle>
                <CardDescription>{activeChallenge.description}</CardDescription>
              </div>
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                <div>Started: {activeChallenge.startDate}</div>
                <div>Ends: {activeChallenge.endDate}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>
                    Day {activeChallenge.currentDay} of {activeChallenge.totalDays}
                  </span>
                  <span>{activeChallenge.progress}% complete</span>
                </div>
                <Progress value={activeChallenge.progress} className="h-2" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">2,145 people taking this challenge</span>
                </div>
                <Link href="/challenges/1">
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="available">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="available">Available Challenges</TabsTrigger>
          <TabsTrigger value="completed">Completed Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableChallenges.map((challenge) => (
              <Card key={challenge.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {challenge.icon}
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    </div>
                    {challenge.premium && (
                      <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                        Premium
                      </div>
                    )}
                  </div>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Duration: </span>
                      {challenge.duration}
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Difficulty: </span>
                      {challenge.difficulty}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Participants: </span>
                      {challenge.participants.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    disabled={challenge.premium}
                  >
                    {challenge.premium ? "Unlock with PARA Coins" : "Start Challenge"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          {completedChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Completed: </span>
                        {challenge.completedDate}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Achievements: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {challenge.achievements.map((achievement, index) => (
                            <div
                              key={index}
                              className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-2 py-1 rounded-full"
                            >
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Results
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No completed challenges yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
                Start a challenge to begin your transformation journey
              </p>
              <Button>Browse Challenges</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}


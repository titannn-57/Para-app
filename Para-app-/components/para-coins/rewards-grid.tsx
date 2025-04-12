"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Headphones, MessageSquare, Crown, Sparkles, Zap, Users, BookOpen, Palette } from "lucide-react"
import { addCoinsAction } from "@/app/actions/auth-actions"
import { useRouter } from "next/navigation"

interface RewardsGridProps {
  userCoins: number
}

export function RewardsGrid({ userCoins }: RewardsGridProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [redeemingId, setRedeemingId] = useState<number | null>(null)

  const rewards = [
    {
      id: 1,
      title: "Premium Meditations",
      description: "Unlock exclusive guided meditations",
      cost: 50,
      icon: Headphones,
      iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: 2,
      title: "Community Access",
      description: "Join the PARA community forums",
      cost: 200,
      icon: MessageSquare,
      iconColor: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      id: 3,
      title: "VIP Challenges",
      description: "Access to exclusive transformation challenges",
      cost: 300,
      icon: Crown,
      iconColor: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      id: 4,
      title: "Custom AI Coaching",
      description: "Personalized AI coaching responses",
      cost: 150,
      icon: Sparkles,
      iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: 5,
      title: "Advanced Workout Sessions",
      description: "High-intensity workout programs",
      cost: 100,
      icon: Zap,
      iconColor: "text-red-500 bg-red-100 dark:bg-red-900/30",
    },
    {
      id: 6,
      title: "Live Workshop Access",
      description: "Join exclusive live workshops",
      cost: 500,
      icon: Users,
      iconColor: "text-green-500 bg-green-100 dark:bg-green-900/30",
    },
    {
      id: 7,
      title: "Knowledge Library",
      description: "Access to premium knowledge content",
      cost: 250,
      icon: BookOpen,
      iconColor: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    },
    {
      id: 8,
      title: "UI Customization",
      description: "Customize your PARA experience",
      cost: 400,
      icon: Palette,
      iconColor: "text-pink-500 bg-pink-100 dark:bg-pink-900/30",
    },
  ]

  const handleRedeem = async (id: number, cost: number, title: string) => {
    if (userCoins < cost) return

    try {
      setIsLoading(true)
      setRedeemingId(id)

      // Spend coins
      await addCoinsAction(-cost, `Unlocked ${title}`)

      // Refresh the page to update coin balance
      router.refresh()
    } catch (error) {
      console.error("Error redeeming reward:", error)
    } finally {
      setIsLoading(false)
      setRedeemingId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {rewards.map((reward) => {
        const canAfford = userCoins >= reward.cost
        const isRedeeming = redeemingId === reward.id

        return (
          <Card key={reward.id} className={!canAfford ? "opacity-75" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${reward.iconColor}`}>
                  <reward.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">{reward.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">{reward.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant="outline" className="flex items-center">
                <span className="text-amber-500 mr-1">⭐</span> {reward.cost}
              </Badge>
              <Button
                size="sm"
                variant={canAfford ? "default" : "outline"}
                disabled={!canAfford || isLoading}
                className={
                  canAfford
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    : ""
                }
                onClick={() => handleRedeem(reward.id, reward.cost, reward.title)}
              >
                {isRedeeming ? "Processing..." : canAfford ? "Redeem" : "Not Enough Coins"}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}


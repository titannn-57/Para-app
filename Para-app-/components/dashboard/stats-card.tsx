import { Trophy, Coins, Flame, CheckCircle, BarChart, Clock, Heart, Brain } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: "trophy" | "coins" | "flame" | "check-circle" | "bar-chart" | "clock" | "heart" | "brain"
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  const Icon = {
    trophy: Trophy,
    coins: Coins,
    flame: Flame,
    "check-circle": CheckCircle,
    "bar-chart": BarChart,
    clock: Clock,
    heart: Heart,
    brain: Brain,
  }[icon]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


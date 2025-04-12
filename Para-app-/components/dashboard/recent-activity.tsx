import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Trophy, Coins, MessageSquare, Headphones, Calendar } from "lucide-react"

interface Transaction {
  _id: string
  userId: string
  type: "earned" | "spent"
  amount: number
  reason: string
  timestamp: Date
}

interface RecentActivityProps {
  transactions: Transaction[]
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  // Function to get icon based on transaction reason
  const getIcon = (reason: string) => {
    if (reason.includes("task")) return CheckCircle
    if (reason.includes("login")) return Calendar
    if (reason.includes("creation")) return Trophy
    if (reason.includes("meditation") || reason.includes("audio")) return Headphones
    if (reason.includes("community")) return MessageSquare
    return Coins
  }

  // Function to get icon color based on transaction reason
  const getIconColor = (reason: string) => {
    if (reason.includes("task")) return "text-green-500"
    if (reason.includes("login")) return "text-blue-500"
    if (reason.includes("creation")) return "text-yellow-500"
    if (reason.includes("meditation") || reason.includes("audio")) return "text-purple-500"
    if (reason.includes("community")) return "text-indigo-500"
    return "text-amber-500"
  }

  // Function to format relative time
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const Icon = getIcon(transaction.reason)
              const iconColor = getIconColor(transaction.reason)
              const bgColor = iconColor.replace("text-", "bg-").replace("500", "100") + " dark:bg-gray-800"

              return (
                <div key={transaction._id} className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center ${iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.reason}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRelativeTime(new Date(transaction.timestamp))}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-medium ${transaction.type === "earned" ? "text-green-500" : "text-red-500"}`}
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {Math.abs(transaction.amount)}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">No recent activity to display</div>
        )}
      </CardContent>
    </Card>
  )
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lock, Star, Calendar, Headphones, MessageSquare } from "lucide-react"

interface Transaction {
  _id: string
  userId: string
  type: "earned" | "spent"
  amount: number
  reason: string
  timestamp: Date
}

interface CoinsHistoryProps {
  transactions: Transaction[]
}

export function CoinsHistory({ transactions }: CoinsHistoryProps) {
  // Function to get icon based on transaction reason
  const getIcon = (reason: string) => {
    if (reason.includes("task")) return CheckCircle
    if (reason.includes("login")) return Calendar
    if (reason.includes("creation")) return Star
    if (reason.includes("meditation") || reason.includes("audio")) return Headphones
    if (reason.includes("community")) return MessageSquare
    return Lock
  }

  // Function to get icon color based on transaction reason
  const getIconColor = (reason: string) => {
    if (reason.includes("task")) return "text-green-500 bg-green-100 dark:bg-green-900/30"
    if (reason.includes("login")) return "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
    if (reason.includes("creation")) return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30"
    if (reason.includes("meditation") || reason.includes("audio"))
      return "text-purple-500 bg-purple-100 dark:bg-purple-900/30"
    if (reason.includes("community")) return "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30"
    return "text-gray-500 bg-gray-100 dark:bg-gray-800"
  }

  // Function to format date
  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent PARA Coins activity</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const Icon = getIcon(transaction.reason)
              const iconColor = getIconColor(transaction.reason)

              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.reason}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(new Date(transaction.timestamp))}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={transaction.type === "earned" ? "outline" : "secondary"}
                    className={
                      transaction.type === "earned"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {Math.abs(transaction.amount)}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">No transaction history available</div>
        )}
      </CardContent>
    </Card>
  )
}


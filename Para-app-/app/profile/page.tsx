import { getCurrentUser } from "../lib/data"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import {
  Mail,
  TrendingUp,
  Coins,
  CalendarCheck,
} from "lucide-react"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Your Profile"
        text="View your account details and progress overview."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} />
              Email
            </div>
            <p className="text-lg font-medium">{user?.email || "Unknown"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp size={16} />
              Level
            </div>
            <p className="text-lg font-medium">Level {user?.level || 1}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins size={16} />
              PARA Coins
            </div>
            <p className="text-lg font-medium">{user?.coins || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarCheck size={16} />
              Joined On
            </div>
            <p className="text-lg font-medium">
              {user?.createdAt?.split("T")[0] || "Unknown"}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}


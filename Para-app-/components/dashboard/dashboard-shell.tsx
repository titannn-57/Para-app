import React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
        <DashboardNav />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  )
}




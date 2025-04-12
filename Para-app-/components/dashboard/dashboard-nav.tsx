"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  Headphones,
  MessageSquare,
  Coins,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/challenges", icon: Calendar, label: "Challenges" },
    { href: "/library", icon: Headphones, label: "Audio Library" },
    { href: "/community", icon: MessageSquare, label: "Community" },
    { href: "/para-coins", icon: Coins, label: "PARA Coins" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <>
      {/* Top Bar (Mobile) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            PARA
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 w-full md:w-64 p-4 md:p-6 space-y-4 md:space-y-6`}
      >
        {/* Logo (Desktop) */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              PARA
            </span>
          </Link>
          <ModeToggle />
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} onClick={() => setIsOpen(false)}>
              <div
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === route.href
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <route.icon className="h-5 w-5" />
                <span>{route.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

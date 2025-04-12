import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AudioCard } from "@/components/library/audio-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function LibraryPage() {
  // Sample audio content data
  const meditations = [
    {
      id: 1,
      title: "Morning Clarity Meditation",
      duration: "10 min",
      category: "Focus",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
    {
      id: 2,
      title: "Deep Relaxation Journey",
      duration: "20 min",
      category: "Relaxation",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
    {
      id: 3,
      title: "Healing Energy Meditation",
      duration: "15 min",
      category: "Healing",
      image: "/placeholder.svg?height=200&width=200",
      premium: true,
    },
    {
      id: 4,
      title: "Stress Release Meditation",
      duration: "12 min",
      category: "Stress",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
  ]

  const workouts = [
    {
      id: 5,
      title: "HIIT Cardio Workout",
      duration: "25 min",
      category: "Cardio",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
    {
      id: 6,
      title: "Breathwork for Energy",
      duration: "15 min",
      category: "Breathwork",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
    {
      id: 7,
      title: "Full Body Strength",
      duration: "30 min",
      category: "Strength",
      image: "/placeholder.svg?height=200&width=200",
      premium: true,
    },
    {
      id: 8,
      title: "Yoga Flow",
      duration: "20 min",
      category: "Yoga",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
  ]

  const knowledge = [
    {
      id: 9,
      title: "Mastering Your Mindset",
      duration: "18 min",
      category: "Mindset",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
    {
      id: 10,
      title: "Productivity Principles",
      duration: "22 min",
      category: "Productivity",
      image: "/placeholder.svg?height=200&width=200",
      premium: true,
    },
    {
      id: 11,
      title: "Emotional Intelligence",
      duration: "25 min",
      category: "Emotions",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
    {
      id: 12,
      title: "The Science of Habits",
      duration: "20 min",
      category: "Habits",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
  ]

  const focus = [
    {
      id: 13,
      title: "Alpha Waves Focus",
      duration: "30 min",
      category: "Binaural",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
    {
      id: 14,
      title: "Deep Work Concentration",
      duration: "45 min",
      category: "Focus",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
    {
      id: 15,
      title: "Theta Waves Creativity",
      duration: "40 min",
      category: "Binaural",
      image: "/placeholder.svg?height=200&width=200",
      premium: true,
    },
    {
      id: 16,
      title: "Study Session Sounds",
      duration: "60 min",
      category: "Ambient",
      image: "/placeholder.svg?height=200&width=200",
      premium: false,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Audio Library"
        text="Guided meditations, workouts, knowledge talks, and focus sounds."
      />

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input placeholder="Search the library..." className="pl-8" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <Tabs defaultValue="meditations">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="meditations">Meditations</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="focus">Focus Sounds</TabsTrigger>
        </TabsList>
        <TabsContent value="meditations">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {meditations.map((item) => (
              <AudioCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="workouts">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {workouts.map((item) => (
              <AudioCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="knowledge">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {knowledge.map((item) => (
              <AudioCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="focus">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {focus.map((item) => (
              <AudioCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}


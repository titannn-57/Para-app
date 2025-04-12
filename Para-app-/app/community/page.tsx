import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Lock, Users, MessageSquare, Crown, Star } from "lucide-react"

export default function CommunityPage() {
  // User's current level (for demo purposes)
  const userLevel = 2

  const channels = [
    {
      id: 1,
      name: "General Discussion",
      description: "Connect with the PARA community",
      members: 2543,
      messages: 15432,
      requiredLevel: 1,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: 2,
      name: "Mentor Guidance",
      description: "Get advice from transformation experts",
      members: 1245,
      messages: 8765,
      requiredLevel: 2,
      icon: <Crown className="h-5 w-5" />,
    },
    {
      id: 3,
      name: "Challenge Groups",
      description: "Connect with others on the same challenge",
      members: 1876,
      messages: 12543,
      requiredLevel: 2,
      icon: <Star className="h-5 w-5" />,
    },
    {
      id: 4,
      name: "Advanced Practitioners",
      description: "Discussions for experienced members",
      members: 543,
      messages: 3210,
      requiredLevel: 3,
      icon: <Users className="h-5 w-5" />,
    },
  ]

  const events = [
    {
      id: 1,
      title: "Live Meditation Session",
      description: "Join our weekly group meditation",
      date: "April 7, 2025",
      time: "8:00 AM PST",
      participants: 156,
      requiredLevel: 1,
    },
    {
      id: 2,
      title: "Q&A with Transformation Expert",
      description: "Ask questions to our mindfulness coach",
      date: "April 10, 2025",
      time: "5:00 PM PST",
      participants: 89,
      requiredLevel: 2,
    },
    {
      id: 3,
      title: "Advanced Breathwork Workshop",
      description: "Learn advanced techniques for energy and focus",
      date: "April 15, 2025",
      time: "12:00 PM PST",
      participants: 42,
      requiredLevel: 3,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Community" text="Connect with mentors and fellow transformation seekers." />

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {userLevel}
          </div>
          <div>
            <h3 className="font-medium">You are at Level {userLevel}: Mentor Access</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You can access mentor guidance and challenge groups. Earn 150 more PARA Coins to unlock Level 3 and access
              all community features.
            </p>
            <div className="mt-2">
              <Button size="sm" variant="outline">
                View Level Benefits
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="channels">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="channels">Community Channels</TabsTrigger>
          <TabsTrigger value="events">Live Events</TabsTrigger>
        </TabsList>
        <TabsContent value="channels">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((channel) => (
              <Card key={channel.id} className={channel.requiredLevel > userLevel ? "opacity-75" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        {channel.icon}
                      </div>
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                    </div>
                    <Badge variant="outline">Level {channel.requiredLevel}+</Badge>
                  </div>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div>{channel.members.toLocaleString()} members</div>
                    <div>{channel.messages.toLocaleString()} messages</div>
                  </div>
                </CardContent>
                <CardFooter>
                  {channel.requiredLevel <= userLevel ? (
                    <Button className="w-full">Join Channel</Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      <Lock className="h-4 w-4 mr-2" /> Locked (Level {channel.requiredLevel} Required)
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="events">
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className={event.requiredLevel > userLevel ? "opacity-75" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{event.title}</CardTitle>
                    <Badge variant="outline">Level {event.requiredLevel}+</Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium">{event.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium">{event.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Participants</p>
                      <p className="font-medium">{event.participants} registered</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {event.requiredLevel <= userLevel ? (
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      Register for Event
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      <Lock className="h-4 w-4 mr-2" /> Locked (Level {event.requiredLevel} Required)
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}


import { Calendar, Headphones, MessageSquare, Coins, Bot, CheckCircle, Shield } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400" />,
      title: "41-Day Challenge",
      description:
        "Set personal goals, define daily tasks, and track your progress with our flagship transformation program.",
    },
    {
      icon: <Headphones className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />,
      title: "Functional Audio Library",
      description:
        "Access guided meditations, workout sessions, knowledge talks, and focus sounds to enhance your journey.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-purple-600 dark:text-purple-400" />,
      title: "Community Messaging",
      description:
        "Connect with mentors and like-minded individuals as you progress through your transformation levels.",
    },
    {
      icon: <Coins className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />,
      title: "PARA Coins",
      description:
        "Earn virtual currency by completing tasks and maintaining streaks to unlock premium content and features.",
    },
    {
      icon: <Bot className="h-10 w-10 text-purple-600 dark:text-purple-400" />,
      title: "AI Coaching",
      description: "Receive personalized guidance, reflections, and exercises from your AI coach to accelerate growth.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />,
      title: "Habit Reinforcement",
      description:
        "Build lasting habits with smart reminders, streak-based gamification, and accountability partnerships.",
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-600 dark:text-purple-400" />,
      title: "Privacy & Security",
      description:
        "Your transformation journey is protected with end-to-end encryption and customizable privacy settings.",
    },
  ]

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Key Features</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Everything you need to transform your life, all in one platform.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white text-center">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


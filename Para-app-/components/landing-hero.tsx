"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Heart, Dumbbell, Sparkles } from "lucide-react"

import backgroundImageDark from "../images/bg1.jpg"
import backgroundImageLight from "../images/bg3.jpg"

export function LandingHero() {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      {/* Light mode background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat block dark:hidden"
        style={{ backgroundImage: `url(${backgroundImageLight.src})` }}
      />

      {/* Dark mode background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block"
        style={{ backgroundImage: `url(${backgroundImageDark.src})` }}
      />

      {/* Overlay for blending */}
      <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-[2px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
          {/* LEFT SECTION */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Transform Your Life with</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                PARA
              </span>
            </h1>
            <p className="mt-4 text-base text-gray-700 dark:text-gray-300 sm:text-lg md:mt-6 md:text-xl">
              A holistic platform designed to help you evolve physically, mentally, emotionally, and spiritually through
              structured challenges, community engagement, and intelligent coaching.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-start gap-4">
              <Link href="/signup">
                <Button className="px-8 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 md:py-4 md:text-lg md:px-10">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="px-8 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT SECTION - FAT LOSS PROGRAM CARD */}
          <div className="w-full lg:w-2/5 mt-10 lg:mt-0">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
              <div className="h-12 w-12 rounded-md flex items-center justify-center mb-4 bg-pink-100 dark:bg-pink-900">
                <Dumbbell className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Fat Loss Program</h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                Burn fat effectively with science-backed workouts, guided nutrition plans, and daily tracking tools.
              </p>
              <Link href="/programs/fat-loss">
                <Button className="mt-4">Explore Program</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
                title: "Mental Growth",
                desc: "Enhance focus, clarity, and cognitive abilities through tailored exercises.",
                bg: "bg-purple-100 dark:bg-purple-900",
              },
              {
                icon: <Heart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                title: "Emotional Balance",
                desc: "Develop resilience and emotional intelligence through guided practices.",
                bg: "bg-indigo-100 dark:bg-indigo-900",
              },
              {
                icon: <Dumbbell className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
                title: "Physical Vitality",
                desc: "Build strength, endurance, and overall fitness with personalized routines.",
                bg: "bg-purple-100 dark:bg-purple-900",
              },
              {
                icon: <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                title: "Spiritual Wisdom",
                desc: "Deepen your connection to self and purpose through meditation and reflection.",
                bg: "bg-indigo-100 dark:bg-indigo-900",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105"
              >
                <div className={`h-12 w-12 rounded-md flex items-center justify-center mb-4 ${item.bg}`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Lock } from "lucide-react"
import Image from "next/image"

interface AudioItem {
  id: number
  title: string
  duration: string
  category: string
  image: string
  premium: boolean
}

interface AudioCardProps {
  item: AudioItem
}

export function AudioCard({ item }: AudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (item.premium) {
      // Show premium modal or redirect to upgrade page
      return
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-square">
        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
        {item.premium && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Lock className="h-8 w-8 text-white mx-auto" />
              <span className="text-white text-sm mt-2 block">Premium Content</span>
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium line-clamp-1">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.duration}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={togglePlay}
          variant={item.premium ? "outline" : "default"}
          className={`w-full ${
            !item.premium && isPlaying
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              : ""
          }`}
          size="sm"
        >
          {item.premium ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Unlock with Coins
            </>
          ) : isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Play
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}


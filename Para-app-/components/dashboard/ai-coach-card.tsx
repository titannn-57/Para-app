"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send } from "lucide-react"
import { getAICoachResponseAction } from "@/app/actions/ai-coach-actions"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export function AiCoachCard() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI coach. How can I help you with your transformation journey today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: message }])

    const userMessage = message
    setMessage("")
    setIsLoading(true)

    try {
      // Get AI response
      const response = await getAICoachResponseAction(userMessage)

      // Add AI response to chat
      setChatHistory((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Add error message to chat
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">AI Coach</CardTitle>
            <CardDescription className="text-xs">Powered by Gemini AI</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="flex-grow overflow-y-auto pb-2 pr-2"
        ref={chatContainerRef}
        style={{ maxHeight: "300px" }}
      >
        <div className="space-y-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  chat.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce"></div>
                  <div
                    className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full space-x-2">
          <Input
            placeholder="Ask your AI coach..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            disabled={isLoading || !message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}


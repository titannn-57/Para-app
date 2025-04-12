"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { saveUserProfile } from "@/lib/user"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({
    category: "",
    age: "",
    goals: [],
    interests: [],
    experience: "",
    bio: "",
  })

  const handleCategoryChange = (value: string) => {
    setProfile((prev) => ({ ...prev, category: value }))
  }

  const handleGoalToggle = (goal: string) => {
    setProfile((prev) => {
      const goals = [...prev.goals]
      if (goals.includes(goal)) {
        return { ...prev, goals: goals.filter((g) => g !== goal) }
      } else {
        return { ...prev, goals: [...goals, goal] }
      }
    })
  }

  const handleInterestToggle = (interest: string) => {
    setProfile((prev) => {
      const interests = [...prev.interests]
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter((i) => i !== interest) }
      } else {
        return { ...prev, interests: [...interests, interest] }
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would connect to your backend
      await saveUserProfile(profile)
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to PARA</CardTitle>
          <CardDescription className="text-center">
            Let&apos;s set up your profile to personalize your transformation journey
          </CardDescription>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-16 rounded-full ${
                    i <= step ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base">I am a...</Label>
                <RadioGroup
                  value={profile.category}
                  onValueChange={handleCategoryChange}
                  className="grid grid-cols-2 gap-4 mt-3"
                >
                  <div>
                    <RadioGroupItem value="student" id="student" className="peer sr-only" />
                    <Label
                      htmlFor="student"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 peer-data-[state=checked]:border-purple-600 dark:peer-data-[state=checked]:border-purple-400 [&:has([data-state=checked])]:border-purple-600 dark:[&:has([data-state=checked])]:border-purple-400"
                    >
                      <span>Student</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
                    <Label
                      htmlFor="professional"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 peer-data-[state=checked]:border-purple-600 dark:peer-data-[state=checked]:border-purple-400 [&:has([data-state=checked])]:border-purple-600 dark:[&:has([data-state=checked])]:border-purple-400"
                    >
                      <span>Professional</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="fitness_enthusiast" id="fitness_enthusiast" className="peer sr-only" />
                    <Label
                      htmlFor="fitness_enthusiast"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 peer-data-[state=checked]:border-purple-600 dark:peer-data-[state=checked]:border-purple-400 [&:has([data-state=checked])]:border-purple-600 dark:[&:has([data-state=checked])]:border-purple-400"
                    >
                      <span>Fitness Enthusiast</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="seeker" id="seeker" className="peer sr-only" />
                    <Label
                      htmlFor="seeker"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 peer-data-[state=checked]:border-purple-600 dark:peer-data-[state=checked]:border-purple-400 [&:has([data-state=checked])]:border-purple-600 dark:[&:has([data-state=checked])]:border-purple-400"
                    >
                      <span>Spiritual Seeker</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Your age"
                  value={profile.age}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base">What are your transformation goals?</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    "Mental Clarity",
                    "Physical Fitness",
                    "Emotional Balance",
                    "Spiritual Growth",
                    "Better Sleep",
                    "Stress Reduction",
                    "Improved Focus",
                    "Weight Management",
                  ].map((goal) => (
                    <div
                      key={goal}
                      className={`rounded-md border-2 p-3 cursor-pointer transition-all ${
                        profile.goals.includes(goal)
                          ? "border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => handleGoalToggle(goal)}
                    >
                      {goal}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-base">What are you interested in?</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    "Meditation",
                    "Yoga",
                    "Reading",
                    "Fitness",
                    "Nutrition",
                    "Mindfulness",
                    "Productivity",
                    "Personal Development",
                  ].map((interest) => (
                    <div
                      key={interest}
                      className={`rounded-md border-2 p-3 cursor-pointer transition-all ${
                        profile.interests.includes(interest)
                          ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experience">What is your experience with personal transformation?</Label>
                <RadioGroup
                  value={profile.experience}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, experience: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner - Just starting my journey</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate - Some experience with personal growth</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced - Experienced in personal development</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Tell us a bit about yourself</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Share your story, what motivates you, or what you hope to achieve..."
                  rows={4}
                  value={profile.bio}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          {step < 3 ? (
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={nextStep}
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}


"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Updated story structure to match Gemini API response
type StoryPage = {
  english: string
  chinese: string
  imagePrompt: string
  image?: string // Optional generated image URL
}

type Story = {
  title: {
    english: string
    chinese: string
  }
  parts: StoryPage[]
  // Keep original fields for backward compatibility
  chineseTitle?: string
  dedication?: string
  chineseDedication?: string
  pages?: StoryPage[] // For backward compatibility
  character?: string
  memory?: string
  name?: string
  age?: string
  tag?: string
}

type StoryContextType = {
  story: Story | null
  setStory: (story: Story) => void
  savedStories: Story[]
  saveStory: (story: Story) => void
}

const StoryContext = createContext<StoryContextType | undefined>(undefined)

export function StoryProvider({ children }: { children: ReactNode }) {
  const [story, setStory] = useState<Story | null>(null)
  const [savedStories, setSavedStories] = useState<Story[]>([])

  const saveStory = (storyToSave: Story) => {
    setSavedStories((prev) => [...prev, storyToSave])
  }

  return <StoryContext.Provider value={{ story, setStory, savedStories, saveStory }}>{children}</StoryContext.Provider>
}

export function useStory() {
  const context = useContext(StoryContext)
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider")
  }
  return context
}

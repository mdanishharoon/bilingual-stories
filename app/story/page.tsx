"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useStory } from "@/components/story-provider"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, Download, Save, BookOpen, Sparkles, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function StoryPage() {
  const router = useRouter()
  const { story, saveStory } = useStory()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(0)
  const [saved, setSaved] = useState(false)
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([])

  useEffect(() => {
    if (!story) {
      router.push("/create")
    } else {
      // Initialize loading states for images
      const storyPages = story.parts || story.pages || []
      setImageLoadingStates(new Array(storyPages.length).fill(false))
    }
  }, [story, router])

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Creating your magical story...</p>
        </div>
      </div>
    )
  }

  // Handle both new and old story structures
  const storyPages = story.parts || story.pages || []
  const storyTitle = typeof story.title === 'string' ? story.title : story.title?.english || 'Untitled Story'
  const chineseTitle = typeof story.title === 'string' ? story.chineseTitle : story.title?.chinese || ''
  const totalPages = storyPages.length

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const handleSaveStory = () => {
    saveStory(story)
    setSaved(true)
    toast({
      title: "✨ Story saved!",
      description: "Your magical story has been saved to your library.",
    })
  }

  const handleDownloadPDF = () => {
    toast({
      title: "📖 PDF Download",
      description: "This would download the story as a PDF in a real app.",
    })
  }

  const handleReadFullscreen = () => {
    router.push("/reader")
  }

  const handleImageLoad = (index: number) => {
    setImageLoadingStates(prev => {
      const newState = [...prev]
      newState[index] = false
      return newState
    })
  }

  const handleImageError = (index: number) => {
    setImageLoadingStates(prev => {
      const newState = [...prev]
      newState[index] = false
      return newState
    })
  }

  if (totalPages === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-purple-600 font-medium">No story content available</p>
          <Button onClick={() => router.push("/create")} className="mt-4">
            Create New Story
          </Button>
        </div>
      </div>
    )
  }

  const currentStoryPage = storyPages[currentPage]
  const isCustomImage = currentStoryPage.image && typeof currentStoryPage.image === 'string' && !currentStoryPage.image.includes('placeholder.svg')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-purple-300 opacity-40"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header with story title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-purple-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400 mr-2 animate-spin-slow" />
              {storyTitle} {chineseTitle && ` / ${chineseTitle}`}
            </h1>
            {story.dedication && (
              <p className="text-sm text-purple-600 italic mt-1">
                {story.dedication} {story.chineseDedication && ` • ${story.chineseDedication}`}
              </p>
            )}
            {isCustomImage && (
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 mr-1" />
                ✨ Featuring custom AI-generated illustrations
              </p>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200 mb-4">
            <div className="flex flex-col md:flex-row">
              {/* Left side - Image (smaller) */}
              <div className="md:w-2/5 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square w-full"
                  >
                    {imageLoadingStates[currentPage] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-purple-50 z-10">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto mb-2"></div>
                          <p className="text-xs text-purple-600">Loading custom image...</p>
                        </div>
                      </div>
                    )}
                    <Image
                      src={currentStoryPage.image || "/placeholder.svg"}
                      alt={currentStoryPage.imagePrompt || `Story part ${currentPage + 1}`}
                      fill
                      className="object-cover"
                      onLoad={() => handleImageLoad(currentPage)}
                      onError={() => handleImageError(currentPage)}
                    />
                    {isCustomImage && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        ✨ AI Art
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right side - Text content */}
              <div className="md:w-3/5 p-4 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-purple-700 mb-2">English</h3>
                      <p className="text-lg font-quicksand text-purple-900 leading-relaxed">
                        {currentStoryPage.english}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-purple-100">
                      <h3 className="text-lg font-medium text-purple-700 mb-2">中文</h3>
                      <p className="text-lg font-medium text-emerald-700 leading-relaxed">
                        {currentStoryPage.chinese}
                      </p>
                    </div>

                    {/* Show image prompt for debugging/development */}
                    {process.env.NODE_ENV === 'development' && currentStoryPage.imagePrompt && (
                      <div className="pt-3 border-t border-purple-100 mt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Image Prompt (Dev)</h4>
                        <p className="text-xs text-gray-400 italic">
                          {currentStoryPage.imagePrompt}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="p-3 bg-purple-50 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-1">Previous</span>
              </Button>

              <div className="text-purple-700 font-medium">
                Part {currentPage + 1} of {totalPages}
              </div>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <span className="mr-1">Next</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={handleSaveStory}
              disabled={saved}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" />
              {saved ? "✅ Saved" : "💾 Save to Library"}
            </Button>

            <Button
              onClick={handleDownloadPDF}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />📖 Download PDF
            </Button>

            <Button
              onClick={handleReadFullscreen}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
            >
              <BookOpen className="mr-2 h-4 w-4" />📱 Read Fullscreen
            </Button>

            <Button
              onClick={() => router.push("/create")}
              variant="outline"
              className="border-amber-400 text-amber-600 hover:bg-amber-50 shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />✨ Create New Story
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

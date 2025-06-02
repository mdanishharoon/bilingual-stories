"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useStory } from "@/components/story-provider"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useSwipeable } from "react-swipeable"
import Image from "next/image"

export default function Reader() {
  const router = useRouter()
  const { story } = useStory()
  const [currentPage, setCurrentPage] = useState(0)
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextPage(),
    onSwipedRight: () => handlePrevPage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  useEffect(() => {
    if (!story) {
      router.push("/create")
    }

    document.body.classList.add("overflow-hidden")

    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [story, router])

  if (!story) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading your magical story...</p>
        </div>
      </div>
    )
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(story.pages.length - 1, prev + 1))
  }

  const handleClose = () => {
    router.push("/story")
  }

  return (
    <div {...swipeHandlers} className="fixed inset-0 bg-gradient-to-br from-purple-900 to-pink-900 z-50 touch-none">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 text-white bg-purple-800/50 backdrop-blur-sm p-3 rounded-full hover:bg-purple-700/60 transition-colors shadow-lg"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
        {currentPage > 0 && (
          <button
            onClick={handlePrevPage}
            className="text-white bg-purple-800/50 backdrop-blur-sm p-3 rounded-full hover:bg-purple-700/60 transition-colors shadow-lg"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
        {currentPage < story.pages.length - 1 && (
          <button
            onClick={handleNextPage}
            className="text-white bg-purple-800/50 backdrop-blur-sm p-3 rounded-full hover:bg-purple-700/60 transition-colors shadow-lg"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-8"
        >
          {/* Image section - smaller */}
          <div className="w-full md:w-1/2 lg:w-2/5 relative h-1/3 md:h-3/4 mb-4 md:mb-0 md:mr-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={story.pages[currentPage].image || "/placeholder.svg"}
                alt={story.pages[currentPage].description}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Text section */}
          <div className="w-full md:w-1/2 lg:w-3/5 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white h-2/3 md:h-3/4 overflow-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-xl font-bold text-white mb-3">English</h3>
              <p className="text-xl md:text-2xl font-quicksand mb-6 leading-relaxed">
                {story.pages[currentPage].english}
              </p>

              <h3 className="text-xl font-bold text-amber-200 mb-3">中文</h3>
              <p className="text-xl md:text-2xl text-amber-100 font-medium leading-relaxed">
                {story.pages[currentPage].chinese}
              </p>
            </motion.div>
          </div>

          {/* Page indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {story.pages.map((_, index) => (
              <button
                key={index}
                className={`rounded-full transition-all ${
                  index === currentPage ? "bg-white w-6 h-3 shadow-lg" : "bg-white/60 w-3 h-3 hover:bg-white/80"
                }`}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

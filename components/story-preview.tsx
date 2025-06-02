"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const sampleStory = [
  {
    english: "The waves danced around their feet as they laughed together.",
    chinese: "海浪在他们的脚边舞动，他们一起笑着。",
    image: "/placeholder.svg?height=400&width=600",
    quote: "The day Grandma taught me to make dumplings...",
  },
  {
    english: "Grandma and Lily walked along the beach, collecting seashells.",
    chinese: "奶奶和莉莉沿着海滩散步，收集贝壳。",
    image: "/placeholder.svg?height=400&width=600",
    quote: "A magical afternoon by the ocean...",
  },
  {
    english: "Lily found a special shell that looked like a star.",
    chinese: "莉莉找到了一个特别的贝壳，看起来像一颗星星。",
    image: "/placeholder.svg?height=400&width=600",
    quote: "Discovering treasures together...",
  },
]

export default function StoryPreview() {
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % sampleStory.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative bg-gradient-to-br from-purple-100 to-purple-300 rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative"
        >
          <Image
            src={sampleStory[currentPage].image || "/placeholder.svg"}
            alt={`Story illustration ${currentPage + 1}`}
            fill
            className="object-cover"
          />

          {/* Content overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/30 to-transparent flex flex-col justify-end p-6">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-lg md:text-xl font-quicksand mb-2 leading-relaxed"
            >
              {sampleStory[currentPage].english}
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-amber-200 text-base md:text-lg font-medium mb-4"
            >
              {sampleStory[currentPage].chinese}
            </motion.p>

            {/* Quote */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-purple-200 text-sm italic"
            >
              "{sampleStory[currentPage].quote}"
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Page indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {sampleStory.map((_, index) => (
          <button
            key={index}
            className={`rounded-full transition-all duration-300 ${
              index === currentPage ? "bg-white w-6 h-3" : "bg-white/60 w-3 h-3 hover:bg-white/80"
            }`}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </div>
    </div>
  )
}

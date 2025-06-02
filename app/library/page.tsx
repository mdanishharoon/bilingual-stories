"use client"

import { motion } from "framer-motion"
import { useStory } from "@/components/story-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Book, Plus, Heart, Star, Sparkles } from "lucide-react"
import Image from "next/image"

export default function Library() {
  const { savedStories } = useStory()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-purple-300 opacity-40"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Star className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-pink-300 opacity-50"
          animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        >
          <Heart className="w-5 h-5" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-amber-300 opacity-40"
          animate={{ y: [0, -25, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        >
          <Sparkles className="w-7 h-7" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4 flex items-center justify-center">
              <Book className="w-8 h-8 text-purple-600 mr-2 animate-bounce-slow" />
              Your Story Library
              <Sparkles className="w-8 h-8 text-amber-400 ml-2 animate-spin-slow" />
            </h1>
            <p className="text-lg text-emerald-600 font-medium">Your collection of magical bilingual stories</p>
          </div>

          {savedStories.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center border-2 border-purple-200 max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Book className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-purple-700 mb-2">Your library is empty</h2>
              <p className="text-purple-600 mb-6">Create your first magical bilingual story to get started!</p>
              <Button
                onClick={() => router.push("/create")}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />✨ Create New Story
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedStories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 border-2 border-purple-100"
                  onClick={() => {
                    router.push("/story")
                  }}
                >
                  <div className="relative h-48">
                    <Image
                      src={story.pages[0].image || "/placeholder.svg"}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Heart className="w-6 h-6 text-pink-400" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-purple-700 mb-1">{story.title}</h2>
                    <p className="text-emerald-600 text-sm mb-2">{story.chineseTitle}</p>
                    <p className="text-purple-600 text-sm">{story.dedication}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: savedStories.length * 0.1 }}
                className="bg-purple-50 rounded-2xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-purple-100 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                onClick={() => router.push("/create")}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <p className="text-purple-600 font-medium text-center">Create New Story</p>
                <p className="text-purple-500 text-sm text-center mt-1">✨ Add more magic</p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

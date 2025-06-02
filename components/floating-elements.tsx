"use client"

import { motion } from "framer-motion"
import { Star, Heart, Sparkles } from "lucide-react"

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating stars */}
      <motion.div
        className="absolute top-20 left-10 text-amber-300 opacity-60"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Star className="w-6 h-6" />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-pink-300 opacity-50"
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Heart className="w-5 h-5" />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-20 text-purple-300 opacity-40"
        animate={{
          y: [0, -25, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Sparkles className="w-7 h-7" />
      </motion.div>

      <motion.div
        className="absolute top-60 left-1/2 text-emerald-300 opacity-30"
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        <Star className="w-4 h-4" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 text-rose-300 opacity-50"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
      >
        <Heart className="w-6 h-6" />
      </motion.div>

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-25 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  )
}

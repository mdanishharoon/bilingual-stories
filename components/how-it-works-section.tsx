"use client"

import { motion } from "framer-motion"
import { Heart, User, BookOpen, Sparkles } from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Share a Memory",
    description: "Tell us about a special family moment or cultural tradition",
    icon: Heart,
    color: "from-pink-400 to-rose-400",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  {
    number: 2,
    title: "Personalize",
    description: "Add your child's name and a photo to make the story special",
    icon: User,
    color: "from-amber-400 to-orange-400",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    number: 3,
    title: "Create Your Book",
    description: "Get a beautiful bilingual story that preserves your heritage",
    icon: BookOpen,
    color: "from-purple-400 to-violet-400",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
        <Sparkles className="w-8 h-8 text-emerald-400 animate-spin-slow" />
      </div>

      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-emerald-600 mb-4"
        >
          ✨ How It Works ✨
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-purple-600 max-w-2xl mx-auto"
        >
          Creating your magical bilingual story is as easy as 1, 2, 3!
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting lines for desktop */}
        <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-pink-200 via-amber-200 to-purple-200 transform -translate-y-1/2 z-0"></div>

        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative ${step.bgColor} ${step.borderColor} border-2 rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 z-10`}
          >
            {/* Step number */}
            <div
              className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
            >
              {step.number}
            </div>

            {/* Icon */}
            <div
              className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <step.icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-purple-700 mb-3">{step.title}</h3>
            <p className="text-purple-600 leading-relaxed">{step.description}</p>

            {/* Decorative sparkles */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-amber-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-300 rounded-full animate-bounce-slow"></div>
          </motion.div>
        ))}
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-lg text-purple-600 mb-4">Ready to create magic?</p>
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-1 animate-pulse">
            <div className="bg-white rounded-full px-6 py-2">
              <span className="text-purple-700 font-medium">It only takes 5 minutes! ⏰</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

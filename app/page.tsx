import Link from "next/link"
import { ArrowRight, BookOpen, Heart, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import StoryPreview from "@/components/story-preview"
import HowItWorksSection from "@/components/how-it-works-section"
import FloatingElements from "@/components/floating-elements"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden">
      <FloatingElements />

      <main className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Hero Content */}
          <div className="text-left animate-fade-in">
            <div className="relative mb-6">
              <h1 className="text-4xl md:text-6xl font-bold text-purple-700 mb-4 animate-float leading-tight">
                <span className="inline-flex items-center">
                  <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-amber-400 mr-2 animate-spin-slow" />
                  Create Magical
                </span>
                <br />
                Bilingual Stories
                <Star className="w-8 h-8 md:w-12 md:h-12 text-amber-400 ml-2 animate-bounce-slow inline-block" />
              </h1>
            </div>

            <p className="text-lg md:text-xl text-emerald-600 mb-8 max-w-lg animate-fade-in-delay font-medium">
              Preserve your family's cultural heritage through personalized bilingual storybooks that spark imagination
            </p>

            <Link href="/create" className="group inline-block">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 group-hover:-translate-y-1"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Start Your Story
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link
              href="/library"
              className="mt-6 flex items-center text-purple-700 hover:text-purple-800 font-medium ml-4"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              View Your Library
            </Link>
          </div>

          {/* Right Column - Story Preview */}
          <div className="relative animate-rise">
            <StoryPreview />
          </div>
        </div>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Additional Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-6 animate-fade-in">
            Why Families Love Our Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">Cultural Connection</h3>
              <p className="text-purple-600">
                Bridge generations and preserve precious family traditions through storytelling
              </p>
            </div>

            <div
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in"
                style={{ animationDelay: "0.2s" }}
              >
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">Language Learning</h3>
              <p className="text-purple-600">
                Help children learn multiple languages naturally through engaging stories
              </p>
            </div>

            <div
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in"
                style={{ animationDelay: "0.4s" }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">Magical Memories</h3>
              <p className="text-purple-600">Transform everyday moments into treasured bedtime stories</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Image as ImageIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStory } from "@/components/story-provider"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"

export default function CreateStoryPage() {
  const router = useRouter()
  const { setStory } = useStory()
  const { toast } = useToast()
  
  const [prompt, setPrompt] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [chineseLevel, setChineseLevel] = useState("")
  const [loading, setLoading] = useState(false)
  const [includeImages, setIncludeImages] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    
    // Simple URL validation and preview
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  const isValidImageUrl = (url: string) => {
    if (!url) return false
    try {
      const urlObj = new URL(url)
      // Check for valid protocols
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return false
      }
      // Check if it's a Google Images search result (not a direct image)
      if (url.includes('google.com/imgres') || url.includes('googleusercontent.com/proxy')) {
        return false
      }
      // Check for common image file extensions
      const pathname = urlObj.pathname.toLowerCase()
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
      const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext))
      
      // Allow if it has valid extension OR if it's from common image hosting services
      const commonHosts = ['imgur.com', 'postimg.cc', 'i.imgur.com', 'unsplash.com', 'picsum.photos']
      const isFromImageHost = commonHosts.some(host => urlObj.hostname.includes(host))
      
      return hasValidExtension || isFromImageHost
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim() || !ageGroup || !chineseLevel) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    if (includeImages && !isValidImageUrl(imageUrl)) {
      toast({
        title: "Invalid image URL",
        description: "Please enter a valid HTTP/HTTPS image URL.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      // Call the API route with the image URL directly
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          ageGroup,
          chineseLevel,
          includeImages,
          subjectReference: includeImages ? imageUrl : undefined,
          storyId: Date.now().toString()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.story) {
        throw new Error('No story data received from API')
      }

      setStory(data.story)

      toast({
        title: "✨ Story created!",
        description: includeImages 
          ? "Your magical bilingual story with custom images has been generated!"
          : "Your magical bilingual story has been generated!",
      })

      router.push("/story")
    } catch (error: any) {
      console.error("Error generating story:", error)
      toast({
        title: "Error creating story",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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
        <motion.div
          className="absolute top-40 right-20 text-pink-300 opacity-40"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-2 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-400 mr-3 animate-spin-slow" />
              Create Your Story
            </h1>
            <p className="text-purple-600 text-lg">
              Generate magical bilingual stories with AI
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border-2 border-purple-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="prompt" className="text-purple-700 font-medium">
                  Story Idea *
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Tell me about your story idea... (e.g., 'A brave little mouse who goes on an adventure to find magical cheese')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-2 min-h-[100px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age-group" className="text-purple-700 font-medium">
                    Age Group *
                  </Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup} required>
                    <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-5">3-5 years (Preschool)</SelectItem>
                      <SelectItem value="6-8">6-8 years (Early Elementary)</SelectItem>
                      <SelectItem value="9-12">9-12 years (Elementary)</SelectItem>
                      <SelectItem value="13+">13+ years (Teen/Adult)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="chinese-level" className="text-purple-700 font-medium">
                    Chinese Level *
                  </Label>
                  <Select value={chineseLevel} onValueChange={setChineseLevel} required>
                    <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select Chinese level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (Pinyin + Simple)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Characters)</SelectItem>
                      <SelectItem value="advanced">Advanced (Complex)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Generation Options */}
              <div className="border-t border-purple-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-purple-700 font-medium flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Generate Custom Images
                    </Label>
                    <p className="text-sm text-purple-600 mt-1">
                      Provide an image URL to create personalized story illustrations
                    </p>
                  </div>
                  <Switch
                    checked={includeImages}
                    onCheckedChange={setIncludeImages}
                    className="data-[state=checked]:bg-purple-600"
                  />
              </div>

                <AnimatePresence>
                  {includeImages && (
              <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="image-url" className="text-purple-700 font-medium">
                          Reference Image URL *
                        </Label>
                        <p className="text-sm text-purple-600 mb-3">
                          Enter the URL of an image featuring your character (child, pet, etc.)
                        </p>
                        
                        <div className="space-y-3">
                          <div className="relative">
                      <Input
                              id="image-url"
                              type="url"
                              placeholder="https://i.imgur.com/example.jpg"
                              value={imageUrl}
                              onChange={(e) => handleImageUrlChange(e.target.value)}
                              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-10"
                            />
                            <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                  </div>

                          {imageUrl && !isValidImageUrl(imageUrl) && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm text-red-700">
                                <strong>⚠️ Invalid URL:</strong> Please provide a direct link to an image file, not a Google Images search result. The URL should end with .jpg, .png, .gif, or .webp, or be from an image hosting service like Imgur.
                              </p>
                            </div>
                          )}
                          
                          {imagePreview && (
                            <div className="relative inline-block">
                              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-purple-200">
                                <Image
                                  src={imagePreview}
                                  alt="Image preview"
                                  width={128}
                                  height={128}
                                  className="w-full h-full object-cover"
                                  onError={() => {
                                    setImagePreview(null)
                                    toast({
                                      title: "Invalid image",
                                      description: "The image URL couldn't be loaded. Please check the URL.",
                                      variant: "destructive"
                                    })
                                  }}
                      />
                    </div>
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                ✓ Valid
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-700">
                          <strong>✨ AI Magic:</strong> The image from your URL will be used to create custom illustrations featuring your character in different story scenes. Make sure the image is publicly accessible and shows the character clearly.
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                          <strong>💡 How to get a direct image URL:</strong>
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                          <li>Upload to <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Imgur</a> and copy the direct link</li>
                          <li>Upload to <a href="https://postimg.cc" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">PostImg</a> and use the direct URL</li>
                          <li>Right-click any image online → "Copy image address" (not "Copy link")</li>
                          <li>❌ <strong>Don't use:</strong> Google Images search results or thumbnail URLs</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>

                <Button
                  type="submit"
                disabled={loading || !prompt.trim() || !ageGroup || !chineseLevel || (includeImages && !isValidImageUrl(imageUrl))}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    {includeImages ? "Creating story with images..." : "Creating your magical story..."}
                    </div>
                  ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create {includeImages ? "Illustrated " : ""}Story
                    <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-purple-600 text-sm">
              ✨ Stories are generated using AI and include both English and Chinese text
              {includeImages && " with custom illustrations"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

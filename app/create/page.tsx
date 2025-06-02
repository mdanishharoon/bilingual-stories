"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Upload, X, Image as ImageIcon } from "lucide-react"
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
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        })
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        })
        return
      }

      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setUploadedPhoto(null)
    setPhotoFile(null)
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data URL prefix to get just the base64 data
        const base64Data = result.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
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

    if (includeImages && !photoFile) {
      toast({
        title: "Photo required",
        description: "Please upload a photo to generate custom images.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      let subjectReference: string | undefined = undefined
      
      if (includeImages && photoFile) {
        // Convert the uploaded photo to base64 for the API
        subjectReference = await convertImageToBase64(photoFile)
      }

      // Call the API route instead of the function directly
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
          subjectReference,
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
                      Upload a photo to create personalized story illustrations
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
                        <Label className="text-purple-700 font-medium">
                          Upload Reference Photo *
                        </Label>
                        <p className="text-sm text-purple-600 mb-3">
                          Upload a photo of your child, pet, or character to include in the story
                        </p>
                        
                        {uploadedPhoto ? (
                          <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-purple-200">
                              <Image
                                src={uploadedPhoto}
                                alt="Uploaded reference"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                              onClick={removePhoto}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:border-purple-300 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                              id="photo-upload"
                            />
                            <Label
                              htmlFor="photo-upload"
                              className="cursor-pointer flex flex-col items-center space-y-2"
                            >
                              <Upload className="w-8 h-8 text-purple-400" />
                              <span className="text-purple-600 font-medium">
                                Click to upload photo
                              </span>
                              <span className="text-sm text-purple-500">
                                PNG, JPG, or WebP (max 5MB)
                              </span>
                            </Label>
                          </div>
                        )}
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-700">
                          <strong>✨ AI Magic:</strong> Your uploaded photo will be used to create custom illustrations featuring your character in different story scenes. The AI will maintain character consistency throughout the story.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                disabled={loading || !prompt.trim() || !ageGroup || !chineseLevel || (includeImages && !photoFile)}
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

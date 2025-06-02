// Updated page.tsx with image upload functionality
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStory } from "@/components/story-provider";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

export default function CreateStoryPage() {
  const router = useRouter();
  const { setStory } = useStory();
  const { toast } = useToast();

  const [prompt, setPrompt] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [chineseLevel, setChineseLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeImages, setIncludeImages] = useState(false);

  // Image upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string>("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // File upload handler - only create preview, don't upload yet
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, GIF, or WebP image.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);

      // Only create preview - NO UPLOAD YET
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);

      // Clear any previous imageUri
      setImageUri("");

      toast({
        title: "Image selected",
        description: "Image will be uploaded when you create the story.",
      });
    },
    []
  );

  // Remove the uploadImage function call from handleFileSelect
  // Remove the uploadImage function entirely

  // Modified handleSubmit to upload only when creating the story
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() || !ageGroup || !chineseLevel) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (includeImages && !selectedFile) {
      toast({
        title: "Missing image",
        description: "Please upload an image for custom illustrations.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      // Upload image only now, when actually creating the story
      if (includeImages && selectedFile) {
        setUploadLoading(true);
        try {
          imageUrl = await uploadToCloudStorage(selectedFile);
          setImageUri(imageUrl);

          toast({
            title: "Image uploaded",
            description: "Creating your story with custom images...",
          });
        } catch (error) {
          console.error("Image upload error:", error);
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          setUploadLoading(false);
          return;
        } finally {
          setUploadLoading(false);
        }
      }

      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          ageGroup,
          chineseLevel,
          includeImages,
          subjectReference: includeImages ? imageUrl : undefined,
          storyId: Date.now().toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.story) {
        throw new Error("No story data received from API");
      }

      setStory(data.story);

      toast({
        title: "✨ Story created!",
        description: includeImages
          ? "Your magical bilingual story with custom images has been generated!"
          : "Your magical bilingual story has been generated!",
      });

      router.push("/story");
    } catch (error: any) {
      console.error("Error generating story:", error);
      toast({
        title: "Error creating story",
        description:
          error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Alternative: Upload to cloud storage (implement based on your preference)
  const uploadToCloudStorage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    console.log(data.imageUrl);
    return data.imageUrl; // Return the public URL from your storage service
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setImageUri("");
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fakeEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-purple-300 opacity-40"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-pink-300 opacity-40"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
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
                  <Label
                    htmlFor="age-group"
                    className="text-purple-700 font-medium"
                  >
                    Age Group *
                  </Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup} required>
                    <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-5">3-5 years (Preschool)</SelectItem>
                      <SelectItem value="6-8">
                        6-8 years (Early Elementary)
                      </SelectItem>
                      <SelectItem value="9-12">
                        9-12 years (Elementary)
                      </SelectItem>
                      <SelectItem value="13+">
                        13+ years (Teen/Adult)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="chinese-level"
                    className="text-purple-700 font-medium"
                  >
                    Chinese Level *
                  </Label>
                  <Select
                    value={chineseLevel}
                    onValueChange={setChineseLevel}
                    required
                  >
                    <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select Chinese level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">
                        Beginner (Pinyin + Simple)
                      </SelectItem>
                      <SelectItem value="intermediate">
                        Intermediate (Characters)
                      </SelectItem>
                      <SelectItem value="advanced">
                        Advanced (Complex)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload Section */}
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
                      {/* Image Upload Area */}
                      {!selectedFile ? (
                        <div
                          className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                          <p className="text-purple-700 font-medium mb-2">
                            Upload Reference Image
                          </p>
                          <p className="text-sm text-purple-600 mb-4">
                            Drag and drop an image here, or click to browse
                          </p>
                          <p className="text-xs text-purple-500">
                            Supports JPEG, PNG, GIF, WebP (max 10MB)
                          </p>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Image Preview */}
                          <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            {imagePreview && (
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-purple-300 flex-shrink-0">
                                <Image
                                  src={imagePreview}
                                  alt="Uploaded image preview"
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                                {uploadLoading && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-purple-700 truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-sm text-purple-600">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                              {uploadLoading ? (
                                <p className="text-sm text-amber-600 mt-1 flex items-center">
                                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-amber-600 mr-2"></div>
                                  Uploading image...
                                </p>
                              ) : imageUri ? (
                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  Image uploaded successfully
                                </p>
                              ) : selectedFile ? (
                                <p className="text-sm text-blue-600 mt-1 flex items-center">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                  Ready to upload when creating story
                                </p>
                              ) : null}
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeImage}
                              disabled={uploadLoading}
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Help Text */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-700">
                          <strong>✨ AI Magic:</strong> Your uploaded image will
                          be used to create custom illustrations featuring your
                          character in different story scenes. Make sure the
                          image shows the character clearly for best results.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                disabled={
                  loading ||
                  !prompt.trim() ||
                  !ageGroup ||
                  !chineseLevel ||
                  (includeImages && !selectedFile) ||
                  uploadLoading
                }
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    {includeImages
                      ? "Creating story with images..."
                      : "Creating your magical story..."}
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
              ✨ Stories are generated using AI and include both English and
              Chinese text
              {includeImages && " with custom illustrations"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

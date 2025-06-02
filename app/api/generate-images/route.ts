import { NextRequest, NextResponse } from 'next/server'
import { generateStoryImages } from '@/lib/replicate-images'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storyParts, subjectReference, storyId } = body

    // Validate required fields
    if (!storyParts || !Array.isArray(storyParts) || storyParts.length === 0) {
      return NextResponse.json(
        { error: 'storyParts array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!subjectReference) {
      return NextResponse.json(
        { error: 'subjectReference (uploaded photo) is required' },
        { status: 400 }
      )
    }

    // Validate that each story part has an imagePrompt
    for (let i = 0; i < storyParts.length; i++) {
      if (!storyParts[i].imagePrompt) {
        return NextResponse.json(
          { error: `Story part ${i + 1} is missing imagePrompt` },
          { status: 400 }
        )
      }
    }

    console.log(`Starting image generation for ${storyParts.length} story parts`)

    // Generate images for all story parts
    const generatedImages = await generateStoryImages(
      storyParts,
      subjectReference,
      storyId || 'unknown'
    )

    console.log('Image generation completed successfully')

    return NextResponse.json({ 
      images: generatedImages,
      message: `Successfully generated ${generatedImages.length} images`
    })
  } catch (error) {
    console.error('Image generation API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { error: `Failed to generate images: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// Also support GET for testing purposes
export async function GET() {
  return NextResponse.json({ 
    message: 'Image generation API is running',
    endpoint: 'POST /api/generate-images',
    requiredFields: ['storyParts', 'subjectReference'],
    optionalFields: ['storyId']
  })
} 
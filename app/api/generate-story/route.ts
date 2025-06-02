import { NextRequest, NextResponse } from 'next/server'
import { generateCompleteStory } from '@/lib/gemini-story'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, ageGroup, chineseLevel, includeImages, subjectReference, storyId } = body

    // Validate required fields
    if (!prompt || !ageGroup || !chineseLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, ageGroup, and chineseLevel are required' },
        { status: 400 }
      )
    }

    // Validate image URL if images are requested
    if (includeImages && subjectReference) {
      try {
        new URL(subjectReference)
        if (!subjectReference.startsWith('http://') && !subjectReference.startsWith('https://')) {
          throw new Error('Invalid protocol')
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid image URL provided. Please provide a valid HTTP/HTTPS URL.' },
          { status: 400 }
        )
      }
    }

    // Generate the story
    const story = await generateCompleteStory(
      prompt,
      ageGroup,
      chineseLevel,
      {
        includeImages,
        subjectReference,
        storyId
      }
    )

    return NextResponse.json({ story })
  } catch (error: any) {
    console.error('Story generation error:', error)
    
    // Handle specific error types
    if (error.message?.includes('Gemini API key')) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      )
    }

    if (error.message?.includes('Replicate')) {
      return NextResponse.json(
        { error: 'Image generation service is not available' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'An error occurred while generating the story' },
      { status: 500 }
    )
  }
}

// Support GET for testing purposes
export async function GET() {
  return NextResponse.json({ 
    message: 'Story generation API is running',
    endpoint: 'POST /api/generate-story',
    requiredFields: ['prompt', 'ageGroup', 'chineseLevel'],
    optionalFields: ['includeImages', 'subjectReference', 'storyId']
  })
} 
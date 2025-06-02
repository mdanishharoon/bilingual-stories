import { NextRequest, NextResponse } from 'next/server'
import { generateCompleteStory } from '@/lib/gemini-story'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      prompt, 
      ageGroup, 
      chineseLevel, 
      includeImages = false, 
      subjectReference,
      storyId 
    } = body

    // Validate required fields
    if (!prompt || !ageGroup || !chineseLevel) {
      return NextResponse.json(
        { error: 'prompt, ageGroup, and chineseLevel are required' },
        { status: 400 }
      )
    }

    // If images are requested, validate subject reference
    if (includeImages && !subjectReference) {
      return NextResponse.json(
        { error: 'subjectReference is required when includeImages is true' },
        { status: 400 }
      )
    }

    console.log('Generating story with options:', { 
      prompt: prompt.substring(0, 50) + '...', 
      ageGroup, 
      chineseLevel, 
      includeImages,
      hasSubjectReference: !!subjectReference
    })

    // Generate the complete story
    const story = await generateCompleteStory(
      prompt,
      ageGroup,
      chineseLevel,
      {
        includeImages,
        subjectReference,
        storyId: storyId || Date.now().toString()
      }
    )

    console.log('Story generation completed successfully')

    return NextResponse.json({ 
      story,
      message: includeImages 
        ? 'Story generated successfully with custom images'
        : 'Story generated successfully'
    })
  } catch (error) {
    console.error('Story generation API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { error: `Failed to generate story: ${errorMessage}` },
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
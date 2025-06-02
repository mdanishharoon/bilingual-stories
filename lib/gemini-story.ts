import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateStoryImages as replicateGenerateStoryImages } from './replicate-images';

export interface StoryPart {
  english: string;
  chinese: string;
  imagePrompt: string;
  image?: string; // Optional generated image URL
}

export interface BilingualStory {
  title: {
    english: string;
    chinese: string;
  };
  parts: StoryPart[];
}

// Type alias for backward compatibility
export type Story = BilingualStory;

export async function generateBilingualStory(
  prompt: string,
  age: string,
  culturalTag?: string,
  memory?: string,
  childName?: string,
  companion?: string
): Promise<BilingualStory> {
  try {
    // Validate API key (only on server-side)
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert age to number for comparison
    const ageNum = parseInt(age, 10);
    let complexity = "simple";
    let wordLimit = "50-75";
    let vocabularyLevel = "basic";
    let imageEmphasis = "high";
    let interactionStyle = "";
    
    // Age-appropriate adjustments
    if (ageNum >= 8) {
      complexity = "moderate";
      wordLimit = "75-100";
      vocabularyLevel = "intermediate";
      imageEmphasis = "medium";
      interactionStyle = "thought-provoking questions and cultural discussions";
    } else if (ageNum >= 5) {
      complexity = "easy";
      wordLimit = "60-80";
      vocabularyLevel = "elementary";
      imageEmphasis = "medium-high";
      interactionStyle = "simple questions and counting activities";
    } else if (ageNum >= 3) {
      complexity = "very simple";
      wordLimit = "50-70";
      vocabularyLevel = "basic";
      imageEmphasis = "high";
      interactionStyle = "basic actions and sound effects";
    } else {
      complexity = "extremely simple";
      wordLimit = "30-50";
      vocabularyLevel = "basic";
      imageEmphasis = "very high";
      interactionStyle = "simple gestures and repetitive phrases";
    }

    // Cultural context setup
    const culturalContext = culturalTag 
      ? `Incorporate authentic ${culturalTag} cultural elements, traditions, and values naturally into the story.`
      : "Create a globally inclusive story that celebrates universal human values and experiences.";

    const systemPrompt = `You are a bilingual children's story generator that creates engaging stories in both English and Chinese, broken into exactly 5 parts for a picture book format.

    Key requirements for the Chinese translation:
    1. ALL text MUST be in Chinese characters - no English or Latin characters allowed
    2. Convert ALL measurements and numbers to Chinese characters (e.g., "1 year old" → "一岁")
    3. Translate ALL names to Chinese characters:
       - Western names should use phonetic translation
       - Family members should use proper Chinese terms (e.g., "Dad" → "爸爸", "Mom" → "妈妈", "Grandma" → "奶奶")
       - Cultural terms should use standard Chinese translations (e.g., "Indian" → "印度")
    4. Convert ALL actions and descriptions to natural Chinese:
       - "Dad bought toys" → "爸爸买了玩具"
       - "include spices" → "包括香料"
    5. Use appropriate Chinese measure words (量词) for all nouns
    6. Ensure all sentences follow Chinese grammar structure, not English structure
    7. Use Chinese punctuation (。，！？) instead of English punctuation, DO NOT USE ANY ENGLISH CHARACTERS WHATSOEVER

    Story Parameters:
    - Theme: ${prompt}
    - Age: ${age} years old
    ${childName ? `- Main Character: ${childName}` : '- Main Character: A young adventurer'}
    ${companion ? `- Companion: ${companion}` : '- Companion: A helpful friend'}

    The story should be age-appropriate with:
    - Complexity: ${complexity}
    - Word limit per part: ${wordLimit} words
    - Vocabulary level: ${vocabularyLevel}
    - Visual emphasis: ${imageEmphasis}
    - Interaction style: ${interactionStyle}

    ${culturalContext}

    ${memory ? `Weave this memory naturally into the narrative while maintaining cultural authenticity: ${memory}` : 'Create an original, engaging story.'}

    IMPORTANT: Break the story into exactly 5 parts. Each part should be a complete scene or moment that can be illustrated. For each part, also provide a detailed image generation prompt that describes the scene visually for AI image generation.

    Return ONLY a JSON object with this exact structure (no additional text):
    {
      "title": {
        "english": "Story title in English",
        "chinese": "Story title in Chinese (100% Chinese characters)"
      },
      "parts": [
        {
          "english": "Part 1 story text in English",
          "chinese": "Part 1 story text in Chinese (100% Chinese characters)",
          "imagePrompt": "Detailed image generation prompt for part 1 scene"
        },
        {
          "english": "Part 2 story text in English",
          "chinese": "Part 2 story text in Chinese (100% Chinese characters)",
          "imagePrompt": "Detailed image generation prompt for part 2 scene"
        },
        {
          "english": "Part 3 story text in English", 
          "chinese": "Part 3 story text in Chinese (100% Chinese characters)",
          "imagePrompt": "Detailed image generation prompt for part 3 scene"
        },
        {
          "english": "Part 4 story text in English",
          "chinese": "Part 4 story text in Chinese (100% Chinese characters)", 
          "imagePrompt": "Detailed image generation prompt for part 4 scene"
        },
        {
          "english": "Part 5 story text in English",
          "chinese": "Part 5 story text in Chinese (100% Chinese characters)",
          "imagePrompt": "Detailed image generation prompt for part 5 scene"
        }
      ]
    }`;

    try {
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      let text = response.text();
      
      // Remove markdown code blocks if present
      text = text.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      try {
        const story = JSON.parse(text) as BilingualStory;
        
        // Validate the story structure
        if (!story.title?.english || !story.title?.chinese || !story.parts || story.parts.length !== 5) {
          throw new Error('Invalid story format returned from API - must have title and exactly 5 parts');
        }

        // Validate each part
        for (let i = 0; i < story.parts.length; i++) {
          const part = story.parts[i];
          if (!part.english || !part.chinese || !part.imagePrompt) {
            throw new Error(`Part ${i + 1} is missing required fields`);
          }
        }

        // Check for English characters in Chinese text
        const hasEnglishInTitle = /[a-zA-Z]/.test(story.title.chinese);
        const hasEnglishInParts = story.parts.some(part => /[a-zA-Z]/.test(part.chinese));
        
        if (hasEnglishInTitle || hasEnglishInParts) {
          throw new Error('Chinese text contains English characters');
        }
        
        return story;
      } catch (parseError) {
        console.error('Failed to parse story JSON:', parseError);
        console.error('Raw API response:', text);
        throw new Error('Failed to generate properly formatted story');
      }
    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      throw new Error('Failed to communicate with Gemini API. Please check your API key and try again.');
    }
  } catch (error) {
    console.error('Error in generateBilingualStory:', error);
    throw error;
  }
}

/**
 * Generate images for all story parts using Replicate directly
 */
export async function generateStoryImages(
  storyParts: StoryPart[],
  subjectReference: string,
  storyId?: string
): Promise<StoryPart[]> {
  try {
    console.log('Generating images using Replicate API directly...')
    
    // Call the Replicate API directly instead of making internal fetch calls
    const generatedImages = await replicateGenerateStoryImages(
      storyParts,
      subjectReference,
      storyId || Date.now().toString()
    )

    // Update story parts with generated images
    const updatedStoryParts = storyParts.map((part, index) => ({
      ...part,
      image: generatedImages[index]?.url || undefined
    }))

    return updatedStoryParts
  } catch (error) {
    console.error('Error generating story images:', error)
    // Return original story parts without images if generation fails
    return storyParts
  }
}

/**
 * Generate a complete story with optional image generation
 */
export async function generateCompleteStory(
  prompt: string,
  ageGroup: string,
  chineseLevel: string,
  options: {
    includeImages?: boolean
    subjectReference?: string
    storyId?: string
  } = {}
): Promise<Story> {
  // First, generate the story text
  const story = await generateBilingualStory(
    prompt,
    ageGroup,
    undefined,
    undefined,
    undefined,
    undefined
  )
  
  // If images are requested and we have a subject reference, generate images
  if (options.includeImages && options.subjectReference && story.parts) {
    try {
      console.log('Generating images for story parts...')
      const partsWithImages = await generateStoryImages(
        story.parts,
        options.subjectReference,
        options.storyId
      )
      
      return {
        ...story,
        parts: partsWithImages
      }
    } catch (error) {
      console.error('Failed to generate images, returning story without images:', error)
      // Return story without images if image generation fails
      return story
    }
  }
  
  return story
} 
import Replicate from "replicate";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export interface ImageGenerationRequest {
  prompt: string;
  subjectReference: string; // URL or data URI of the reference image
  aspectRatio?: string;
}

export interface GeneratedImage {
  url: string;
  localPath?: string;
}

export async function generateImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
  try {
    // Validate API key (only on server-side)
    if (!process.env.REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set in environment variables');
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });

    const input = {
      prompt: request.prompt,
      aspect_ratio: request.aspectRatio || "3:4",
      subject_reference: request.subjectReference
    };

    console.log('Generating image with prompt:', request.prompt.substring(0, 100) + '...');
    console.log('Using subject reference URL:', request.subjectReference.substring(0, 50) + '...');
    
    const output = await replicate.run("minimax/image-01", { input }) as string[];
    
    if (!output || output.length === 0) {
      throw new Error('No image generated from Replicate API');
    }

    // Return the first generated image URL
    const imageUrl = output[0];
    
    return {
      url: imageUrl,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateStoryImages(
  storyParts: Array<{ imagePrompt: string }>,
  subjectReference: string,
  storyId: string
): Promise<GeneratedImage[]> {
  console.log(`Generating ${storyParts.length} images for story ${storyId}`);
  console.log('Using subject reference URL:', subjectReference);
  
  try {
    // Generate all images in parallel for better performance
    const imagePromises = storyParts.map(async (part, index) => {
      console.log(`Generating image ${index + 1}/${storyParts.length}`);
      
      // Enhance the prompt with consistent character description
      const enhancedPrompt = `${part.imagePrompt}. Children's book illustration style, warm and friendly, high quality digital art, colorful and vibrant.`;
      
      return generateImage({
        prompt: enhancedPrompt,
        subjectReference: subjectReference,
        aspectRatio: "3:4"
      });
    });

    const generatedImages = await Promise.all(imagePromises);
    console.log(`Successfully generated ${generatedImages.length} images`);
    
    return generatedImages;
  } catch (error) {
    console.error('Error generating story images:', error);
    throw new Error(`Failed to generate story images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to convert File to base64 data URI (kept for potential future use)
export async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper function to convert base64 data URI to buffer for saving (kept for potential future use)
export function dataUriToBuffer(dataUri: string): Buffer {
  const base64Data = dataUri.split(',')[1];
  return Buffer.from(base64Data, 'base64');
} 
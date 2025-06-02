// /api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('image') as File
        
        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.' },
                { status: 400 }
            )
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Please upload images smaller than 10MB.' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Convert to base64 data URI for Cloudinary
        const base64 = buffer.toString('base64')
        const dataUri = `data:${file.type};base64,${base64}`
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'story-images',
            resource_type: 'image',
        })
        
        return NextResponse.json({ imageUrl: result.secure_url })

    } catch (error) {
        console.error('Image upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json({ 
        message: 'Image upload API is running',
        endpoint: 'POST /api/upload-image',
        supportedFormats: ['JPEG', 'PNG', 'GIF', 'WebP'],
        maxSize: '10MB',
        storage: 'Cloudinary'
    })
}

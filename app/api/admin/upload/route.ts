import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { prisma } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productType = formData.get('productType') as string
    const productId = formData.get('productId') as string

    if (!file || !productType || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate unique file key
    const fileExtension = file.name.split('.').pop()
    const fileKey = `${productType}s/${productId}/${uuidv4()}.${fileExtension}`

    // Upload to storage
    const buffer = Buffer.from(await file.arrayBuffer())
    await storage.uploadFile(fileKey, buffer, file.type)

    // Save to database
    await prisma.frProductFile.upsert({
      where: {
        product_type_product_id: {
          product_type: productType as any,
          product_id: parseInt(productId)
        }
      },
      update: {
        file_storage_key: fileKey
      },
      create: {
        product_type: productType as any,
        product_id: parseInt(productId),
        file_storage_key: fileKey
      }
    })

    return NextResponse.json({ success: true, fileKey })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
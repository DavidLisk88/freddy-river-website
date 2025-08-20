import { NextRequest, NextResponse } from 'next/server'
import { downloadTokens } from '@/lib/download-tokens'
import { storage } from '@/lib/storage'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token

    // Validate and use token
    const downloadToken = await downloadTokens.validateAndUseToken(token)
    
    // Get product file
    const productFile = await prisma.frProductFile.findUnique({
      where: {
        product_type_product_id: {
          product_type: downloadToken.orderItem.product_type,
          product_id: downloadToken.orderItem.product_id
        }
      }
    })

    if (!productFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Generate signed download URL
    const signedUrl = await storage.getSignedDownloadUrl(productFile.file_storage_key, 300) // 5 minutes

    // Redirect to signed URL
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error('Download error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
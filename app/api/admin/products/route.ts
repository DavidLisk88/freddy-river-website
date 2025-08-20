import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [beats, samples] = await Promise.all([
      prisma.frBeat.findMany({
        include: {
          productFiles: true,
          collaborators: {
            include: {
              collaborator: true
            }
          }
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.frSample.findMany({
        include: {
          productFiles: true,
          collaborators: {
            include: {
              collaborator: true
            }
          }
        },
        orderBy: { created_at: 'desc' }
      })
    ])

    return NextResponse.json({ beats, samples })
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { type, ...productData } = data

    let product
    if (type === 'beat') {
      product = await prisma.frBeat.create({
        data: {
          title: productData.title,
          genre: productData.genre,
          bpm: productData.bpm,
          co_producer: productData.co_producer,
          lease_price: productData.lease_price,
          exclusive_price: productData.exclusive_price,
          preview_url: productData.preview_url,
          store_url: productData.store_url,
          is_available: productData.is_available ?? true,
        }
      })
    } else {
      product = await prisma.frSample.create({
        data: {
          title: productData.title,
          bpm: productData.bpm,
          musical_key: productData.musical_key,
          belongs_to_pack: productData.belongs_to_pack ?? false,
          sample_pack: productData.sample_pack,
          lease_price: productData.lease_price,
          exclusive_price: productData.exclusive_price,
          preview_url: productData.preview_url,
          store_url: productData.store_url,
          is_available: productData.is_available ?? true,
        }
      })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
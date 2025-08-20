import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const data = await request.json()
    const { type, id } = params

    let product
    if (type === 'beat') {
      product = await prisma.frBeat.update({
        where: { beat_id: parseInt(id) },
        data: {
          title: data.title,
          genre: data.genre,
          bpm: data.bpm,
          co_producer: data.co_producer,
          lease_price: data.lease_price,
          exclusive_price: data.exclusive_price,
          preview_url: data.preview_url,
          store_url: data.store_url,
          is_available: data.is_available,
        }
      })
    } else {
      product = await prisma.frSample.update({
        where: { sample_id: parseInt(id) },
        data: {
          title: data.title,
          bpm: data.bpm,
          musical_key: data.musical_key,
          belongs_to_pack: data.belongs_to_pack,
          sample_pack: data.sample_pack,
          lease_price: data.lease_price,
          exclusive_price: data.exclusive_price,
          preview_url: data.preview_url,
          store_url: data.store_url,
          is_available: data.is_available,
        }
      })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params

    if (type === 'beat') {
      await prisma.frBeat.delete({
        where: { beat_id: parseInt(id) }
      })
    } else {
      await prisma.frSample.delete({
        where: { sample_id: parseInt(id) }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
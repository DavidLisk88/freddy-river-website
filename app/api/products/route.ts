import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [beats, samples] = await Promise.all([
      prisma.frBeat.findMany({
        where: { is_available: true },
        include: {
          productFiles: true
        }
      }),
      prisma.frSample.findMany({
        where: { is_available: true },
        include: {
          productFiles: true
        }
      })
    ])

    // Transform to match your existing frontend format
    const products = [
      ...beats.map(beat => ({
        id: beat.beat_id.toString(),
        title: beat.title,
        price: Number(beat.lease_price),
        exclusivePrice: Number(beat.exclusive_price),
        bpm: beat.bpm || 120,
        key: 'Am', // You might want to add this field to your schema
        tags: beat.genre ? [beat.genre.toLowerCase()] : [],
        audioUrl: beat.preview_url || '/placeholder.mp3',
        imageUrl: '/placeholder.svg',
        description: `${beat.genre || 'Hip-Hop'} beat at ${beat.bpm} BPM`,
        type: 'beat' as const,
        duration: '3:24', // You might want to add this field
        genre: beat.genre || 'Hip-Hop',
        mood: 'Energetic', // You might want to add this field
        featured: false,
        hasFiles: beat.productFiles.length > 0
      })),
      ...samples.map(sample => ({
        id: sample.sample_id.toString(),
        title: sample.title,
        price: Number(sample.lease_price),
        exclusivePrice: Number(sample.exclusive_price),
        bpm: sample.bpm || 0,
        key: sample.musical_key || 'Various',
        tags: sample.sample_pack ? ['sample-pack'] : ['sample'],
        audioUrl: sample.preview_url || '/placeholder.mp3',
        imageUrl: '/placeholder.svg',
        description: sample.belongs_to_pack 
          ? `Part of ${sample.sample_pack} sample pack`
          : 'Individual sample',
        type: 'sample-pack' as const,
        duration: sample.belongs_to_pack ? '50 samples' : '1 sample',
        genre: 'Various',
        mood: 'Various',
        featured: false,
        hasFiles: sample.productFiles.length > 0
      }))
    ]

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
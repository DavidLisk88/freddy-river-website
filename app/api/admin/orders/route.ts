import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const orders = await prisma.frOrder.findMany({
      include: {
        customer: true,
        items: {
          include: {
            beat: true,
            sample: true,
            downloadTokens: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
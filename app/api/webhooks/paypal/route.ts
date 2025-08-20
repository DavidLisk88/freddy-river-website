import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const event = JSON.parse(body)

  // Log webhook
  await prisma.frWebhooksLog.create({
    data: {
      provider: 'paypal',
      event_type: event.event_type,
      payload_json: body,
    }
  })

  try {
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(event)
        break
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED':
        await handlePaymentFailed(event)
        break
      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayPal webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentCompleted(event: any) {
  const paymentId = event.resource.id
  
  // Update order status
  const order = await prisma.frOrder.findFirst({
    where: { provider_payment_id: paymentId }
  })

  if (order) {
    await prisma.frOrder.update({
      where: { id: order.id },
      data: { status: 'paid' }
    })
  }
}

async function handlePaymentFailed(event: any) {
  const paymentId = event.resource.id
  
  // Update order status
  const order = await prisma.frOrder.findFirst({
    where: { provider_payment_id: paymentId }
  })

  if (order) {
    await prisma.frOrder.update({
      where: { id: order.id },
      data: { status: 'failed' }
    })
  }
}
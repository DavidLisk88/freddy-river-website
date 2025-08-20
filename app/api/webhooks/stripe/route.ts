import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { downloadTokens } from '@/lib/download-tokens'
import { revenueSplits } from '@/lib/revenue-splits'
import { email } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Log webhook
  await prisma.frWebhooksLog.create({
    data: {
      provider: 'stripe',
      event_type: event.type,
      payload_json: JSON.stringify(event),
    }
  })

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: any) {
  const { customer_email, metadata } = session
  const items = JSON.parse(metadata.items)
  const customerName = metadata.customerName

  // Create customer if not exists
  let customer = await prisma.frCustomer.findUnique({
    where: { email: customer_email }
  })

  if (!customer) {
    customer = await prisma.frCustomer.create({
      data: {
        email: customer_email,
        name: customerName,
      }
    })
  }

  // Calculate total
  let totalCents = 0
  for (const item of items) {
    const { productId, productType, licenseType, quantity = 1 } = item
    
    let product, price
    if (productType === 'beat') {
      product = await prisma.frBeat.findUnique({
        where: { beat_id: parseInt(productId) }
      })
      price = licenseType === 'exclusive' ? product?.exclusive_price : product?.lease_price
    } else {
      product = await prisma.frSample.findUnique({
        where: { sample_id: parseInt(productId) }
      })
      price = licenseType === 'exclusive' ? product?.exclusive_price : product?.lease_price
    }

    if (product && price) {
      totalCents += Math.round(Number(price) * 100) * quantity
    }
  }

  // Create order
  const order = await prisma.frOrder.create({
    data: {
      customer_id: customer.id,
      provider: 'stripe',
      provider_payment_id: session.id,
      status: 'paid',
      total_cents: totalCents,
      currency: 'USD',
    }
  })

  // Create order items
  const orderItems = []
  for (const item of items) {
    const { productId, productType, licenseType, quantity = 1 } = item
    
    let product, price
    if (productType === 'beat') {
      product = await prisma.frBeat.findUnique({
        where: { beat_id: parseInt(productId) }
      })
      price = licenseType === 'exclusive' ? product?.exclusive_price : product?.lease_price
    } else {
      product = await prisma.frSample.findUnique({
        where: { sample_id: parseInt(productId) }
      })
      price = licenseType === 'exclusive' ? product?.exclusive_price : product?.lease_price
    }

    if (product && price) {
      const orderItem = await prisma.frOrderItem.create({
        data: {
          order_id: order.id,
          product_type: productType,
          product_id: parseInt(productId),
          unit_price_cents: Math.round(Number(price) * 100),
          quantity,
        }
      })

      orderItems.push({
        ...orderItem,
        title: product.title
      })

      // Handle exclusive purchases
      if (licenseType === 'exclusive' && productType === 'beat') {
        await prisma.frBeat.update({
          where: { beat_id: parseInt(productId) },
          data: {
            is_available: false,
            exclusively_owned_by: customer_email
          }
        })
      }
    }
  }

  // Process revenue splits
  await revenueSplits.processStripePayouts(Number(order.id))

  // Create download tokens
  const tokens = await downloadTokens.createTokensForOrder(Number(order.id))

  // Send download email
  const downloadItems = tokens.map(token => ({
    title: orderItems.find(item => item.id === token.order_item_id)?.title || 'Unknown',
    downloadUrl: downloadTokens.generateDownloadUrl(token.token),
    expiresAt: token.expires_at
  }))

  await email.sendDownloadLinks(customer_email, customerName, downloadItems)
}

async function handlePaymentFailed(paymentIntent: any) {
  // Update order status if exists
  const order = await prisma.frOrder.findFirst({
    where: { provider_payment_id: paymentIntent.id }
  })

  if (order) {
    await prisma.frOrder.update({
      where: { id: order.id },
      data: { status: 'failed' }
    })
  }
}
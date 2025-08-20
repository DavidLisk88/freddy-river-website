import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo } = await request.json()

    // Calculate total and prepare line items
    let totalAmount = 0
    const lineItems = []

    for (const item of items) {
      const { productId, productType, licenseType, quantity = 1 } = item
      
      // Fetch product details
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

      if (!product || !price) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const priceInCents = Math.round(Number(price) * 100)
      totalAmount += priceInCents * quantity

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.title} (${licenseType} license)`,
            description: productType === 'beat' ? `Beat - ${product.genre}` : 'Sample',
          },
          unit_amount: priceInCents,
        },
        quantity,
      })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        items: JSON.stringify(items),
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { paypal } from '@/lib/paypal'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo } = await request.json()

    // Calculate total and prepare collaborator splits
    let totalAmount = 0
    const collaboratorPayouts: Array<{email: string, amount: number}> = []

    for (const item of items) {
      const { productId, productType, licenseType, quantity = 1 } = item
      
      // Fetch product details with collaborators
      let product, price, collaborators
      if (productType === 'beat') {
        const beatData = await prisma.frBeat.findUnique({
          where: { beat_id: parseInt(productId) },
          include: {
            collaborators: {
              include: {
                collaborator: true
              }
            }
          }
        })
        product = beatData
        price = licenseType === 'exclusive' ? beatData?.exclusive_price : beatData?.lease_price
        collaborators = beatData?.collaborators || []
      } else {
        const sampleData = await prisma.frSample.findUnique({
          where: { sample_id: parseInt(productId) },
          include: {
            collaborators: {
              include: {
                collaborator: true
              }
            }
          }
        })
        product = sampleData
        price = licenseType === 'exclusive' ? sampleData?.exclusive_price : sampleData?.lease_price
        collaborators = sampleData?.collaborators || []
      }

      if (!product || !price) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const priceInCents = Math.round(Number(price) * 100)
      const itemTotal = priceInCents * quantity
      totalAmount += itemTotal

      // Calculate collaborator splits
      for (const collab of collaborators) {
        if (collab.collaborator.paypal_payer_id) {
          const splitAmount = Math.floor(itemTotal * (Number(collab.split_percent) / 100))
          const existingPayout = collaboratorPayouts.find(p => p.email === collab.collaborator.email)
          
          if (existingPayout) {
            existingPayout.amount += splitAmount
          } else {
            collaboratorPayouts.push({
              email: collab.collaborator.email,
              amount: splitAmount
            })
          }
        }
      }
    }

    // Create PayPal order with splits
    const order = await paypal.createOrder(totalAmount, 'USD', collaboratorPayouts)

    return NextResponse.json({ 
      orderId: order.id,
      approvalUrl: order.links?.find((link: any) => link.rel === 'approve')?.href
    })
  } catch (error) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, customerInfo, items } = await request.json()

    // Capture the PayPal order
    const captureResult = await paypal.captureOrder(orderId)

    if (captureResult.status === 'COMPLETED') {
      // Create customer if not exists
      let customer = await prisma.frCustomer.findUnique({
        where: { email: customerInfo.email }
      })

      if (!customer) {
        customer = await prisma.frCustomer.create({
          data: {
            email: customerInfo.email,
            name: customerInfo.name,
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
          provider: 'paypal',
          provider_payment_id: orderId,
          status: 'paid',
          total_cents: totalCents,
          currency: 'USD',
        }
      })

      // Create order items
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
          await prisma.frOrderItem.create({
            data: {
              order_id: order.id,
              product_type: productType,
              product_id: parseInt(productId),
              unit_price_cents: Math.round(Number(price) * 100),
              quantity,
            }
          })

          // Handle exclusive purchases
          if (licenseType === 'exclusive' && productType === 'beat') {
            await prisma.frBeat.update({
              where: { beat_id: parseInt(productId) },
              data: {
                is_available: false,
                exclusively_owned_by: customerInfo.email
              }
            })
          }
        }
      }

      // TODO: Create download tokens and send email
      // This would be handled by a background job or webhook

      return NextResponse.json({ success: true, orderId: order.id })
    } else {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json({ error: 'Failed to capture PayPal payment' }, { status: 500 })
  }
}
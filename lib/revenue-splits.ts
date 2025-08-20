import { prisma } from './db'
import { stripe, stripeConnect } from './stripe'
import { paypal } from './paypal'

export const revenueSplits = {
  async processStripePayouts(orderId: number) {
    const order = await prisma.frOrder.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            beat: {
              include: {
                collaborators: {
                  include: {
                    collaborator: true
                  }
                }
              }
            },
            sample: {
              include: {
                collaborators: {
                  include: {
                    collaborator: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) throw new Error('Order not found')

    const transferGroup = `order_${order.id}_${Date.now()}`

    for (const item of order.items) {
      const collaborators = item.product_type === 'beat' 
        ? item.beat?.collaborators || []
        : item.sample?.collaborators || []

      if (collaborators.length === 0) continue

      const itemTotal = item.unit_price_cents * item.quantity
      
      for (const collab of collaborators) {
        if (!collab.collaborator.stripe_account_id) continue

        const splitAmount = Math.floor(itemTotal * (Number(collab.split_percent) / 100))
        
        if (splitAmount > 0) {
          try {
            await stripeConnect.createTransfer(
              splitAmount,
              collab.collaborator.stripe_account_id,
              transferGroup
            )
          } catch (error) {
            console.error(`Failed to transfer to ${collab.collaborator.email}:`, error)
          }
        }
      }
    }
  },

  async processPayPalPayouts(orderId: number) {
    // PayPal payouts would be handled during the initial payment creation
    // This is more complex and typically requires PayPal's Payouts API
    // For now, we'll log the payout requirements
    
    const order = await prisma.frOrder.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            beat: {
              include: {
                collaborators: {
                  include: {
                    collaborator: true
                  }
                }
              }
            },
            sample: {
              include: {
                collaborators: {
                  include: {
                    collaborator: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) throw new Error('Order not found')

    // Log payout requirements for manual processing or batch processing
    console.log(`PayPal payouts needed for order ${orderId}:`)
    
    for (const item of order.items) {
      const collaborators = item.product_type === 'beat' 
        ? item.beat?.collaborators || []
        : item.sample?.collaborators || []

      const itemTotal = item.unit_price_cents * item.quantity
      
      for (const collab of collaborators) {
        if (!collab.collaborator.paypal_payer_id) continue

        const splitAmount = Math.floor(itemTotal * (Number(collab.split_percent) / 100))
        console.log(`- ${collab.collaborator.email}: $${splitAmount / 100}`)
      }
    }
  }
}
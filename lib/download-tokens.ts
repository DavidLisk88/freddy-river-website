import { prisma } from './db'
import { v4 as uuidv4 } from 'uuid'

export const downloadTokens = {
  async createTokensForOrder(orderId: number) {
    const order = await prisma.frOrder.findUnique({
      where: { id: orderId },
      include: { items: true }
    })

    if (!order) throw new Error('Order not found')

    const ttlHours = parseInt(process.env.DOWNLOAD_LINK_TTL_HOURS || '48')
    const maxDownloads = parseInt(process.env.MAX_DOWNLOADS_PER_ITEM || '3')
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000)

    const tokens = []
    for (const item of order.items) {
      const token = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '').substring(0, 16)
      
      const downloadToken = await prisma.frDownloadToken.create({
        data: {
          order_item_id: item.id,
          token,
          expires_at: expiresAt,
          max_downloads: maxDownloads,
        }
      })

      tokens.push({
        ...downloadToken,
        orderItem: item
      })
    }

    return tokens
  },

  async validateAndUseToken(token: string) {
    const downloadToken = await prisma.frDownloadToken.findUnique({
      where: { token },
      include: {
        orderItem: {
          include: {
            order: true
          }
        }
      }
    })

    if (!downloadToken) {
      throw new Error('Invalid download token')
    }

    if (downloadToken.expires_at < new Date()) {
      throw new Error('Download token has expired')
    }

    if (downloadToken.downloads_used >= downloadToken.max_downloads) {
      throw new Error('Maximum downloads exceeded')
    }

    // Increment usage
    await prisma.frDownloadToken.update({
      where: { id: downloadToken.id },
      data: { downloads_used: downloadToken.downloads_used + 1 }
    })

    return downloadToken
  },

  generateDownloadUrl(token: string) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    return `${baseUrl}/api/download/${token}`
  }
}
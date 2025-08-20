interface PayPalConfig {
  clientId: string
  clientSecret: string
  mode: 'sandbox' | 'live'
}

class PayPalClient {
  private config: PayPalConfig
  private baseUrl: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.config = {
      clientId: process.env.PAYPAL_CLIENT_ID!,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
      mode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox'
    }
    this.baseUrl = this.config.mode === 'sandbox' 
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com'
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    })

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // 1 minute buffer

    return this.accessToken
  }

  async createOrder(amount: number, currency: string = 'USD', payees?: Array<{email: string, amount: number}>) {
    const accessToken = await this.getAccessToken()
    
    const orderData: any = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: (amount / 100).toFixed(2)
        }
      }]
    }

    // Add payee information for split payments
    if (payees && payees.length > 0) {
      orderData.purchase_units[0].payee = {
        email_address: payees[0].email
      }
      
      if (payees.length > 1) {
        orderData.purchase_units[0].payment_instruction = {
          disbursement_mode: 'INSTANT',
          platform_fees: payees.slice(1).map(payee => ({
            amount: {
              currency_code: currency,
              value: (payee.amount / 100).toFixed(2)
            },
            payee: {
              email_address: payee.email
            }
          }))
        }
      }
    }

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    return await response.json()
  }

  async captureOrder(orderId: string) {
    const accessToken = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    })

    return await response.json()
  }

  async getOrder(orderId: string) {
    const accessToken = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    return await response.json()
  }
}

export const paypal = new PayPalClient()
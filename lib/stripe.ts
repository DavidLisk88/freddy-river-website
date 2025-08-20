import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

export const stripeConnect = {
  clientId: process.env.STRIPE_CONNECT_CLIENT_ID!,
  
  async createExpressAccount(email: string, country: string = 'US') {
    return await stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
  },

  async createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
    return await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })
  },

  async createTransfer(amount: number, destination: string, transferGroup?: string) {
    return await stripe.transfers.create({
      amount,
      currency: 'usd',
      destination,
      transfer_group: transferGroup,
    })
  }
}
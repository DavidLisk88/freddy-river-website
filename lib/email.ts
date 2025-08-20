import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const email = {
  async sendDownloadLinks(
    to: string,
    customerName: string,
    orderItems: Array<{
      title: string
      downloadUrl: string
      expiresAt: Date
    }>
  ) {
    const expiryHours = process.env.DOWNLOAD_LINK_TTL_HOURS || '48'
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Thank you for your purchase!</h1>
        <p>Hi ${customerName},</p>
        <p>Your order has been processed successfully. Here are your download links:</p>
        
        ${orderItems.map(item => `
          <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0;">${item.title}</h3>
            <a href="${item.downloadUrl}" 
               style="background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; display: inline-block;">
              Download Now
            </a>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              This link expires on ${item.expiresAt.toLocaleString()}
            </p>
          </div>
        `).join('')}
        
        <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h4>Important Notes:</h4>
          <ul>
            <li>Download links expire in ${expiryHours} hours</li>
            <li>Each item can be downloaded up to ${process.env.MAX_DOWNLOADS_PER_ITEM || 3} times</li>
            <li>Files are for your personal/commercial use as per our license terms</li>
          </ul>
        </div>
        
        <p>If you have any issues with your downloads, please contact us.</p>
        <p>Best regards,<br>Freddy River Team</p>
      </div>
    `

    return await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject: 'Your Freddy River Downloads Are Ready!',
      html,
    })
  },

  async sendCollaboratorInvite(to: string, name: string, onboardingUrl: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Freddy River Collaborators!</h1>
        <p>Hi ${name},</p>
        <p>You've been invited to join as a collaborator on Freddy River. To start receiving payouts, please complete your account setup:</p>
        
        <a href="${onboardingUrl}" 
           style="background: #007cba; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
          Complete Setup
        </a>
        
        <p>This will allow you to receive your share of revenue from collaborative tracks.</p>
        <p>Best regards,<br>Freddy River Team</p>
      </div>
    `

    return await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject: 'Complete Your Freddy River Collaborator Setup',
      html,
    })
  }
}
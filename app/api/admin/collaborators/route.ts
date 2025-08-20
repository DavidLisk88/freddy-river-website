import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { stripeConnect } from '@/lib/stripe'
import { email } from '@/lib/email'

export async function GET() {
  try {
    const collaborators = await prisma.frCollaborator.findMany({
      include: {
        beatCollaborations: {
          include: {
            beat: true
          }
        },
        sampleCollaborations: {
          include: {
            sample: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(collaborators)
  } catch (error) {
    console.error('Error fetching collaborators:', error)
    return NextResponse.json({ error: 'Failed to fetch collaborators' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email: collaboratorEmail } = await request.json()

    // Create collaborator
    const collaborator = await prisma.frCollaborator.create({
      data: {
        name,
        email: collaboratorEmail,
      }
    })

    // Create Stripe Express account
    try {
      const account = await stripeConnect.createExpressAccount(collaboratorEmail)
      
      // Update collaborator with Stripe account ID
      await prisma.frCollaborator.update({
        where: { id: collaborator.id },
        data: { stripe_account_id: account.id }
      })

      // Create onboarding link
      const accountLink = await stripeConnect.createAccountLink(
        account.id,
        `${process.env.NEXTAUTH_URL}/admin/collaborators`,
        `${process.env.NEXTAUTH_URL}/admin/collaborators?setup=complete`
      )

      // Send invitation email
      await email.sendCollaboratorInvite(collaboratorEmail, name, accountLink.url)

      return NextResponse.json({ 
        ...collaborator, 
        stripe_account_id: account.id,
        onboarding_url: accountLink.url 
      })
    } catch (stripeError) {
      console.error('Stripe account creation failed:', stripeError)
      // Return collaborator without Stripe setup
      return NextResponse.json(collaborator)
    }
  } catch (error) {
    console.error('Error creating collaborator:', error)
    return NextResponse.json({ error: 'Failed to create collaborator' }, { status: 500 })
  }
}
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample beats
  const beats = await Promise.all([
    prisma.frBeat.create({
      data: {
        title: 'Midnight Vibes',
        genre: 'Trap',
        bpm: 140,
        co_producer: null,
        lease_price: 29.99,
        exclusive_price: 299.99,
        preview_url: '/placeholder.mp3',
        store_url: null,
        is_available: true,
        exclusively_owned_by: null,
      }
    }),
    prisma.frBeat.create({
      data: {
        title: 'Golden Hour',
        genre: 'Lo-Fi',
        bpm: 85,
        co_producer: null,
        lease_price: 24.99,
        exclusive_price: 249.99,
        preview_url: '/placeholder.mp3',
        store_url: null,
        is_available: true,
        exclusively_owned_by: null,
      }
    }),
    prisma.frBeat.create({
      data: {
        title: 'Urban Dreams',
        genre: 'Hip-Hop',
        bpm: 128,
        co_producer: null,
        lease_price: 34.99,
        exclusive_price: 349.99,
        preview_url: '/placeholder.mp3',
        store_url: null,
        is_available: true,
        exclusively_owned_by: null,
      }
    })
  ])

  // Create sample samples
  const samples = await Promise.all([
    prisma.frSample.create({
      data: {
        title: 'Trap Essentials Vol. 1',
        bpm: null,
        musical_key: 'Various',
        belongs_to_pack: true,
        sample_pack: 'Trap Essentials',
        lease_price: 49.99,
        exclusive_price: 199.99,
        preview_url: '/placeholder.mp3',
        store_url: null,
        is_available: true,
      }
    }),
    prisma.frSample.create({
      data: {
        title: 'R&B Soul Pack',
        bpm: null,
        musical_key: 'Various',
        belongs_to_pack: true,
        sample_pack: 'R&B Soul Collection',
        lease_price: 44.99,
        exclusive_price: 179.99,
        preview_url: '/placeholder.mp3',
        store_url: null,
        is_available: true,
      }
    })
  ])

  // Create sample collaborator
  const collaborator = await prisma.frCollaborator.create({
    data: {
      name: 'John Producer',
      email: 'john@example.com',
      stripe_account_id: null,
      paypal_payer_id: null,
    }
  })

  // Add collaborator to first beat with 50% split
  await prisma.frBeatCollaborator.create({
    data: {
      beat_id: beats[0].beat_id,
      collaborator_id: collaborator.id,
      split_percent: 50.00,
    }
  })

  console.log('Database seeded successfully!')
  console.log(`Created ${beats.length} beats`)
  console.log(`Created ${samples.length} samples`)
  console.log(`Created 1 collaborator`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
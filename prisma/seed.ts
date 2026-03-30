import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbPath = path.join(__dirname, 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter } as unknown as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  console.log('Seeding database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('nativearchival2024', 12)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@nativearchival.com' },
    update: {},
    create: {
      email: 'admin@nativearchival.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })
  console.log('Created admin:', admin.email)

  // Products
  const products = [
    {
      name: 'Classic Photo Album',
      slug: 'classic-photo-album',
      description: 'Acid-free, lignin-free photo album with archival-quality pages. Holds up to 200 4x6 photos in protective sleeves. Linen cover with gold foil spine label. Made in Palmyra, NY.',
      price: 34.95,
      comparePrice: 44.95,
      category: 'Albums',
      inventory: 150,
      featured: true,
      active: true,
    },
    {
      name: 'Archival Memory Box',
      slug: 'archival-memory-box',
      description: 'Heavy-duty archival storage box for preserving your most treasured photographs and documents. Acid-free interior, clamshell design. Perfect for long-term storage.',
      price: 28.50,
      comparePrice: null,
      category: 'Photo Storage',
      inventory: 200,
      featured: true,
      active: true,
    },
    {
      name: 'Print Preserver Sleeves — 8x10 (25-pack)',
      slug: 'print-preserver-8x10-25pack',
      description: 'Crystal-clear archival sleeves for 8x10 prints. UV-resistant, acid-free polypropylene protects against moisture, dust, and fingerprints. Pack of 25.',
      price: 18.95,
      comparePrice: 24.00,
      category: 'Print Preservers',
      inventory: 500,
      featured: true,
      active: true,
    },
    {
      name: 'Professional Portfolio Case',
      slug: 'professional-portfolio-case',
      description: 'Sleek presentation portfolio with 24 archival-quality acetate pages. Black faux-leather cover. Ideal for photographers, artists, and designers presenting their finest work.',
      price: 52.00,
      comparePrice: null,
      category: 'Portfolios',
      inventory: 75,
      featured: true,
      active: true,
    },
    {
      name: 'Trading Card Binder — 9-Pocket',
      slug: 'trading-card-binder-9-pocket',
      description: 'Archival-quality 9-pocket binder for trading card collectors. Acid-free pages protect cards from fading, warping, and damage. Fits standard 2.5x3.5 cards.',
      price: 22.00,
      comparePrice: null,
      category: 'Card Collectors',
      inventory: 300,
      featured: false,
      active: true,
    },
    {
      name: 'Panoramic Photo Album',
      slug: 'panoramic-photo-album',
      description: 'Extra-wide archival album for panoramic prints and landscape photography. Holds up to 100 panoramic photos in acid-free sleeves. Premium cloth cover.',
      price: 42.00,
      comparePrice: 55.00,
      category: 'Albums',
      inventory: 80,
      featured: false,
      active: true,
    },
    {
      name: 'Document Preservation Sleeves — Letter (50-pack)',
      slug: 'document-sleeves-letter-50pack',
      description: 'Protect important documents, certificates, and paper records with these heavyweight archival sleeves. Letter-size (8.5x11). Pack of 50.',
      price: 24.95,
      comparePrice: null,
      category: 'Print Preservers',
      inventory: 400,
      featured: false,
      active: true,
    },
    {
      name: 'Card Collector Top Loaders — 100-pack',
      slug: 'card-top-loaders-100pack',
      description: 'Rigid archival top loaders for premium card protection. Crystal-clear PVC construction. Standard size for trading cards. Prevents bending, scratching, and UV damage.',
      price: 15.95,
      comparePrice: 19.99,
      category: 'Card Collectors',
      inventory: 1000,
      featured: false,
      active: true,
    },
  ]

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    console.log('Created product:', created.name)
  }

  // Blog post
  const blogPost = await prisma.blogPost.upsert({
    where: { slug: 'how-to-store-photos-for-100-years' },
    update: {},
    create: {
      title: 'How to Store Your Photographs for 100 Years',
      slug: 'how-to-store-photos-for-100-years',
      excerpt: 'Photographs are irreplaceable — yet most are stored in conditions that guarantee they will not survive. Here is how to give your photos a century of life.',
      content: `<h2>The Enemy of Photographs</h2>
<p>Three forces destroy photographs: light, humidity, and acid. Most commercial storage products contribute to all three. The key to archival storage is eliminating each threat systematically.</p>

<h2>Acid-Free Storage Is Non-Negotiable</h2>
<p>Ordinary paper and cardboard are acidic. Over time, this acid migrates into photographs, causing yellowing, brittleness, and eventual disintegration. Every sleeve, box, and album that touches your photographs should be certified acid-free and lignin-free.</p>

<h2>Temperature and Humidity Control</h2>
<p>The ideal storage environment is cool (60–70°F) and dry (30–40% relative humidity). Basements and attics are the worst places to store photographs — both experience dramatic temperature and humidity swings.</p>

<h2>Light Exposure</h2>
<p>UV light bleaches photographic dye layers. Store prints in opaque, archival boxes when not on display. For framed photographs, use UV-filtering glazing.</p>

<h2>The Right Materials</h2>
<p>Use polypropylene or polyethylene sleeves, not PVC. PVC off-gasses chemicals that damage photographs over time. All Native Archival products are made from archival-grade materials tested to Photographic Activity Test (PAT) standards.</p>

<h2>Digitize Everything</h2>
<p>Physical preservation and digital backup work together. Scan your most important photographs at high resolution (600 DPI minimum for prints) and store backups in multiple locations.</p>`,
      published: true,
      publishedAt: new Date('2024-03-15'),
      tags: JSON.stringify(['photography', 'preservation', 'archival tips']),
    },
  })
  console.log('Created blog post:', blogPost.title)

  // Sample customers
  const customer1 = await prisma.customer.upsert({
    where: { email: 'sarah.johnson@example.com' },
    update: {},
    create: {
      email: 'sarah.johnson@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '585-555-0101',
      address: '142 Oak Street',
      city: 'Rochester',
      state: 'NY',
      zip: '14604',
    },
  })

  const customer2 = await prisma.customer.upsert({
    where: { email: 'mark.tanner@example.com' },
    update: {},
    create: {
      email: 'mark.tanner@example.com',
      firstName: 'Mark',
      lastName: 'Tanner',
      phone: '716-555-0202',
      address: '87 Maple Avenue',
      city: 'Buffalo',
      state: 'NY',
      zip: '14201',
    },
  })
  console.log('Created customers:', customer1.email, customer2.email)

  // Get product IDs for orders
  const albumProduct = await prisma.product.findUnique({ where: { slug: 'classic-photo-album' } })
  const preserverProduct = await prisma.product.findUnique({ where: { slug: 'print-preserver-8x10-25pack' } })
  const portfolioProduct = await prisma.product.findUnique({ where: { slug: 'professional-portfolio-case' } })

  if (albumProduct && preserverProduct && portfolioProduct) {
    // Order 1
    await prisma.order.upsert({
      where: { orderNumber: 'NA-SEED001' },
      update: {},
      create: {
        orderNumber: 'NA-SEED001',
        status: 'delivered',
        customerId: customer1.id,
        subtotal: 53.90,
        shipping: 0,
        tax: 4.31,
        total: 58.21,
        shippingAddress: '142 Oak Street, Rochester, NY 14604',
        items: {
          create: [
            { productId: albumProduct.id, quantity: 1, price: albumProduct.price },
            { productId: preserverProduct.id, quantity: 1, price: preserverProduct.price },
          ],
        },
      },
    })

    // Order 2
    await prisma.order.upsert({
      where: { orderNumber: 'NA-SEED002' },
      update: {},
      create: {
        orderNumber: 'NA-SEED002',
        status: 'processing',
        customerId: customer2.id,
        subtotal: 52.00,
        shipping: 0,
        tax: 4.16,
        total: 56.16,
        shippingAddress: '87 Maple Avenue, Buffalo, NY 14201',
        items: {
          create: [
            { productId: portfolioProduct.id, quantity: 1, price: portfolioProduct.price },
          ],
        },
      },
    })

    // Order 3
    await prisma.order.upsert({
      where: { orderNumber: 'NA-SEED003' },
      update: {},
      create: {
        orderNumber: 'NA-SEED003',
        status: 'pending',
        customerId: customer1.id,
        subtotal: 34.95,
        shipping: 8.95,
        tax: 2.80,
        total: 46.70,
        shippingAddress: '142 Oak Street, Rochester, NY 14604',
        items: {
          create: [
            { productId: albumProduct.id, quantity: 1, price: albumProduct.price },
          ],
        },
      },
    })
    console.log('Created sample orders')
  }

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const products = await prisma.product.findMany()
    console.log('Successfully fetched products:', products.length)
    if (products.length > 0) {
      console.log('First product:', products[0].name)
    } else {
      console.log('No products found in the database.')
    }
  } catch (error) {
    console.error('Connection test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

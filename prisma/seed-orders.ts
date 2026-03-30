import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING ELITE MARKET SEEDING ---');

  // 1. Ensure Products Exist
  const products = await prisma.product.findMany();
  if (products.length === 0) {
    console.log('No products found. Please seed products first.');
    return;
  }

  // 2. Clear existing orders (optional, but good for clean demo)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  // 3. Generate Realistic Orders (Last 30 Days)
  const statuses = ['ACCEPTED', 'ACCEPTED', 'ACCEPTED', 'PENDING', 'CANCELLED'];
  const customers = [
    { name: 'Budi Santoso', phone: '081234567890', address: 'Jl. Melati No. 5, Jakarta' },
    { name: 'Siti Aminah', phone: '085678912344', address: 'Perum Gading Serpong, Tangerang' },
    { name: 'Davin Adi', phone: '081122334455', address: 'Apartemen Park View, Lt. 12, Bekasi' },
    { name: 'Rina Wijaya', phone: '087788990011', address: 'Jl. Diponegoro No. 88, Bandung' },
    { name: 'Andi Pratama', phone: '089900112233', address: 'Kavling Hijau, Blok C1, Depok' }
  ];

  for (let i = 0; i < 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const qty1 = Math.floor(Math.random() * 3) + 1;
    const qty2 = Math.floor(Math.random() * 2) + 1;
    
    const p1 = products[Math.floor(Math.random() * products.length)];
    const p2 = products[Math.floor(Math.random() * products.length)];

    const totalPrice = (p1.price * qty1) + (p2.price * qty2);

    await prisma.order.create({
      data: {
        customerName: customer.name,
        whatsappNumber: customer.phone,
        customerAddress: customer.address,
        totalPrice: totalPrice,
        status: status,
        createdAt: date,
        items: {
          create: [
            { productId: p1.id, quantity: qty1 },
            { productId: p2.id, quantity: qty2 }
          ]
        }
      }
    });
  }

  console.log('--- ELITE MARKET SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from "../lib/prisma";

async function main() {
  await prisma.product.deleteMany({});
  
  const products = [
    {
      name: "BBQ Banana Chips",
      price: 15000,
      image: "/assets/bbq.png",
      isHero: true,
      rating: 4.7,
      deliveryTime: "1-2 Jam",
      description: "Savory and spicy BBQ seasoned banana chips. A perfect crunchy snack for any time.",
      stock: 100
    },
    {
      name: "Coklat Banana Chips",
      price: 15000,
      image: "/assets/coklat.png",
      isHero: false,
      rating: 4.9,
      deliveryTime: "1-2 Jam",
      description: "Rich chocolate covered banana chips. A classic favorite for chocolate lovers.",
      stock: 100
    },
    {
      name: "Greentea Ban Chips",
      price: 15000,
      image: "/assets/matcha.png",
      isHero: false,
      rating: 4.8,
      deliveryTime: "1-2 Jam",
      description: "Authentic Matcha green tea coated banana chips. Sweet and earthy in every crunch.",
      stock: 100
    },
    {
      name: "Keju Susu Chips",
      price: 15000,
      image: "/assets/susu.png",
      isHero: false,
      rating: 4.6,
      deliveryTime: "1-2 Jam",
      description: "Creamy cheese and milk seasoned banana chips. A unique sweet and salty combination.",
      stock: 100
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log("Database updated with 15k prices and stock 100!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

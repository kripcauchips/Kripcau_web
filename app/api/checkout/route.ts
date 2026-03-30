import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { items, customerName, whatsappNumber, customerAddress } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total price
    const totalPrice = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // Create the order in the database (Status defaults to PENDING)
    const order = await prisma.order.create({
      data: {
        customerName: customerName || "Guest",
        whatsappNumber: whatsappNumber || "N/A",
        customerAddress: customerAddress || null,
        totalPrice: totalPrice,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      message: "Order received! Waiting for admin approval." 
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

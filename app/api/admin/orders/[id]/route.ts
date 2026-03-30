import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin-session');
    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id);
    const { status } = await request.json();

    // Start a transaction to ensure stock consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get the existing order with items
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!existingOrder) throw new Error('Order not found');
      
      // If accepting a PENDING order, decrease stock
      if (status === 'ACCEPTED' && existingOrder.status === 'PENDING') {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity }
            }
          });
        }
      }

      // If cancelling an already ACCEPTED order, restore stock
      if (status === 'CANCELLED' && existingOrder.status === 'ACCEPTED') {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity }
            }
          });
        }
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status }
      });

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update order status' }, { status: 500 });
  }
}

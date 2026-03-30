import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    console.log('[API/PRODUCTS] Successfully fetched', products.length, 'products');
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('[API/PRODUCTS] Error fetching products:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack
    });
    return NextResponse.json({ error: 'Failed to fetch products', details: error?.message }, { status: 500 });
  }
}

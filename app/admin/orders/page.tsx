export const dynamic = 'force-dynamic';

import React from 'react';
import prisma from '@/lib/prisma';
import OrderList from './OrderList';
import { ShoppingCart, Filter } from 'lucide-react';

async function getOrders() {
  // Use 'order' (lowercase) or 'Order' based on schema. Prisma usually maps to lowercase.
  return await (prisma as any).order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Precision Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '56px', fontWeight: '900', margin: 0, letterSpacing: '-0.04em', lineHeight: '1' }}>Orders</h1>
          <p style={{ margin: '12px 0 0 0', color: 'var(--admin-text-muted)', fontSize: '16px', fontWeight: '700', letterSpacing: '0.02em' }}>Monitor and process incoming customer purchases.</p>
        </div>
      </div>

      {/* Synchronized List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <OrderList initialOrders={JSON.parse(JSON.stringify(orders))} />
      </div>
    </div>
  );
}

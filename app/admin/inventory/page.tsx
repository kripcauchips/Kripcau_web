export const dynamic = 'force-dynamic';

import React from 'react';
import prisma from '@/lib/prisma';
import InventoryTable from './InventoryTable';
import { Package, TrendingUp } from 'lucide-react';

async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { id: 'asc' }
  });
}

export default async function InventoryPage() {
  const products = await getProducts();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Refined Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '56px', fontWeight: '900', margin: 0, letterSpacing: '-0.04em', lineHeight: '1' }}>Inventory</h1>
          <p style={{ margin: '12px 0 0 0', color: 'var(--admin-text-muted)', fontSize: '16px', fontWeight: '700', letterSpacing: '0.02em' }}>Stock Management & Product Overviews</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
         <InventoryStat label="Total Items" value={products.length.toString()} icon={Package} />
         <InventoryStat label="Low Stock" value={products.filter(p => p.stock < 10).length.toString()} icon={TrendingUp} color="#ef4444" />
      </div>

      {/* Main Inventory List */}
      <div>
        <InventoryTable initialProducts={products} />
      </div>
    </div>
  );
}

function InventoryStat({ label, value, icon: Icon, color }: any) {
  return (
    <div style={{ background: 'white', padding: '24px 32px', borderRadius: '24px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow)', display: 'flex', alignItems: 'center', gap: '20px' }}>
       <div style={{ padding: '12px', borderRadius: '14px', background: color ? `${color}10` : 'rgba(27, 60, 51, 0.05)', color: color || 'var(--admin-primary)' }}>
         <Icon size={22} strokeWidth={3} />
       </div>
       <div>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
          <p style={{ margin: '2px 0 0 0', fontSize: '24px', fontWeight: '900', color: 'var(--admin-primary)' }}>{value}</p>
       </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import TradingViewChart from './TradingViewChart';
import { 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  Package, 
  Zap,
  Target,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

async function getStats() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [revenueData, orderVolume, pendingOrders, productCount, chartRawData] = await Promise.all([
    (prisma as any).order.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'ACCEPTED' }
    }),
    (prisma as any).order.count({
      where: { status: 'ACCEPTED' }
    }),
    (prisma as any).order.count({
      where: { status: 'PENDING' }
    }),
    prisma.product.count(),
    (prisma as any).order.findMany({
      where: { 
        status: 'ACCEPTED',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { createdAt: true, totalPrice: true },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  const dailyData: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(thirtyDaysAgo.getDate() + i); // Start from 30 days ago
    const dateStr = d.toISOString().split('T')[0];
    dailyData[dateStr] = 0;
  }

  chartRawData.forEach((order: any) => {
    if (order.createdAt) {
      const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
      dailyData[dateStr] = (dailyData[dateStr] || 0) + (Number(order.totalPrice) || 0);
    }
  });

  const chartData = Object.entries(dailyData)
    .map(([time, value]) => ({ time, value }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return {
    revenue: Number(revenueData._sum.totalPrice) || 0,
    volume: orderVolume || 0,
    pending: pendingOrders || 0,
    inventory: productCount || 0,
    chartData
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', animation: 'fadeIn 0.5s ease-out', padding: '0 0 60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '56px', fontWeight: '900', margin: 0, letterSpacing: '-0.04em', lineHeight: '1' }}>Dashboard</h1>
          <p style={{ margin: '12px 0 0 0', color: 'var(--admin-text-muted)', fontSize: '16px', fontWeight: '700', letterSpacing: '0.02em' }}>Management Overview & Real-Time Performance</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
            <button className="admin-primary-btn" style={{ padding: '14px 28px', borderRadius: '14px', background: 'var(--admin-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '900' }}>
                <Target size={18} strokeWidth={3} />
                Export
            </button>
            <button style={{ background: 'white', border: '1px solid var(--admin-border)', padding: '14px 28px', borderRadius: '14px', fontWeight: '900', color: 'var(--admin-primary)', cursor: 'pointer' }}>
                <BarChart3 size={18} strokeWidth={3} />
                Analytics
            </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <PerformanceTile 
          label="Total Revenue" 
          value={`Rp ${stats.revenue.toLocaleString('id-ID')}`} 
          trend="+18.4%" 
          icon={TrendingUp} 
          color="#FFB300"
        />
        <PerformanceTile 
          label="Confirmed Orders" 
          value={stats.volume.toString()} 
          trend="+4.2%" 
          icon={ShoppingCart} 
          color="#10b981"
        />
        <PerformanceTile 
          label="Pending Review" 
          value={stats.pending.toString()} 
          trend={stats.pending > 10 ? 'High' : 'Normal'} 
          icon={Clock} 
          color={stats.pending > 10 ? '#ef4444' : '#6366f1'}
        />
        <PerformanceTile 
          label="Product Catalog" 
          value={stats.inventory.toString()} 
          trend="Active" 
          icon={Package} 
          color="#1B3C33"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }}>
        <div className="admin-card" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--admin-primary)', margin: 0 }}>Revenue Analysis</h3>
            </div>
            <Suspense fallback={<div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>Updating Chart...</div>}>
                <TradingViewChart data={stats.chartData} />
            </Suspense>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="admin-card" style={{ padding: '40px', background: 'var(--admin-sidebar-bg)', color: 'white', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ padding: '12px', borderRadius: '16px', background: 'var(--admin-accent)' }}>
                        <Zap size={22} color="var(--admin-primary)" strokeWidth={3} />
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', margin: 0 }}>Quick Links</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <TacticalLink href="/admin/orders" title="Manage Orders" count={stats.volume} icon={ShoppingCart} />
                    <TacticalLink href="/admin/inventory" title="Manage Inventory" count={stats.inventory} icon={Package} />
                </div>
            </div>

            {stats.pending > 0 && (
                <div className="admin-card" style={{ padding: '32px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                   <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <ShieldAlert size={28} color="#ef4444" strokeWidth={3} />
                      <div>
                         <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#ef4444' }}>Pending Actions</h4>
                         <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(239, 68, 68, 0.8)', fontWeight: '700' }}>There are {stats.pending} orders awaiting authorization.</p>
                      </div>
                   </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function PerformanceTile({ label, value, trend, icon: Icon, color }: any) {
  return (
    <div className="admin-card admin-interactive-card" style={{ padding: '32px', border: '1px solid var(--admin-border)', background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ padding: '12px', borderRadius: '14px', background: `${color}10`, color: color }}>
           <Icon size={24} strokeWidth={3} />
        </div>
        <div style={{ color: color, fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>{trend}</div>
      </div>
      <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</p>
      <h3 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: 'var(--admin-primary)', letterSpacing: '-0.02em' }}>{value}</h3>
    </div>
  );
}

function TacticalLink({ href, title, count, icon: Icon }: { href: string, title: string, count: number, icon: any }) {
  return (
    <a href={href} className="admin-tactical-btn" style={{ 
      padding: '24px',
      borderRadius: '20px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'white',
      textDecoration: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Icon size={22} strokeWidth={3} color="var(--admin-accent)" />
        <div style={{ textAlign: 'left' }}>
            <span style={{ fontWeight: '900', fontSize: '16px', display: 'block' }}>{title}</span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{count} items</span>
        </div>
      </div>
    </a>
  );
}

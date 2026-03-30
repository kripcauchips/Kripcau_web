'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingCart, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  User, 
  MapPin,
  MessageCircle
} from 'lucide-react';

interface OrderItem {
  id: number;
  product: {
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  id: number;
  customerName: string | null;
  whatsappNumber: string | null;
  customerAddress: string | null;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Real-Time Search & Status Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'white', padding: '16px 28px', borderRadius: '22px', border: '1px solid var(--admin-border)', flex: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Search size={20} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name or order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '15px', fontWeight: '800', color: 'var(--admin-primary)' }} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {['ALL', 'PENDING', 'ACCEPTED', 'CANCELLED'].map(status => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{ 
                    padding: '14px 20px', 
                    borderRadius: '16px', 
                    fontSize: '13px', 
                    fontWeight: '900', 
                    cursor: 'pointer',
                    transition: '0.2s',
                    background: statusFilter === status ? 'var(--admin-primary)' : 'white',
                    color: statusFilter === status ? 'white' : 'var(--admin-text-muted)',
                    border: '1px solid',
                    borderColor: statusFilter === status ? 'var(--admin-primary)' : 'var(--admin-border)'
                  }}
                >
                  {status}
                </button>
            ))}
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>
               No orders found matching your criteria.
            </div>
        ) : filteredOrders.map((order) => {
          const isExpanded = expandedId === order.id;
          return (
            <div key={order.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div 
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                style={{ 
                  padding: '24px 32px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  background: isExpanded ? 'rgba(27, 60, 51, 0.02)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ padding: '12px', borderRadius: '14px', background: order.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : (order.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'), color: order.status === 'PENDING' ? '#f59e0b' : (order.status === 'ACCEPTED' ? '#10b981' : '#ef4444') }}>
                    <ShoppingCart size={22} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--admin-primary)' }}>{order.customerName || 'Customer'}</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order #{order.id.toString().padStart(5, '0')} • {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                   <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '900', color: 'var(--admin-primary)' }}>Rp {(order.totalPrice || 0).toLocaleString('id-ID')}</p>
                   </div>
                   <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--admin-border)' }}></div>
                   <div style={{ 
                     padding: '8px 16px', 
                     borderRadius: '12px', 
                     fontSize: '11px', 
                     fontWeight: '900', 
                     textTransform: 'uppercase',
                     background: order.status === 'PENDING' ? '#fffbeb' : (order.status === 'ACCEPTED' ? '#f0fdf4' : '#fef2f2'),
                     color: order.status === 'PENDING' ? '#d97706' : (order.status === 'ACCEPTED' ? '#16a34a' : '#ef4444'),
                     border: '1px solid currentColor'
                   }}>
                     {order.status}
                   </div>
                   {isExpanded ? <ChevronDown size={20} color="var(--admin-primary)" strokeWidth={3} /> : <ChevronRight size={20} color="var(--admin-primary)" strokeWidth={3} />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '32px', borderTop: '1px solid var(--admin-border)', background: '#F9FAF5' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '40px' }}>
                    <DetailBlock icon={User} label="Customer" value={order.customerName || 'N/A'} />
                    <DetailBlock icon={MessageCircle} label="WhatsApp" value={order.whatsappNumber || 'N/A'} />
                    <DetailBlock icon={MapPin} label="Shipping Address" value={order.customerAddress || 'Local Pickup'} />
                  </div>

                  <div style={{ marginBottom: '40px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Ordered Items</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'white', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', background: '#f8fafc' }}>
                              <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--admin-primary)' }}>{item.product.name}</span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--admin-primary)' }}>
                             <span style={{ color: 'var(--admin-text-muted)', fontSize: '12px' }}>{item.quantity || 0} ×</span> Rp {(item.product.price || 0).toLocaleString('id-ID')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'ACCEPTED')}
                        style={{ 
                          padding: '14px 28px', 
                          fontSize: '14px', 
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: '#1B3C33',
                          color: 'white',
                          border: 'none',
                          fontWeight: '900',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 8px 24px rgba(27, 60, 51, 0.25)'
                        }}
                      >
                        <CheckCircle2 size={18} strokeWidth={3} />
                        Confirm Order
                      </button>
                    )}
                    {order.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        style={{ 
                          padding: '14px 28px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          border: '2px solid #ef4444', 
                          color: '#ef4444', 
                          background: 'rgba(239, 68, 68, 0.04)', 
                          borderRadius: '16px', 
                          fontWeight: '900', 
                          cursor: 'pointer', 
                          transition: 'all 0.2s',
                          fontSize: '14px'
                        }}
                      >
                        <XCircle size={18} strokeWidth={3} />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailBlock({ icon: Icon, label, value }: any) {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ padding: '10px', borderRadius: '14px', background: 'rgba(27, 60, 51, 0.05)', height: 'fit-content' }}>
        <Icon size={18} color="var(--admin-primary)" strokeWidth={3} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '800', color: 'var(--admin-primary)' }}>{value}</p>
      </div>
    </div>
  );
}

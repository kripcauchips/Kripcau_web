'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  Check,
  X,
  Filter,
  Package,
  ArrowRight
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
}

export default function InventoryTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ price: 0, stock: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ price: product.price, stock: product.stock });
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, ...editForm } : p));
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Humanize names for the "WOW" Factor
  const formatName = (name: string) => {
    if (name === 'Greentea Ban Chips') return 'Greentea Banana Chips';
    if (name === 'Keju Susu Chips') return 'Keju Susu Banana Chips';
    return name;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Table Actions - High End */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'white', padding: '16px 28px', borderRadius: '22px', border: '1px solid var(--admin-border)', flex: 1, maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <Search size={20} color="var(--admin-text-muted)" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '15px', fontWeight: '800', color: 'var(--admin-primary)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button style={{ backgroundColor: 'white', border: '1px solid var(--admin-border)', padding: '16px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--admin-primary)', fontWeight: '900', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Filter size={18} />
            Filters
          </button>
          <button className="admin-primary-btn" style={{ padding: '16px 32px', borderRadius: '20px' }}>
            <Plus size={20} strokeWidth={3} />
            Add Product
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
          <div key={product.id} className="admin-card" style={{ 
            display: 'grid', 
            gridTemplateColumns: '100px 2fr 1.2fr 1.2fr 0.8fr', 
            alignItems: 'center', 
            padding: '24px 40px',
            gap: '32px'
          }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--admin-border)', background: '#F9FAF5', position: 'relative' }}>
               <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--admin-primary)', margin: 0 }}>{formatName(product.name)}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ID: {product.id.toString().padStart(4, '0')}</p>
            </div>

            <div style={{ padding: '12px 24px', borderRadius: '18px', background: 'rgba(27, 60, 51, 0.02)' }}>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Price</p>
              {editingId === product.id ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                        type="number" 
                        value={editForm.price} 
                        onChange={(e) => setEditForm({...editForm, price: parseInt(e.target.value)})}
                        style={{ background: 'white', border: '1px solid var(--admin-accent)', borderRadius: '10px', padding: '6px 12px', width: '120px', fontWeight: '900', fontSize: '15px' }}
                    />
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--admin-primary)' }}>Rp {product.price.toLocaleString('id-ID')}</p>
              )}
            </div>

            {/* Stock Block */}
            <div style={{ padding: '12px 24px', borderRadius: '18px', background: product.stock < 10 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>In Stock</p>
              {editingId === product.id ? (
                <input 
                  type="number" 
                  value={editForm.stock} 
                  onChange={(e) => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                  style={{ background: 'white', border: '1px solid var(--admin-accent)', borderRadius: '10px', padding: '6px 12px', width: '80px', fontWeight: '900', fontSize: '15px' }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: product.stock < 10 ? '#ef4444' : '#10b981' }}>{product.stock} Units</span>
                  {product.stock < 10 && <AlertTriangle size={18} color="#ef4444" strokeWidth={3} />}
                </div>
              )}
            </div>

            {/* Actions Block */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {editingId === product.id ? (
                <>
                  <button onClick={() => saveEdit(product.id)} style={{ padding: '12px', borderRadius: '14px', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}><Check size={20} strokeWidth={3} /></button>
                  <button onClick={() => setEditingId(null)} style={{ padding: '12px', borderRadius: '14px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)' }}><X size={20} strokeWidth={3} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(product)} style={{ padding: '14px', borderRadius: '16px', background: 'white', border: '1px solid var(--admin-border)', color: 'var(--admin-primary)', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--admin-accent)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--admin-border)'}><Edit2 size={18} strokeWidth={3} /></button>
                  <button style={{ padding: '14px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={18} strokeWidth={3} /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

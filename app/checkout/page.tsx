'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, CheckCircle2, MapPin, Phone, User, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = Cookies.get('choco_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(i => ({
            id: i.product.id,
            quantity: i.quantity,
            price: i.product.price
          })),
          customerName: name.trim(),
          whatsappNumber: phone.trim(),
          customerAddress: address.trim() || null
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId);
        setIsSuccess(true);
        Cookies.remove('choco_cart');
        setTimeout(() => {
          window.location.href = '/';
        }, 4000);
      } else {
        alert('Gagal memproses pesanan. Coba lagi!');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  if (isSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f5f0, #fefefe)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif",
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '60px',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle2 size={40} color="#10b981" strokeWidth={3} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1B3C33', margin: '0 0 12px' }}>Pesanan Berhasil!</h1>
          <p style={{ fontSize: '16px', color: '#6b7b6e', margin: '0 0 8px', fontWeight: '600' }}>
            Order #{orderId?.toString().padStart(5, '0')} sedang diproses.
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Kamu akan dialihkan ke halaman utama...
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f5f0, #fefefe)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif",
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '60px',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.08)'
        }}>
          <ShoppingCart size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1B3C33', margin: '0 0 12px' }}>Keranjang Kosong</h2>
          <p style={{ fontSize: '15px', color: '#6b7b6e', margin: '0 0 24px' }}>Tambahkan produk ke keranjang dulu ya!</p>
          <a href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: '#1B3C33',
            color: 'white',
            borderRadius: '16px',
            fontWeight: '800',
            fontSize: '15px',
            textDecoration: 'none'
          }}>
            <ArrowLeft size={18} />
            Kembali ke Toko
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f5f0, #fefefe)',
      fontFamily: "'Outfit', sans-serif",
      padding: '40px 20px'
    }}>
      <div className="checkout-wrapper" style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Back link */}
        <a href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#1B3C33',
          fontWeight: '800',
          fontSize: '15px',
          textDecoration: 'none',
          marginBottom: '32px'
        }}>
          <ArrowLeft size={18} />
          Kembali ke Toko
        </a>

        <h1 className="checkout-title" style={{ fontSize: '42px', fontWeight: '900', color: '#1B3C33', margin: '0 0 40px', letterSpacing: '-0.03em' }}>
          Checkout
        </h1>

        <div className="checkout-grid">

          {/* Left: Customer Form */}
          <form onSubmit={handleSubmit} className="checkout-card" style={{
            background: 'white',
            borderRadius: '28px',
            padding: '40px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.06)',
            border: '1px solid rgba(27, 60, 51, 0.06)'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1B3C33', margin: '0 0 32px' }}>Data Pemesan</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '900', color: '#6b7b6e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  <User size={14} />
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '2px solid rgba(27, 60, 51, 0.08)',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1B3C33',
                    outline: 'none',
                    transition: '0.2s',
                    background: '#fafbfa',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#FFB300'}
                  onBlur={e => e.target.style.borderColor = 'rgba(27, 60, 51, 0.08)'}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '900', color: '#6b7b6e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  <Phone size={14} />
                  No. WhatsApp *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '2px solid rgba(27, 60, 51, 0.08)',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1B3C33',
                    outline: 'none',
                    transition: '0.2s',
                    background: '#fafbfa',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#FFB300'}
                  onBlur={e => e.target.style.borderColor = 'rgba(27, 60, 51, 0.08)'}
                />
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '900', color: '#6b7b6e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  <MapPin size={14} />
                  Alamat Pengiriman
                </label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap (opsional untuk ambil sendiri)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '2px solid rgba(27, 60, 51, 0.08)',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1B3C33',
                    outline: 'none',
                    transition: '0.2s',
                    background: '#fafbfa',
                    resize: 'vertical',
                    fontFamily: "'Outfit', sans-serif",
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#FFB300'}
                  onBlur={e => e.target.style.borderColor = 'rgba(27, 60, 51, 0.08)'}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !phone.trim()}
              style={{
                width: '100%',
                marginTop: '32px',
                padding: '18px',
                borderRadius: '20px',
                border: 'none',
                background: isSubmitting ? '#a3b8a0' : '#1B3C33',
                color: 'white',
                fontSize: '17px',
                fontWeight: '900',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: '0.2s',
                boxShadow: '0 12px 32px rgba(27, 60, 51, 0.2)'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Pesan Sekarang
                </>
              )}
            </button>
          </form>

          {/* Right: Order Summary */}
          <div className="checkout-card" style={{
            background: 'white',
            borderRadius: '28px',
            padding: '40px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.06)',
            border: '1px solid rgba(27, 60, 51, 0.06)',
            position: 'sticky',
            top: '40px'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1B3C33', margin: '0 0 28px' }}>Ringkasan Pesanan</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {cartItems.map(item => (
                <div key={item.product.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#fafbfa',
                  border: '1px solid rgba(27, 60, 51, 0.05)'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: '#f0f5f0'
                  }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1B3C33' }}>{item.product.name}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7b6e', fontWeight: '600' }}>{item.quantity} × Rp {item.product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#1B3C33', whiteSpace: 'nowrap' }}>
                    Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(27, 60, 51, 0.08)', margin: '0 0 20px' }} />

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#6b7b6e' }}>Total</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#1B3C33' }}>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .checkout-title {
            font-size: 32px !important;
          }
          .checkout-wrapper {
            padding: 20px 16px !important;
          }
          .checkout-card {
            padding: 24px !important;
            border-radius: 20px !important;
          }
          .checkout-card h2 {
            font-size: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}

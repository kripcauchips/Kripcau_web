'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Clock, Minus, Plus, X, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isHero: boolean;
  rating?: number;
  deliveryTime?: string;
  description?: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}
import AboutContactSection from './AboutContactSection';

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const [activeItem, setActiveItem] = useState(0);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data produk dari server.');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          const hero = data.find((p: Product) => p.isHero) || data[0];
          setHeroProduct(hero || null);
        } else {
          throw new Error('Format data produk tidak valid.');
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message || 'Terjadi kesalahan saat memuat produk.');
      });

    const savedCart = Cookies.get('choco_cart');
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch (e) { console.error("Failed to parse cart"); }
    }

    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      // Hardcode the max scroll distance to match exactly the 400vh wrapper (400vh - 100vh = 300vh).
      // This ensures the product animation completes exactly before About Us appears.
      const scrollMax = window.innerHeight * 3;
      if (scrollMax > 0) {
        setScrollYProgress(Math.max(0, Math.min(1, window.scrollY / scrollMax)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (products.length === 0 || isAutoScrolling) return;
    // Only lock the hero product to scroll position IF the user goes deep into the variants track
    if (scrollYProgress > 0.15) {
      if (scrollYProgress < 0.35) { setHeroProduct(products[0]); setActiveItem(0); }
      else if (scrollYProgress < 0.55) { setHeroProduct(products[1] || products[0]); setActiveItem(1); }
      else if (scrollYProgress < 0.75) { setHeroProduct(products[2] || products[0]); setActiveItem(2); }
      else { setHeroProduct(products[3] || products[0]); setActiveItem(3); }
    }
  }, [scrollYProgress, products, isAutoScrolling]);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    if (items.length > 0) {
      Cookies.set('choco_cart', JSON.stringify(items));
    } else {
      Cookies.remove('choco_cart');
    }
  };

  const addToCart = () => {
    if (!heroProduct) return;
    const existing = cartItems.find(item => item.product.id === heroProduct.id);
    let newCart;
    if (existing) {
      newCart = cartItems.map(item =>
        item.product.id === heroProduct.id
          ? { ...item, quantity: item.quantity + count } : item
      );
    } else {
      newCart = [...cartItems, { product: heroProduct, quantity: count }];
    }
    saveCart(newCart);
    setIsCartOpen(true);
    setCount(1);
  };

  const updateCartQty = (id: number, delta: number) => {
    const newCart = cartItems.map(item => {
      if (item.product.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeCartItem = (id: number) => {
    saveCart(cartItems.filter(item => item.product.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    window.location.href = '/checkout';
  };

  const handleMinus = () => { if (count > 1) setCount(count - 1); };
  const handlePlus = () => { setCount(count + 1); };

  // Core Transition Math: Calculates variables natively eliminating Framer Motion hydration bugs.
  // We use scroll offset 0.0 -> 0.15 strictly for the Transition into products.
  const t = Math.min(1, Math.max(0, scrollYProgress / 0.15));

  const bgWidth = isMobile ? "100%" : `${28 + (72 * t)}vw`;
  const clipPath = isMobile ? `circle(${50 + (100 * t)}% at 50% -10%)` : "ellipse(100% 120% at 100% 50%)";

  const bowlLeftPercent = isMobile ? 50 : 75 - (25 * t);
  const bowlTopPercent = isMobile ? 28 + (2 * t) : 50;
  const bowlWidth = isMobile ? "60vw" : "50vw";

  const homeTextOpacity = 1 - t;
  const productViewOpacity = t;
  const bowlRotate = scrollYProgress * 360;

  // Determine active section for navbar
  let activeSection = 'products';
  if (scrollYProgress < 0.05) activeSection = 'home';
  else if (scrollYProgress > 0.95) activeSection = 'about';

  const isScrolled = activeSection !== 'home';

  const scrollToVariant = (index: number) => {
    setIsAutoScrolling(true);
    const vh = window.innerHeight;
    const target = vh + (vh * 0.75 * index) + 10;
    window.scrollTo({ top: target, behavior: 'smooth' });
    setTimeout(() => setIsAutoScrolling(false), 1000);
  };

  if (!isMounted) return <div className="loading">Loading...</div>;

  if (error) {
    return (
      <div className="loading" style={{ flexDirection: 'column', gap: '20px', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#FF8A00' }}>Waduh! Sepertinya ada masalah</h2>
        <p style={{ maxWidth: '500px' }}>{error}</p>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', fontSize: '14px' }}>
          <p><strong>Tips:</strong> Pastikan konfigurasi database di file <code>.env</code> sudah benar.</p>
        </div>
        <button onClick={() => window.location.reload()} className="buy-now-btn" style={{ background: '#fff', color: '#000' }}>
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!heroProduct) return <div className="loading">Loading...</div>;
  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header style={{ position: "fixed", width: "100%", zIndex: 100, top: 0 }}>
        <nav>
          <div className="logo" onClick={() => {
            setIsAutoScrolling(true);
            setHeroProduct(products[0]);
            setActiveItem(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setIsAutoScrolling(false), 1000);
          }} style={{ cursor: "pointer" }}>
            <span className="logo-choco">Kripcau</span><span className="logo-chips">Chips</span>
          </div>
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => {
              e.preventDefault();
              setIsAutoScrolling(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => setIsAutoScrolling(false), 1000);
            }} className={activeSection === 'home' ? "active" : ""}>Home</a></li>
            <li><a href="#products" onClick={(e) => { e.preventDefault(); scrollToVariant(0); }} className={activeSection === 'products' ? "active" : ""}>Products</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className={activeSection === 'about' ? "active" : ""}>About Us</a></li>
          </ul>
          <div className="header-icons">
            <div className="icon-btn cart-icon" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={24} color="white" />
              {cartTotalItems > 0 && <span className="badge">{cartTotalItems}</span>}
            </div>
          </div>
        </nav>
      </header>

      {/* 420vh track: 300vh for animations + small buffer before About Us */}
      <div style={{ height: "420vh", position: "relative" }}>

        {/* Sticky viewport frame locking standard 100vh height to accommodate Safari/Mobile browser tabs */}
        <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden", background: "#ffffff" }}>

          {/* Layer 0: Full Screen Overlay for Products View */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#355E3B", zIndex: 0, opacity: productViewOpacity, transition: "opacity 0.2s" }} />

          {/* Layer 1: Animated Background Curve */}
          <div style={{
            position: "absolute", top: 0, right: 0, height: "100%",
            width: bgWidth, background: "#355E3B", zIndex: 1,
            clipPath: clipPath
          }} />

          {/* Layer 2: The Exact Home Layout Wrapped In Opacity Tracking */}
          <main className="split-screen" style={{
            opacity: homeTextOpacity, height: "100vh", position: "absolute", top: 0, left: 0, width: "100%",
            background: "transparent", zIndex: 2, pointerEvents: isScrolled ? "none" : "auto",
            userSelect: isScrolled ? "none" : "auto", display: t === 1 ? "none" : "flex"
          }}>
            <section className="content-side" style={{ background: "transparent" }}>
              <div className="hero-text">
                <h1>Order your<br /><span>favourite chips</span></h1>
                <p className="sub-headline">{heroProduct.description}</p>

                <div className="order-details">
                  <div className="total-order">
                    <span className="label">Total order :</span>
                    <span className="price">Rp {(heroProduct.price * count).toLocaleString('id-ID')}</span>
                  </div>

                  <div className="cta-row">
                    <div className="quantity-selector">
                      <button className="qty-btn minus" onClick={handleMinus}><Minus size={12} strokeWidth={3} /></button>
                      <span className="qty-value">{count}</span>
                      <button className="qty-btn plus" onClick={handlePlus}><Plus size={12} strokeWidth={3} /></button>
                    </div>
                    <button className="buy-now-btn" onClick={addToCart}>
                      <div className="icon-bg">
                        <ShoppingCart size={18} fill="currentColor" />
                      </div>
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Layer 3: Deep Products Reveal Text */}
          <div className="product-view-text" style={{
            opacity: productViewOpacity, zIndex: 3, position: "absolute",
            left: 0, top: 0,
            display: isScrolled ? "flex" : "none",
            pointerEvents: isScrolled ? "auto" : "none",
            transition: "opacity 0.2s"
          }}>
            <div style={{ maxWidth: "21.875rem", pointerEvents: "auto" }}>
              <AnimatePresence mode="wait">
                <motion.h2 key={heroProduct.id} initial={{ opacity: 0, y: "1.25rem" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "-1.25rem" }} style={{ fontSize: "3rem", fontWeight: "900", color: "#fff", margin: 0 }}>
                  {heroProduct.name.replace(/ Banana Chips| Ban Chips| Chips/i, '')}
                </motion.h2>
              </AnimatePresence>
              <p style={{ marginTop: "0.9375rem", color: "rgba(255,255,255,0.8)" }}>{heroProduct.description}</p>
            </div>

            <div style={{ pointerEvents: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.25rem", color: "#fff", textAlign: "center" }}>
                Rp {heroProduct.price.toLocaleString('id-ID')}
              </div>
              <button
                className="buy-now-btn"
                onClick={() => {
                  setCount(1);
                  setIsAutoScrolling(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => setIsAutoScrolling(false), 1200);
                }}
                style={{ background: "#fff", color: "#000", whiteSpace: "nowrap" }}
              >
                <div className="icon-bg" style={{ background: "#FFB300", flexShrink: 0 }}><ShoppingCart size={18} fill="currentColor" color="black" /></div>
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Layer 4: The Completely Absolute Extracted Bowl container */}
          <div style={{
            position: "absolute", left: `${bowlLeftPercent}%`, top: `${bowlTopPercent}%`, transform: `translate(-50%, -50%) rotate(${bowlRotate}deg)`,
            pointerEvents: "auto", zIndex: 10,
            width: bowlWidth, maxWidth: "37.5rem",
            display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={heroProduct.id}
                src={heroProduct.image}
                alt={heroProduct.name}
                className="main-hero-img static"
                initial={{ opacity: 0, scale: 0.8, rotate: 90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: -90 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>

            {/* Hard-hide the Home Bowl Info pill instantly after scrolling */}
            <div className="info-card" style={{
              opacity: homeTextOpacity,
              marginTop: isMobile ? "-2.8125rem" : "-1.25rem",
              display: t === 1 ? "none" : "flex",
              transform: `scale(${isMobile ? 0.65 : 1}) rotate(-${bowlRotate}deg)`
            }}>
              <div className="info-row">
                <h3>{heroProduct.name.replace(/ Banana Chips| Ban Chips| Chips/i, '')}</h3>
                <div className="rating">
                  <Star size={24} fill="#FFCC00" color="#FFCC00" />
                  <span>{heroProduct.rating}</span>
                </div>
              </div>
              <div className="delivery-pill">
                <Clock size={20} />
                <span>1-2 Jam</span>
              </div>
            </div>
          </div>

          {/* Layer 5: Bottom Thumbnail Carousel */}
          <footer className="carousel-section" style={{ opacity: homeTextOpacity, position: "absolute", bottom: 0, width: "100%", zIndex: 10, display: t === 1 ? "none" : "block" }}>
            <div className="carousel-container">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`carousel-item ${heroProduct.id === product.id ? 'active' : ''}`}
                  onClick={() => {
                    setHeroProduct(product);
                    setActiveItem(index);
                    setCount(1);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="item-img-wrapper">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="item-info">
                    <h4>{product.name.replace(/ Banana Chips| Ban Chips| Chips/i, '')}</h4>
                    <span className="price">Rp {product.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </footer>

        </div>
      </div>

      {/* About & Contact combined section, completely decoupled from scroll-scrubbing */}
      <AboutContactSection />

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}></div>
          <div className="cart-drawer">
            <div className="drawer-header">
              <h2>Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
            </div>

            <div className="drawer-items">
              {cartItems.length === 0 ? (
                <p className="empty-msg">Keranjang kosong.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="cart-item-info">
                      <h4>{item.product.name}</h4>
                      <p>Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</p>
                      <div className="qty-controls">
                        <button onClick={() => updateCartQty(item.product.id, -1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.product.id, 1)}><Plus size={14} /></button>
                      </div>
                    </div>
                    <button className="del-btn" onClick={() => removeCartItem(item.product.id)}>
                      <Trash2 size={20} color="#EF4444" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="drawer-footer">
                <div className="total-row">
                  <span>Total</span>
                  <span>Rp {cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toLocaleString('id-ID')}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

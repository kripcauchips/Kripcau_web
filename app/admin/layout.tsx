'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Inventory', icon: Package, href: '/admin/inventory' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (!isMounted) return null;

  return (
    <div className="admin-container">
      {/* Mobile Hamburger */}
      <button className="admin-mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="admin-mobile-overlay active" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobile && isSidebarOpen ? 'mobile-open' : ''}`} style={{ width: !isMobile ? (isSidebarOpen ? '280px' : '0px') : undefined, padding: isSidebarOpen ? '0' : '0', overflow: 'hidden' }}>
        <div className="admin-sidebar-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                background: 'var(--admin-accent)', 
                padding: '10px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(255, 179, 0, 0.15)'
              }}>
                <Zap size={22} color="#1B3C33" strokeWidth={3} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em', lineHeight: '1' }}>Kripcau<span style={{ color: 'var(--admin-accent)' }}>Elite</span></span>
                <span style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>Management Shell</span>
              </div>
            </div>
        </div>

        <nav className="admin-nav">
          <div style={{ height: '32px' }} />
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`}
                onClick={() => { if (isMobile) setIsSidebarOpen(false); }}
              >
                <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                <span>{item.name}</span>
                {isActive ? <ChevronRight size={14} strokeWidth={3} /> : <div />}
              </Link>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={20} strokeWidth={3} />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main-wrapper">
        <main className="admin-content" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

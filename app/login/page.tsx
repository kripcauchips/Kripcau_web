'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at top left, #355E3B, #1e293b, #0f172a)',
      padding: '24px', 
      fontFamily: "'Outfit', -apple-system, sans-serif" 
    }}>
      <div style={{ 
        maxWidth: '480px', 
        width: '100%', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '36px', 
        boxShadow: '0 40px 100px -20px rgba(0,0,0,0.6)', 
        overflow: 'hidden', 
        padding: '60px', 
        border: '1px solid rgba(255,255,255,0.2)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, #355E3B, #457b4d)', 
            color: 'white', 
            borderRadius: '24px', 
            marginBottom: '24px', 
            boxShadow: '0 15px 30px -10px rgba(53,94,59,0.4)',
            border: '2px solid rgba(255,255,255,0.1)'
          }}>
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1e293b', margin: '0 0 12px 0', letterSpacing: '-0.04em' }}>Admin Access</h1>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#64748b', margin: 0 }}>Secure portal for Kripcau platform</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'block', marginLeft: '4px' }}>Identity</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <User size={22} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '20px 20px 20px 56px', 
                  backgroundColor: '#f8fafc', 
                  border: '2px solid #f1f5f9', 
                  borderRadius: '20px', 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  color: '#1e293b', 
                  outline: 'none', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
                }}
                placeholder="admin"
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#355E3B';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(53, 94, 59, 0.1)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#f1f5f9';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.01)';
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'block', marginLeft: '4px' }}>Secret Key</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Lock size={22} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '20px 20px 20px 56px', 
                  backgroundColor: '#f8fafc', 
                  border: '2px solid #f1f5f9', 
                  borderRadius: '20px', 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  color: '#1e293b', 
                  outline: 'none', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
                }}
                placeholder="••••••••"
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#355E3B';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(53, 94, 59, 0.1)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#f1f5f9';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.01)';
                }}
                required
              />
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '18px', borderRadius: '20px', fontSize: '14px', fontWeight: '800', border: '1px solid #fee2e2', textAlign: 'center', animation: 'shake 0.5s' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #355E3B, #457b4d)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '20px', 
              fontSize: '16px', 
              fontWeight: '900', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              transition: 'all 0.3s', 
              boxShadow: '0 10px 20px -5px rgba(53,94,59,0.3)', 
              opacity: loading ? 0.7 : 1,
              marginTop: '8px'
            }}
          >
            {loading ? 'Verifying...' : 'Authenticate'}
            {!loading && <ArrowRight size={22} strokeWidth={3} />}
          </button>
        </form>

        <p style={{ marginTop: '48px', textAlign: 'center', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Secure Terminal &bull; Ver. 16.2.0 &bull; &copy; {new Date().getFullYear()}
        </p>
      </div>
      
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

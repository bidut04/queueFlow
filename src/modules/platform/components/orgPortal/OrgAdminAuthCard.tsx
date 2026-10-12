import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Layers3 } from 'lucide-react';
import { orgAdminAuthStore, type OrgAdminUser } from '../../services/orgAdminAuthStore';

interface OrgAdminAuthCardProps {
  onAuthenticated: (user: OrgAdminUser) => void;
}

export const OrgAdminAuthCard: React.FC<OrgAdminAuthCardProps> = ({ onAuthenticated }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('rownok@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Rownok Rahman');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (authMode === 'signup') {
      if (!fullName.trim()) return setError('Please enter your full name.');
      if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address.');
      const user = orgAdminAuthStore.signUp({ name: fullName, email, phone: '+1 (555) 234-5678', password });
      onAuthenticated(user);
    } else {
      if (!email.trim() || !email.includes('@')) return setError('Please enter your email address.');
      const user = orgAdminAuthStore.signIn(email, password);
      onAuthenticated(user);
    }
  };

  const handleQuickDemo = (type: 'pending' | 'hold' | 'new') => {
    setError(null);
    if (type === 'pending') {
      setAuthMode('signin');
      setEmail('rhughes@pacificfed.edu');
    } else if (type === 'hold') {
      setAuthMode('signin');
      setEmail('clara@apexhealth.org');
    } else {
      setAuthMode('signup');
      setFullName('Marcus Vance');
      setEmail('marcus@newhorizon.org');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'minmax(390px, 480px) 1fr',
        minHeight: 560,
        border: '1px solid #e2e8f0',
        boxSizing: 'border-box'
      }}
    >
      {/* Left Column: Form Details */}
      <div style={{ padding: '38px 46px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #f1f5f9' }}>
        <div>
          {/* Logo Brand: QueueFlow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(37,99,235,0.35)'
              }}
            >
              <Layers3 size={18} color="#ffffff" />
            </div>
            <span style={{ fontSize: 21, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>
              QueueFlow
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 25, fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ fontSize: 11.5, color: '#64748b', margin: 0 }}>
              {authMode === 'signin'
                ? 'Sign in to access your organization administration workspace'
                : 'Join our multi-tenant enterprise queue flow platform'}
            </p>
          </div>

          {/* Social Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('pending')}
              style={{
                width: '100%',
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 11.5,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('hold')}
              style={{
                width: '100%',
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 11.5,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0 14px 0', gap: 10 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
            <span style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600 }}>Or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 11, padding: '6px 10px', borderRadius: 6, marginBottom: 10 }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {authMode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rownok Rahman"
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2 }}>
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rownok@gmail.com"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: '100%', padding: '7px 32px 7px 10px', borderRadius: 7, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#2563eb' }}
                />
                Remember me
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert('Reset link dispatched.'); }}
                style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
              >
                Forgot Password?
              </a>
            </div>

            {/* QueueFlow Theme Blue Button */}
            <button
              type="submit"
              style={{
                marginTop: 4,
                width: '100%',
                padding: '10px 0',
                borderRadius: 8,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              {authMode === 'signin' ? 'Sign In as Org Admin' : 'Sign Up as Org Admin'}
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>
              {authMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              style={{ background: 'none', border: 'none', fontSize: 11, fontWeight: 800, color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Demo Test Accounts */}
        <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: 9.5, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
            <Sparkles size={11} style={{ display: 'inline', marginRight: 4, color: '#2563eb' }} />
            Quick Test Accounts:
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => handleQuickDemo('pending')} style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4, backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', cursor: 'pointer' }}>
              Pending Org
            </button>
            <button type="button" onClick={() => handleQuickDemo('hold')} style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4, backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', cursor: 'pointer' }}>
              On-Hold Org
            </button>
            <button type="button" onClick={() => handleQuickDemo('new')} style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer' }}>
              Sign Up Form
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: User's Exact Sculpted Building Image without overlay text */}
      <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <img
          src="/havenix_building.jpg"
          alt="QueueFlow Architecture"
          style={{
            width: '100%',
            height: '100%',
            maxHeight: 640,
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
    </div>
  );
};

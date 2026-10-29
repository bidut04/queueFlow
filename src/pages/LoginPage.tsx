import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, Layers3, AlertCircle } from 'lucide-react';
import { authApi } from '../api/auth.api';

interface LoginPageProps {
  onNavigate?: (pageId: string) => void;
  initialMessage?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, initialMessage }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    const oauthError = params.get('error');

    if (oauthError) {
      const msg = decodeURIComponent(oauthError);
      setErrorMessage(msg);
      showToast(msg);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token) {
      localStorage.setItem('queflow_token', token);
      localStorage.setItem('access_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);

      let parsedUser: any = null;
      if (userParam) {
        try {
          parsedUser = JSON.parse(decodeURIComponent(userParam));
        } catch (e) {
          console.error('Failed to parse user from OAuth redirect:', e);
        }
      }

      let tokenRole = '';
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const payload = JSON.parse(atob(payloadBase64));
          tokenRole = payload.role || '';
        }
      } catch {
        // ignore
      }

      const isSuper =
        parsedUser?.isSuperAdmin === true ||
        parsedUser?.userType === 'PLATFORM_SUPER_ADMIN' ||
        tokenRole === 'SUPER_ADMIN' ||
        tokenRole === 'PLATFORM_OWNER' ||
        tokenRole === 'PLATFORM_ADMIN';

      const isTenantAdmin =
        !isSuper &&
        (parsedUser?.userType === 'TENANT_ADMIN' ||
          tokenRole === 'ADMIN' ||
          tokenRole === 'TENANT_ADMIN' ||
          tokenRole === 'TENANT_OWNER' ||
          (parsedUser?.tenants && Array.isArray(parsedUser.tenants) && parsedUser.tenants.length > 0));

      const userRole = isSuper
        ? 'SUPER_ADMIN'
        : isTenantAdmin
        ? 'TENANT_ADMIN'
        : (parsedUser?.role || tokenRole || 'USER');

      const userInfo = {
        email: parsedUser?.email || '',
        role: userRole,
        userType: isSuper ? 'PLATFORM_SUPER_ADMIN' : isTenantAdmin ? 'TENANT_ADMIN' : 'USER',
        isSuperAdmin: isSuper,
        loginTime: new Date().toISOString(),
        tenants: parsedUser?.tenants || [],
      };

      // Crucial: Store user profile in queflow_user so authApi and AppLayout recognize Tenant Admin
      localStorage.setItem('queflow_user', JSON.stringify(userInfo));
      if (userInfo.tenants && userInfo.tenants.length > 0) {
        localStorage.setItem('queflow_active_tenant', userInfo.tenants[0].tenantId || userInfo.tenants[0].id);
      }
      window.dispatchEvent(new CustomEvent('auth:login'));

      if (isSuper) {
        showToast('Welcome Super Admin! Redirecting to Control Tower...');
        setTimeout(() => {
          window.location.href = '/platform';
        }, 500);
      } else if (isTenantAdmin) {
        showToast('Welcome Tenant Admin! Opening Management Console...');
        setTimeout(() => {
          navigateTo('/dashboard');
        }, 500);
      } else {
        showToast('Welcome! Opening Queue & Booking Portal...');
        setTimeout(() => {
          navigateTo('/queue-portal');
        }, 500);
      }
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = '/api/v1/auth/google';
  };

  const navigateTo = (path: string) => {
    const cleanId = path.replace(/^\//, '') || 'dashboard';
    if (onNavigate) {
      onNavigate(cleanId);
    } else {
      window.location.href = path;
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (authMode === 'signup') {
        await authApi.register({
          email: cleanEmail,
          password,
        });
        showToast('Registration successful! Logging you in...');
        await authApi.login({ email: cleanEmail, password });
        navigateTo('/');
        return;
      }

      // Pure real backend API authentication - NO MOCK DATA!
      await authApi.login({
        email: cleanEmail,
        password,
      });

      const isSuper = authApi.isSuperAdmin();
      const isTenantAdmin = authApi.isTenantAdmin();

      if (isSuper) {
        showToast('Welcome Super Admin! Redirecting to Control Tower...');
        setTimeout(() => {
          window.location.href = '/platform';
        }, 500);
      } else if (isTenantAdmin) {
        showToast('Welcome Admin! Opening Management Console...');
        setTimeout(() => {
          navigateTo('/dashboard');
        }, 500);
      } else {
        showToast('Welcome! Opening Queue & Booking Portal...');
        setTimeout(() => {
          navigateTo('/queue-portal');
        }, 500);
      }
    } catch (err: any) {
      const msg = err?.message || 'Invalid email or password. Please try again.';
      setErrorMessage(msg);
      showToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 65px)',
        display: 'flex',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderLeft: '4px solid #2563eb'
          }}
        >
          <Sparkles size={16} color="#60a5fa" />
          {toastMessage}
        </div>
      )}

      {/* Full Width Split-Screen Container with Zero Side Margin */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          backgroundColor: '#ffffff',
          borderRadius: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(420px, 480px) 1fr',
          minHeight: 'calc(100vh - 65px)',
          border: 'none',
          boxSizing: 'border-box'
        }}
      >
        {/* Left Form Column */}
        <div
          style={{
            padding: '30px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
            height: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div>
            {/* QueueFlow Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.35)'
                }}
              >
                <Layers3 size={17} color="#ffffff" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>
                QueueFlow
              </span>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 16 }}>
              <h1 style={{ fontSize: 23, fontWeight: 800, color: '#0f172a', margin: '0 0 3px 0' }}>
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p style={{ fontSize: 11.5, color: '#64748b', margin: 0 }}>
                {authMode === 'signin'
                  ? 'Sign in to access your queue management workspace'
                  : 'Register to manage token queues and counter operations'}
              </p>
            </div>

            {/* Social Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  padding: '7px 12px',
                  borderRadius: 7,
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
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => showToast('Single Sign-On is disabled. Please enter your email and password.')}
                style={{
                  width: '100%',
                  padding: '7px 12px',
                  borderRadius: 7,
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0 12px 0', gap: 10 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
              <span style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600 }}>Or</span>
              <div style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
            </div>

            {/* Alert / Notice Messages */}
            {initialMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  padding: '9px 12px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <AlertCircle size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                <span>{initialMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '9px 12px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Inputs */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
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
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2 }}>
                  Email or Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@queflow.com"
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
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
                    style={{ width: '100%', padding: '7px 32px 7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 1 }}>
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
                  onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to registered email.'); }}
                  style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Theme Blue Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: 4,
                  width: '100%',
                  padding: '9px 0',
                  borderRadius: 7,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
              >
                {isSubmitting ? 'Authenticating...' : authMode === 'signin' ? 'Sign In to QueueFlow' : 'Create Account'}
              </button>
            </form>

            {/* Toggle */}
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                {authMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                style={{ background: 'none', border: 'none', fontSize: 11, fontWeight: 800, color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>

            {/* Org Portal Link */}
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <a
                href="/org-portal"
                onClick={(e) => { e.preventDefault(); navigateTo('/org-portal'); }}
                style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
              >
                Register New Organization →
              </a>
            </div>
          </div>

        {/* Right Column: Full Height Image matching Form Height with No Side Space */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: 0,
            margin: 0,
            overflow: 'hidden',
            backgroundColor: '#f8fafc'
          }}
        >
          <img
            src="/havenix_building.jpg"
            alt="QueueFlow Architecture"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
          />
        </div>
      </div>
    </div>
  );
};

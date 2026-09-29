import React, { useState } from 'react';
import {
  Lock,
  Mail,
  LogIn,
  ShieldCheck,
  Layers3,
  Activity,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('branch_main');
  const [loginRole, setLoginRole] = useState<'admin' | 'staff' | 'manager'>('admin');
  const [email, setEmail] = useState('admin@queflow.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleQuickDemo = (role: 'admin' | 'staff' | 'manager') => {
    setLoginRole(role);
    if (role === 'admin') {
      setEmail('admin@queflow.com');
      setPassword('admin12345');
    } else if (role === 'staff') {
      setEmail('staff.counter3@queflow.com');
      setPassword('staff12345');
    } else {
      setEmail('manager.gulshan@queflow.com');
      setPassword('manager12345');
    }
    showToast(`Loaded ${role.toUpperCase()} demo credentials!`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Authentication Successful! Welcome to QueueFlow.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }, 900);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '82vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 0'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderLeft: '4px solid #3b82f6'
        }}>
          <Sparkles size={16} color="#60a5fa" />
          {toastMessage}
        </div>
      )}

      {/* Main Split-Screen Card */}
      <div style={{
        maxWidth: 1080,
        width: '100%',
        minHeight: 560,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        backgroundColor: '#ffffff'
      }}>
        {/* LEFT HERO PANEL: Queue Management Concept & Realtime Stats */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #1e3a8a 100%)',
          padding: '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }} />

          {/* Top Brand Logo */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(37,99,235,0.4)'
                }}>
                  <Layers3 size={24} color="#ffffff" />
                </div>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', margin: 0 }}>
                    QueueFlow
                  </h1>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Enterprise Queue & Counter Hub
                  </span>
                </div>
              </div>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 10.5,
                fontWeight: 700,
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#4ade80',
                padding: '4px 12px',
                borderRadius: 9999,
                backdropFilter: 'blur(4px)'
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block' }} />
                Portal Online
              </span>
            </div>

            {/* Headline */}
            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.25, color: '#ffffff', margin: 0 }}>
                Smart Counter Ticketing & Walk-In Operations
              </h2>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: '#cbd5e1', marginTop: 8, maxWidth: 440 }}>
                Sign in to your counter terminal to serve waiting customers, manage token queues, control digital displays, and optimize branch performance.
              </p>
            </div>

            {/* 3D QueueFlow Hero Illustration Banner */}
            <div style={{
              marginTop: 18,
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
              position: 'relative'
            }}>
              <img
                src="/images/login_hero.jpg"
                alt="QueueFlow Enterprise Queue Management System"
                style={{
                  width: '100%',
                  height: 165,
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0) 100%)',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Sparkles size={13} color="#60a5fa" /> Smart Counter & Service Points Hub
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#ffffff', backgroundColor: 'rgba(59,130,246,0.5)', padding: '2px 8px', borderRadius: 4 }}>
                  Enterprise 3D Hub
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div style={{ position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, fontSize: 11, color: '#94a3b8' }}>
            <span>Secured with 256-bit AES Tokenized Terminal Encryption.</span>
          </div>
        </div>

        {/* RIGHT LOGIN FORM PANEL */}
        <div style={{
          padding: '40px 38px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
            {/* Form Title */}
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Sign In to Workspace
              </h2>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, margin: 0 }}>
                Select your branch and role to access your counter dashboard.
              </p>
            </div>

            {/* Branch Selector Dropdown */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                Operating Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0f172a',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="branch_main">Main Branch (Dhaka City Center)</option>
                <option value="branch_gulshan">Gulshan Branch (Road 11)</option>
                <option value="branch_dhanmondi">Dhanmondi Branch (Satmasjid Rd)</option>
                <option value="branch_uttara">Uttara Branch (Sector 3)</option>
                <option value="branch_mirpur">Mirpur Branch (Mirpur 10)</option>
              </select>
            </div>

            {/* Role Selection Tabs */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                Terminal Access Role
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 6,
                backgroundColor: '#f1f5f9',
                padding: 4,
                borderRadius: 8,
                border: '1px solid #e2e8f0'
              }}>
                {[
                  { id: 'admin', label: 'Super Admin' },
                  { id: 'staff', label: 'Counter Staff' },
                  { id: 'manager', label: 'Manager' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setLoginRole(r.id as 'admin' | 'staff' | 'manager')}
                    style={{
                      padding: '6px 0',
                      borderRadius: 6,
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: loginRole === r.id ? '#ffffff' : 'transparent',
                      color: loginRole === r.id ? '#2563eb' : '#64748b',
                      boxShadow: loginRole === r.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Demo Credentials Bar */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px dashed #bfdbfe',
              borderRadius: 8,
              padding: '8px 10px',
              marginBottom: 16
            }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#1d4ed8', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                <KeyRound size={12} color="#2563eb" /> Quick Demo Credentials:
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  style={{ padding: '3px 8px', borderRadius: 4, backgroundColor: '#ffffff', border: '1px solid #93c5fd', fontSize: 10, fontWeight: 700, color: '#1e40af', cursor: 'pointer' }}
                >
                  🔑 Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('staff')}
                  style={{ padding: '3px 8px', borderRadius: 4, backgroundColor: '#ffffff', border: '1px solid #93c5fd', fontSize: 10, fontWeight: 700, color: '#1e40af', cursor: 'pointer' }}
                >
                  💼 Staff Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('manager')}
                  style={{ padding: '3px 8px', borderRadius: 4, backgroundColor: '#ffffff', border: '1px solid #93c5fd', fontSize: 10, fontWeight: 700, color: '#1e40af', cursor: 'pointer' }}
                >
                  🏢 Manager Demo
                </button>
              </div>
            </div>

            {/* Success Alert Banner */}
            {isSubmitted && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16
              }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>Authentication Successful! Redirecting to Dashboard...</span>
              </div>
            )}

            {/* Login Inputs Form */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                  Employee Email / Username <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }}>
                  <Mail size={16} color="#94a3b8" />
                  <input
                    type="email"
                    required
                    placeholder="admin@queflow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: 12.5,
                      color: '#0f172a',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                  Account Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }}>
                  <Lock size={16} color="#94a3b8" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: 12.5,
                      color: '#0f172a',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#2563eb', width: 14, height: 14, cursor: 'pointer' }}
                  />
                  Remember me on terminal
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Password reset instructions sent to admin email!');
                  }}
                  style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                icon={isSubmitting ? <Activity size={16} className="animate-spin" /> : <LogIn size={16} />}
                className="w-full justify-center py-2.5 mt-2"
              >
                {isSubmitting ? 'Verifying Credentials...' : 'Sign In to QueueFlow Workspace'}
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, color: '#94a3b8', fontSize: 11 }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>256-bit Encrypted Session</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

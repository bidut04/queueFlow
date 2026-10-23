import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowRight, Building2, Mail } from 'lucide-react';
import { platformStore, type PasswordSetupInvite } from '../modules/platform/services/platformState';

interface SetupPasswordPageProps {
  onNavigate?: (pageId: string) => void;
}

export const SetupPasswordPage: React.FC<SetupPasswordPageProps> = ({ onNavigate }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState<string>(tokenFromUrl);
  const [invite] = useState<PasswordSetupInvite | null>(() => {
    if (!tokenFromUrl) return null;
    const found = platformStore.getInviteByToken(tokenFromUrl);
    if (found) return found;
    return {
      token: tokenFromUrl,
      email: 'admin@organization.com',
      name: 'Primary Administrator',
      organizationId: 'org-demo',
      organizationName: 'Your New Organization',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      isUsed: false,
    };
  });
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isMatch = password.length > 0 && password === confirmPassword;

  const calculateStrength = () => {
    let score = 0;
    if (hasMinLength) score += 25;
    if (hasNumber) score += 25;
    if (hasUppercase) score += 25;
    if (hasSpecial) score += 25;
    return score;
  };

  const strength = calculateStrength();

  const getStrengthLabel = () => {
    if (strength <= 25) return { label: 'Weak', color: '#ef4444' };
    if (strength <= 50) return { label: 'Fair', color: '#f59e0b' };
    if (strength <= 75) return { label: 'Good', color: '#3b82f6' };
    return { label: 'Strong & Secure', color: '#10b981' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('A valid security setup token is required.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!isMatch) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = platformStore.completePasswordSetup(token, password);
      setIsSubmitting(false);

      if (res.success || invite) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  const navigateToLogin = () => {
    if (onNavigate) {
      onNavigate('login');
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.1), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '28px 24px 20px 24px',
            borderBottom: '1px solid #f1f5f9',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
            }}
          >
            <ShieldCheck size={24} color="#ffffff" />
          </div>

          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
            Set Your Administrator Password
          </h1>
          <p style={{ fontSize: 11.5, color: '#64748b', margin: '6px 0 0 0' }}>
            Zero-knowledge onboarding invitation for your organization workspace
          </p>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#059669'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Password Configured Successfully!
            </h2>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Your administrator credentials are now active. You can sign in to your workspace using your email
              <strong style={{ color: '#0f172a', display: 'block', marginTop: 4 }}>
                {invite?.email || 'your registered email'}
              </strong>
            </p>

            <button
              onClick={navigateToLogin}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 8,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
              }}
            >
              Proceed to Sign In <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {/* Target Account Badge */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 18,
                fontSize: 11
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: '#475569' }}>
                <Building2 size={13} color="#6366f1" />
                <span>Organization: <strong style={{ color: '#0f172a' }}>{invite?.organizationName || 'New Tenant Organization'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}>
                <Mail size={13} color="#2563eb" />
                <span>Account Email: <strong style={{ color: '#2563eb' }}>{invite?.email || 'admin@organization.com'}</strong></span>
              </div>
            </div>

            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 6,
                  color: '#dc2626',
                  fontSize: 11,
                  fontWeight: 600,
                  marginBottom: 16
                }}
              >
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Token Input (if missing from URL) */}
            {!tokenFromUrl && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                  Invitation Token
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your inv_... token"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {/* New Password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                New Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 36px 8px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 4
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, marginBottom: 3 }}>
                    <span style={{ color: '#64748b' }}>Strength:</span>
                    <span style={{ color: getStrengthLabel().color }}>{getStrengthLabel().label}</span>
                  </div>
                  <div style={{ width: '100%', height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${strength}%`,
                        height: '100%',
                        backgroundColor: getStrengthLabel().color,
                        transition: 'width 0.25s ease'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 36px 8px 12px',
                    borderRadius: 6,
                    border: `1px solid ${confirmPassword && !isMatch ? '#ef4444' : '#cbd5e1'}`,
                    fontSize: 12,
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 4
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirmPassword && !isMatch && (
                <p style={{ margin: '4px 0 0 0', fontSize: 10, color: '#ef4444' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Requirements Checklist */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
                borderRadius: 6,
                padding: '10px 12px',
                marginBottom: 20
              }}
            >
              <p style={{ margin: '0 0 6px 0', fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Security Requirements:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 10 }}>
                <div style={{ color: hasMinLength ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{hasMinLength ? '✓' : '•'}</span> 8+ characters
                </div>
                <div style={{ color: hasNumber ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{hasNumber ? '✓' : '•'}</span> At least 1 number
                </div>
                <div style={{ color: hasUppercase ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{hasUppercase ? '✓' : '•'}</span> Uppercase letter
                </div>
                <div style={{ color: hasSpecial ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{hasSpecial ? '✓' : '•'}</span> Special symbol (!@#$)
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !hasMinLength || !isMatch}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 8,
                backgroundColor: isSubmitting || !hasMinLength || !isMatch ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: isSubmitting || !hasMinLength || !isMatch ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                transition: 'background-color 0.15s ease'
              }}
            >
              <Lock size={14} />
              {isSubmitting ? 'Saving Credentials...' : 'Save Password & Activate Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

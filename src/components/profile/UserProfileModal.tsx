import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  User,
  Mail,
  Shield,
  Building2,
  CheckCircle2,
  Check,
  RefreshCw
} from 'lucide-react';
import { authApi, type AuthUserInfo } from '../../api/auth.api';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

// Curated professional preset avatars
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
];

const PRESET_COLORS = [
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Slate', value: '#475569' },
];

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updatedUser: AuthUserInfo) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = authApi.getCurrentUser();

  const [activeTab, setActiveTab] = useState<'avatar' | 'info'>('avatar');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [avatarBgColor, setAvatarBgColor] = useState<string>('#3b82f6');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Initialize form state when opened or user changes
  useEffect(() => {
    if (isOpen) {
      const u = authApi.getCurrentUser();
      if (u) {
        setName(u.name || u.email?.split('@')[0] || 'Admin');
        setEmail(u.email || '');
        setAvatar(u.avatar || '');
      }
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const initials = (name || email || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image size must be smaller than 2MB.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const updated = await authApi.updateProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar: avatar || undefined,
      });

      setSuccessToast('Profile updated successfully!');
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setIsSaving(false);
      setErrorMsg(err?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
              }}
            >
              <User size={16} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                Account & Profile Settings
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
                Manage your name, email, and profile avatar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: 6,
              borderRadius: 6,
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#ecfdf5',
              borderBottom: '1px solid #d1fae5',
              color: '#065f46',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={15} color="#10b981" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#fef2f2',
              borderBottom: '1px solid #fee2e2',
              color: '#991b1b',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Profile Card Summary Banner */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          {/* Main Avatar Preview */}
          <div style={{ position: 'relative' }}>
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
            ) : (
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  backgroundColor: avatarBgColor,
                  color: '#ffffff',
                  fontSize: 18,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
              title="Upload photo"
            >
              <Camera size={11} />
            </button>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {name || 'Your Name'}
              </span>
              <Badge label={currentUser?.isSuperAdmin ? 'Super Admin' : currentUser?.role || 'User'} />
            </div>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {email || 'user@example.com'}
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/webp,image/gif"
            style={{ display: 'none' }}
          />
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff', padding: '0 18px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            style={{
              padding: '10px 14px',
              borderBottom: activeTab === 'avatar' ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === 'avatar' ? '#2563eb' : '#64748b',
              fontSize: 12,
              fontWeight: activeTab === 'avatar' ? 700 : 500,
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Camera size={13} />
            <span>Avatar & Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            style={{
              padding: '10px 14px',
              borderBottom: activeTab === 'info' ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === 'info' ? '#2563eb' : '#64748b',
              fontSize: 12,
              fontWeight: activeTab === 'info' ? 700 : 500,
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <User size={13} />
            <span>Account Details</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', maxHeight: 330, overflowY: 'auto' }}>
            {activeTab === 'avatar' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Upload Action Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px dashed #cbd5e1',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Upload size={16} color="#64748b" />
                    <div>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#334155' }}>
                        Custom Image Upload
                      </p>
                      <p style={{ margin: 0, fontSize: 10, color: '#94a3b8' }}>
                        PNG, JPG, or WEBP up to 2MB
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse
                    </Button>
                    {avatar && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleRemoveAvatar}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>

                {/* Preset Avatars Grid */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Select Preset Avatar
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {PRESET_AVATARS.map((url, idx) => {
                      const isSelected = avatar === url;
                      return (
                        <div
                          key={idx}
                          onClick={() => setAvatar(url)}
                          style={{
                            position: 'relative',
                            cursor: 'pointer',
                            borderRadius: 10,
                            overflow: 'hidden',
                            border: isSelected ? '2px solid #2563eb' : '2px solid transparent',
                            padding: 2,
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <img
                            src={url}
                            alt={`Preset ${idx + 1}`}
                            style={{
                              width: '100%',
                              height: 48,
                              borderRadius: 8,
                              objectFit: 'cover',
                            }}
                          />
                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Check size={10} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Initials Background Colors */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Or Pick Initials Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {PRESET_COLORS.map((col) => (
                      <button
                        key={col.value}
                        type="button"
                        onClick={() => {
                          setAvatarBgColor(col.value);
                          setAvatar(''); // switch to initials
                        }}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: col.value,
                          border: avatarBgColor === col.value && !avatar ? '2px solid #0f172a' : '2px solid #ffffff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          transition: 'transform 0.1s ease',
                          transform: avatarBgColor === col.value && !avatar ? 'scale(1.15)' : 'none',
                        }}
                        title={col.label}
                      >
                        {avatarBgColor === col.value && !avatar && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <User size={14} />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      style={{
                        width: '100%',
                        padding: '8px 10px 8px 32px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: 12,
                        color: '#0f172a',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <Mail size={14} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@epaper.in"
                      style={{
                        width: '100%',
                        padding: '8px 10px 8px 32px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: 12,
                        color: '#0f172a',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                {/* Authority & Role Readonly Info */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Shield size={12} color="#6366f1" /> Assigned Role:
                    </span>
                    <strong style={{ fontSize: 11, color: '#0f172a' }}>
                      {currentUser?.isSuperAdmin ? 'Platform Super Admin' : currentUser?.role || 'Tenant Staff'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={12} color="#0284c7" /> Active Tenant:
                    </span>
                    <strong style={{ fontSize: 11, color: '#0f172a' }}>
                      {localStorage.getItem('queflow_active_tenant') || 'Global Organization'}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div
            style={{
              padding: '12px 18px',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#2563eb',
                color: '#ffffff',
              }}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={12} className="animate-spin" /> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

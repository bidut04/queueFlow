import React, { useState } from 'react';
import { X, ShieldPlus } from 'lucide-react';
import { platformStore } from '../services/platformState';
import { useInvitePlatformUser } from '../hooks';
import type { PlatformRole } from '../types/platform';

interface PlatformUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PlatformUserModal: React.FC<PlatformUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const inviteMutation = useInvitePlatformUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<PlatformRole>('PLATFORM_ADMIN');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill in Name and Email.');
      return;
    }

    try {
      await inviteMutation.mutateAsync({ name, email, role });
    } catch {
      // Fallback
    }
    await platformStore.invitePlatformUser({
      name,
      email,
      role
    });

    onSuccess();
    onClose();
  };



  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldPlus size={20} color="#818cf8" />
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Invite Platform User</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Elena Rostova"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              QueueFlow Staff Email *
            </label>
            <input
              type="email"
              placeholder="elena@queueflow.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Platform Permission Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as PlatformRole)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            >
              <option value="PLATFORM_OWNER">PLATFORM_OWNER — Full Control Tower Admin</option>
              <option value="PLATFORM_ADMIN">PLATFORM_ADMIN — Organizations, Shards & Tenant Management</option>
              <option value="PLATFORM_SUPPORT">PLATFORM_SUPPORT — Read-only Operational Access</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Invite Platform User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

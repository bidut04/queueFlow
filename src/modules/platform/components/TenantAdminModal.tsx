import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { platformStore } from '../services/platformState';
import { useCreateTenantAdmin } from '../hooks';
import type { Organization } from '../types/platform';

interface TenantAdminModalProps {
  organizations: Organization[];
  defaultOrgId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TenantAdminModal: React.FC<TenantAdminModalProps> = ({
  organizations,
  defaultOrgId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const createAdminMutation = useCreateTenantAdmin();
  const [orgId, setOrgId] = useState(defaultOrgId || organizations[0]?.id || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'TENANT_OWNER' | 'TENANT_ADMIN'>('TENANT_ADMIN');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !orgId) {
      alert('Please fill in Name, Email, and Organization.');
      return;
    }

    try {
      await createAdminMutation.mutateAsync({
        organizationId: orgId,
        input: { name, email, phone, role }
      });
    } catch {
      // Fallback
    }

    await platformStore.createTenantAdmin({
      organizationId: orgId,
      name,
      email,
      phone,
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
          maxWidth: 500,
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
            <UserPlus size={20} color="#818cf8" />
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Create Tenant Administrator</h3>
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
              Target Organization *
            </label>
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Rachel Green"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Email Address *
            </label>
            <input
              type="email"
              placeholder="rachel@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Tenant Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            >
              <option value="TENANT_ADMIN">TENANT_ADMIN (Standard Tenant Admin)</option>
              <option value="TENANT_OWNER">TENANT_OWNER (Primary Tenant Owner)</option>
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
              Create Tenant Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

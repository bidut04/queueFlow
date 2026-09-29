import React, { useState } from 'react';
import { X, Check, Building2, User, CreditCard, Database, ArrowRight, ArrowLeft } from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { OrgType } from '../types/platform';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1 - Org Info
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<OrgType>('BANK');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [timezone, setTimezone] = useState('America/New_York');

  // Step 2 - Primary Admin
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  // Step 3 - Subscription
  const [selectedPlan, setSelectedPlan] = useState('Professional');

  // Step 4 - Shard
  const availableShards = platformStore.shards.filter((s) => !s.readOnly);
  const [preferredShard, setPreferredShard] = useState(availableShards[0]?.id || 'shard-us-east-1a');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactEmail || !adminName || !adminEmail) {
      alert('Please fill in all required organization and admin fields.');
      return;
    }

    platformStore.createOrganization({
      name,
      legalName: legalName || name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      type,
      contactEmail,
      contactPhone,
      country,
      timezone,
      primaryAdminName: adminName,
      primaryAdminEmail: adminEmail,
      primaryAdminPhone: adminPhone,
      planName: selectedPlan,
      preferredShardId: preferredShard
    });

    onCreated();
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
          maxWidth: 680,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
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
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Create New Organization</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#94a3b8' }}>
              Multi-tenant organization onboarding & infrastructure provisioner
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Multi-step Stepper Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          {[
            { num: 1, label: 'Org Information', icon: Building2 },
            { num: 2, label: 'Primary Admin', icon: User },
            { num: 3, label: 'Subscription', icon: CreditCard },
            { num: 4, label: 'Infrastructure & Shard', icon: Database }
          ].map((s) => {
            const Icon = s.icon;
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: isCurrent || isDone ? 1 : 0.45
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: isDone ? '#10b981' : isCurrent ? '#4f46e5' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800
                  }}
                >
                  {isDone ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#0f172a' : '#64748b' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div style={{ padding: 24, maxHeight: 440, overflowY: 'auto' }}>
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Organization Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. City National Bank"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="qf-input"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Legal Registered Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. City National Bank Corp."
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="city-national-bank"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Organization Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as OrgType)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                >
                  <option value="BANK">Bank & Financial</option>
                  <option value="HOSPITAL">Hospital</option>
                  <option value="CLINIC">Medical Clinic</option>
                  <option value="GOVERNMENT">Government Agency</option>
                  <option value="POST_OFFICE">Postal & Logistics</option>
                  <option value="UNIVERSITY">University / Education</option>
                  <option value="CORPORATE">Corporate Enterprise</option>
                  <option value="SERVICE_CENTER">Customer Service Center</option>
                  <option value="OTHER">Other Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Contact Email *
                </label>
                <input
                  type="email"
                  placeholder="admin@organization.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Timezone
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 12, backgroundColor: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe' }}>
                <p style={{ margin: 0, fontSize: 12, color: '#1e40af' }}>
                  The Primary Admin will be created with the <strong>TENANT_OWNER</strong> role and sent initial setup credentials.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Vance"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Admin Email Address *
                </label>
                <input
                  type="email"
                  placeholder="david@organization.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Admin Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 234-8901"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { name: 'Starter', price: '$199/mo', desc: 'Up to 5 Branches, Standard Queue Engine' },
                { name: 'Professional', price: '$499/mo', desc: 'Up to 25 Branches, Advanced Routing & SLA Analytics' },
                { name: 'Enterprise', price: '$1,299/mo', desc: 'Unlimited Branches, Multi-region Shard, Dedicated Manager' }
              ].map((p) => {
                const isSelected = selectedPlan === p.name;
                return (
                  <div
                    key={p.name}
                    onClick={() => setSelectedPlan(p.name)}
                    style={{
                      border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#f5f3ff' : '#ffffff',
                      borderRadius: 8,
                      padding: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{p.name}</h4>
                        {isSelected && <Check size={16} color="#4f46e5" />}
                      </div>
                      <p style={{ margin: '8px 0', fontSize: 16, fontWeight: 800, color: '#4f46e5' }}>{p.price}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 12, backgroundColor: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                  QueueFlow Consistent Shard Catalog & Ring Topology Assignment:
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#64748b' }}>
                  The platform automatically selects the least utilized writable shard for high availability and load distribution.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Assigned Writable Shard Catalog
                </label>
                <select
                  value={preferredShard}
                  onChange={(e) => setPreferredShard(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}
                >
                  {availableShards.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} — {s.region} ({s.utilizationPercent}% capacity used, {s.tenantCount} tenants)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Summary Preview:
                </p>
                <ul style={{ fontSize: 12, color: '#475569', margin: 0, paddingLeft: 18 }}>
                  <li><strong>Organization:</strong> {name || 'Not specified'} ({type})</li>
                  <li><strong>Primary Admin:</strong> {adminName} ({adminEmail})</li>
                  <li><strong>Plan:</strong> {selectedPlan}</li>
                  <li><strong>Database Shard:</strong> {preferredShard}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 1 && (!name || !contactEmail)) {
                  alert('Please provide Organization Name and Contact Email.');
                  return;
                }
                if (step === 2 && (!adminName || !adminEmail)) {
                  alert('Please provide Primary Admin Name and Email.');
                  return;
                }
                setStep((prev) => prev + 1);
              }}
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '9px 20px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
              }}
            >
              <Check size={16} /> Provision & Create Organization
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { PlatformSettings } from '../types/platform';

export const PlatformSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>({ ...platformStore.settings });
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'rateLimits' | 'notifications' | 'infrastructure'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    platformStore.settings = { ...settings };
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Platform Global Settings & Security Policy
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, margin: 0 }}>
            Configure global control tower parameters, API rate limiting, MFA policies, notifications, and default shard routing.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {savedSuccess ? <Check size={16} /> : <Save size={16} />}
          {savedSuccess ? 'Settings Saved!' : 'Save Platform Settings'}
        </button>
      </div>

      {/* Main Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Left Side Section Selector */}
        <div className="qf-card" style={{ padding: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { id: 'general', label: 'General & Platform Name' },
              { id: 'security', label: 'Security & Auth MFA' },
              { id: 'rateLimits', label: 'API Ingress Rate Limits' },
              { id: 'notifications', label: 'System Alert Webhooks' },
              { id: 'infrastructure', label: 'Infrastructure & Sharding' }
            ].map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id as any)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: isActive ? '#e0e7ff' : 'transparent',
                    color: isActive ? '#3730a3' : '#475569',
                    fontSize: 13,
                    fontWeight: isActive ? 800 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="qf-card" style={{ padding: 24 }}>
          {activeSection === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>General Platform Parameters</h3>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Platform Control Tower Name
                </label>
                <input
                  type="text"
                  value={settings.general.platformName}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, platformName: e.target.value } })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Support & Operations Email
                </label>
                <input
                  type="email"
                  value={settings.general.supportEmail}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, supportEmail: e.target.value } })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <input
                  type="checkbox"
                  id="maint"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, maintenanceMode: e.target.checked } })}
                />
                <label htmlFor="maint" style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Enable Platform-Wide Maintenance Mode (Blocks non-superadmin API access)
                </label>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Security & Authentication Policy</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="mfa"
                  checked={settings.security.enforceMfaForStaff}
                  onChange={(e) => setSettings({ ...settings, security: { ...settings.security, enforceMfaForStaff: e.target.checked } })}
                />
                <label htmlFor="mfa" style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Enforce Mandatory Two-Factor Authentication (MFA) for all Super Admin & Staff Users
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Super Admin Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeoutMinutes}
                  onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeoutMinutes: parseInt(e.target.value) || 60 } })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Master API Signing Secret Key (Masked for Security)
                </label>
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••••"
                  disabled
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, backgroundColor: '#f8fafc', color: '#94a3b8' }}
                />
              </div>
            </div>
          )}

          {activeSection === 'rateLimits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>API Rate Limits & Ingress Control</h3>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Max Tenant API Requests Per Minute
                </label>
                <input
                  type="number"
                  value={settings.rateLimits.apiRequestsPerMinute}
                  onChange={(e) => setSettings({ ...settings, rateLimits: { ...settings.rateLimits, apiRequestsPerMinute: parseInt(e.target.value) || 12000 } })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Public Booking Form Submissions Limit (Per IP / Minute)
                </label>
                <input
                  type="number"
                  value={settings.rateLimits.publicFormSubmissionsPerMin}
                  onChange={(e) => setSettings({ ...settings, rateLimits: { ...settings.rateLimits, publicFormSubmissionsPerMin: parseInt(e.target.value) || 300 } })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                />
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>System Alert Webhooks & Email Routes</h3>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Slack Incident Webhook URL (Masked Secret)
                </label>
                <input
                  type="text"
                  value={settings.notifications.slackWebhookUrlMasked}
                  onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, slackWebhookUrlMasked: e.target.value } })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace' }}
                />
              </div>
            </div>
          )}

          {activeSection === 'infrastructure' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Infrastructure & Default Shard</h3>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Default Database Shard for New Organizations
                </label>
                <select
                  value={settings.infrastructure.defaultShard}
                  onChange={(e) => setSettings({ ...settings, infrastructure: { ...settings.infrastructure, defaultShard: e.target.value } })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                >
                  {platformStore.shards.map((s) => (
                    <option key={s.id} value={s.id}>{s.id} — {s.region}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Save, Bell, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const [systemName, setSystemName] = useState<string>('QueueFlow Enterprise');
  const [supportEmail, setSupportEmail] = useState<string>('support@queflow.io');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System settings updated successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>System Settings</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          Configure queue behavior, notifications, branch rules, and integrations.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
        <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} color="#2563eb" /> General Configuration
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Organization / System Name
            </label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Support Email Address
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="#2563eb" /> Notifications & Alerts
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Real-time Queue Auto Refresh</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>Automatically refresh counter boards every 10 seconds.</p>
            </div>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>SMS Customer Alerts</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>Send automated text alerts when customer ticket is up next.</p>
            </div>
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
          </div>
        </div>

        <div>
          <Button type="submit" variant="primary" icon={<Save size={15} />}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

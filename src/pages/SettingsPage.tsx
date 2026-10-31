import React, { useState, useEffect } from 'react';
import { Save, Bell, Globe, User, Edit } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authApi } from '../api/auth.api';
import { UserProfileModal } from '../components/profile/UserProfileModal';

export const SettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(authApi.getCurrentUser());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [systemName, setSystemName] = useState<string>('QueueFlow Enterprise');
  const [supportEmail, setSupportEmail] = useState<string>('support@queflow.io');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(true);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setCurrentUser(e.detail || authApi.getCurrentUser());
    };
    window.addEventListener('auth:profile-updated', handleUpdate);
    return () => window.removeEventListener('auth:profile-updated', handleUpdate);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System settings updated successfully!');
  };

  const displayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Admin';
  const displayAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>System Settings</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          Configure queue behavior, notifications, branch rules, and integrations.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
        {/* Personal Profile Section */}
        <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <User size={18} color="#2563eb" /> Personal Profile & Identity
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsProfileModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Edit size={13} /> Edit Profile & Avatar
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
            <img
              src={displayAvatar}
              alt={displayName}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                {displayName}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                {currentUser?.email || 'user@example.com'} • <strong style={{ color: '#2563eb' }}>{currentUser?.role || 'Admin'}</strong>
              </p>
            </div>
          </div>
        </div>

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

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => {
          setCurrentUser(updated);
        }}
      />
    </div>
  );
};

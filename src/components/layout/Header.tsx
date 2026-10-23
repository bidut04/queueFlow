import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, ChevronDown, PanelLeft, LogOut, Shield, Settings, Building2 } from 'lucide-react';
import { Tooltip } from '../ui/tooltip';
import { authApi } from '../../api/auth.api';
import { orgAdminAuthStore } from '../../modules/platform/services/orgAdminAuthStore';
import { LiveSocketIndicator } from '../ui/LiveSocketIndicator';

export interface HeaderProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  currentDateText?: string;
  onNavigate?: (pageId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Rahul Admin',
  userRole = 'Tenant Admin',
  userAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  currentDateText = 'Tue, Apr 23, 2025',
  onNavigate,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = authApi.getCurrentUser();
  const orgAdminUser = orgAdminAuthStore.currentUser;

  const isSuper = Boolean(
    currentUser?.isSuperAdmin ||
    currentUser?.email === 'admin@gmail.com'
  );

  const displayName = isSuper
    ? 'Super Admin'
    : orgAdminUser?.name || currentUser?.email?.split('@')[0] || userName;

  const displayEmail = currentUser?.email || orgAdminUser?.email || 'admin@gmail.com';
  const displayRole = isSuper ? 'Platform Owner' : (currentUser?.role || userRole);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await authApi.logout();
    window.location.href = '/login';
  };

  const handleNavigateTo = (pageId: string) => {
    setIsDropdownOpen(false);
    if (onNavigate) {
      onNavigate(pageId);
    } else {
      window.location.href = pageId === 'dashboard' ? '/' : `/${pageId}`;
    }
  };

  return (
    <header
      style={{
        height: 52,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left Area: Sidebar Toggle + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tooltip content="Toggle sidebar (Ctrl+B)" side="bottom">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('qf-toggle-sidebar'))}
            aria-label="Toggle sidebar"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <PanelLeft size={16} />
          </button>
        </Tooltip>

        {/* Search Input Bar */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            placeholder="Search anything..."
            style={{
              width: '100%',
              paddingLeft: 34,
              paddingRight: 12,
              paddingTop: 6,
              paddingBottom: 6,
              fontSize: 12,
              borderRadius: 999,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* Right Header Action Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Realtime WebSocket Connection Indicator */}
        <LiveSocketIndicator />

        {/* Date Selector Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
          }}
        >
          <Calendar size={13} color="#64748b" />
          <span>{currentDateText}</span>
          <ChevronDown size={12} color="#94a3b8" />
        </div>

        {/* Notification Bell with Badge */}
        <div
          style={{
            position: 'relative',
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Bell size={15} color="#475569" />
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: 9,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff',
            }}
          >
            5
          </span>
        </div>

        {/* User Profile Pill with Interactive Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '3px 8px 3px 4px',
              borderRadius: 999,
              cursor: 'pointer',
              backgroundColor: isDropdownOpen ? '#f1f5f9' : 'transparent',
              border: '1px solid',
              borderColor: isDropdownOpen ? '#cbd5e1' : 'transparent',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            <img
              src={userAvatar}
              alt={displayName}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                objectFit: 'cover',
                border: isSuper ? '2px solid #6366f1' : '1px solid #cbd5e1',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
                {displayName}
              </span>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: isSuper ? '#6366f1' : '#0284c7',
                }}
              >
                {displayRole}
              </span>
            </div>
            <ChevronDown
              size={12}
              color="#94a3b8"
              style={{
                marginLeft: 2,
                transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s ease',
              }}
            />
          </div>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 250,
                backgroundColor: '#ffffff',
                borderRadius: 12,
                boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.18), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
                border: '1px solid #e2e8f0',
                padding: '8px',
                zIndex: 1000,
              }}
            >
              {/* User Identity Header */}
              <div
                style={{
                  padding: '8px 10px 10px',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                    {displayName}
                  </p>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      backgroundColor: isSuper ? '#e0e7ff' : '#e0f2fe',
                      color: isSuper ? '#4338ca' : '#0369a1',
                      border: `1px solid ${isSuper ? '#c7d2fe' : '#bae6fd'}`,
                      textTransform: 'uppercase',
                    }}
                  >
                    {isSuper ? 'SUPER ADMIN' : 'TENANT ADMIN'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b', wordBreak: 'break-all' }}>
                  {displayEmail}
                </p>
              </div>

              {/* Workspace Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 6,
                  fontSize: 10.5,
                  color: '#475569',
                  marginBottom: 6,
                  border: '1px solid #f1f5f9',
                }}
              >
                <Building2 size={13} color="#64748b" />
                <span>Tenant: <strong>tenant_bank_a</strong></span>
              </div>

              {/* Navigation Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isSuper && (
                  <button
                    onClick={() => handleNavigateTo('platform')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: '#4f46e5',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eef2ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Shield size={14} color="#6366f1" />
                    <span>Super Admin Platform</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavigateTo('settings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Settings size={14} color="#64748b" />
                  <span>Workspace Settings</span>
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '6px 0' }} />

              {/* Log Out Button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fee2e2',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#dc2626',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                  e.currentTarget.style.color = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                }}
              >
                <LogOut size={14} color="#dc2626" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

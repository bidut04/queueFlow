import React from 'react';
import { Search, Bell, Calendar, ChevronDown } from 'lucide-react';

export interface HeaderProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  currentDateText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Rahul Admin',
  userRole = 'Super Admin',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  currentDateText = 'Tue, Apr 23, 2025'
}) => {
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
        zIndex: 40
      }}
    >
      {/* Search Input Bar */}
      <div style={{ position: 'relative', width: 280 }}>
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8'
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
            transition: 'border-color 0.2s ease'
          }}
        />
      </div>

      {/* Right Header Action Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
            cursor: 'pointer'
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
            cursor: 'pointer'
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
              border: '2px solid #ffffff'
            }}
          >
            5
          </span>
        </div>

        {/* User Profile Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '3px 6px 3px 3px',
            borderRadius: 999,
            cursor: 'pointer'
          }}
        >
          <img
            src={userAvatar}
            alt={userName}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
              {userName}
            </span>
            <span style={{ fontSize: 10, color: '#64748b' }}>{userRole}</span>
          </div>
          <ChevronDown size={12} color="#94a3b8" style={{ marginLeft: 2 }} />
        </div>
      </div>
    </header>
  );
};

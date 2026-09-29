import React, { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Briefcase,
  Users,
  CalendarCheck,
  Ticket,
  Layers,
  BarChart3,
  Settings,
  HelpCircle,
  ArrowRight,
  Layers3,
  ChevronDown,
  FolderTree,
  Lock,
  Wrench,
  FileText,
  UserCheck,
  ShieldCheck,
  Building2,
  GitMerge
} from 'lucide-react';
import type { NavPageId, NavItem } from '../../types/navigation';

export interface SidebarProps {
  activePage: NavPageId;
  onSelectPage: (pageId: NavPageId) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'platform', label: 'Super Admin', iconName: 'platform' },
  { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
  { id: 'bookings', label: 'Bookings', iconName: 'bookings' },
  { id: 'users', label: 'Users', iconName: 'users' },
  { id: 'tickets', label: 'Tickets', iconName: 'tickets' },
  { id: 'queue', label: 'Queue', iconName: 'queue' },
  { id: 'reports', label: 'Reports', iconName: 'reports' },
  {
    id: 'master',
    label: 'Master',
    iconName: 'master',
    subItems: [
      { id: 'master-booking-form', label: 'Booking Form', iconName: 'master-booking-form' },
      { id: 'form-builder', label: 'Form Builder', iconName: 'form-builder' },
      { id: 'login', label: 'Login Portal', iconName: 'login' },
      { id: 'login-form', label: 'Login Form', iconName: 'login-form' },
      { id: 'roles', label: 'Role', iconName: 'roles' },
      { id: 'departments', label: 'Department', iconName: 'departments' },
      { id: 'branches', label: 'Branch', iconName: 'branches' },
      { id: 'services', label: 'Service', iconName: 'services' },
      { id: 'employees', label: 'Employee', iconName: 'employees' }
    ]
  },
  {
    id: 'association',
    label: 'Association',
    iconName: 'association',
    subItems: [
      { id: 'employee-department-association', label: 'Emp Dept Association', iconName: 'employee-department-association' }
    ]
  },
  { id: 'settings', label: 'Settings', iconName: 'settings' }
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    master: true,
    association: true
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getNavIcon = (iconName: string) => {
    const size = 15;
    switch (iconName) {
      case 'platform':
        return <ShieldCheck size={size} color="#818cf8" />;
      case 'dashboard':
        return <LayoutDashboard size={size} />;
      case 'master':
        return <FolderTree size={size} />;
      case 'association':
      case 'employee-department-association':
        return <GitMerge size={size} />;
      case 'master-booking-form':
        return <FileText size={size} />;
      case 'form-builder':
        return <Wrench size={size} />;
      case 'roles':
        return <ShieldCheck size={size} />;
      case 'departments':
        return <Building2 size={size} />;
      case 'branches':
        return <GitBranch size={size} />;
      case 'services':
        return <Briefcase size={size} />;
      case 'employees':
        return <UserCheck size={size} />;
      case 'users':
        return <Users size={size} />;
      case 'bookings':
        return <CalendarCheck size={size} />;
      case 'login':
      case 'login-form':
        return <Lock size={size} />;
      case 'tickets':
        return <Ticket size={size} />;
      case 'queue':
        return <Layers size={size} />;
      case 'reports':
        return <BarChart3 size={size} />;
      case 'settings':
      default:
        return <Settings size={size} />;
    }
  };

  return (
    <aside
      style={{
        width: 215,
        minWidth: 215,
        backgroundColor: '#0f172a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '14px 10px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Logo Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '2px 8px 14px 8px',
            cursor: 'pointer',
            flexShrink: 0
          }}
          onClick={() => onSelectPage('dashboard')}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Layers3 size={16} color="#ffffff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            QueueFlow
          </span>
        </div>

        {/* Navigation Items Area with Invisible Scrollbar */}
        <nav
          className="qf-sidebar-nav"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flex: 1,
            overflowY: 'auto'
          }}
        >
          {NAV_ITEMS.map((item) => {
            if (item.subItems) {
              const isChildActive = item.subItems.some((sub) => sub.id === activePage);
              const isOpen = !!openSections[item.id];

              return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Header Parent Item */}
                  <button
                    onClick={() => toggleSection(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 8,
                      border: 'none',
                      backgroundColor: isChildActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                      color: isChildActive ? '#60a5fa' : '#94a3b8',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ display: 'inline-flex', color: isChildActive ? '#60a5fa' : '#94a3b8' }}>
                        {getNavIcon(item.iconName)}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={13}
                      style={{
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s ease',
                        opacity: 0.7
                      }}
                    />
                  </button>

                  {/* Sub Navigation List with Precise Alignment */}
                  {isOpen && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      paddingLeft: 8,
                      borderLeft: '1.5px solid #334155',
                      marginLeft: 14,
                      marginTop: 1,
                      marginBottom: 3
                    }}>
                      {item.subItems.map((sub) => {
                        const isSubActive = activePage === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => onSelectPage(sub.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 7,
                              width: '100%',
                              padding: '5.5px 8px',
                              borderRadius: 6,
                              border: 'none',
                              backgroundColor: isSubActive ? '#2563eb' : 'transparent',
                              color: isSubActive ? '#ffffff' : '#cbd5e1',
                              fontSize: 11,
                              fontWeight: isSubActive ? 700 : 500,
                              cursor: 'pointer',
                              textAlign: 'left',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.15s ease',
                              boxShadow: isSubActive ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none'
                            }}
                          >
                            <span style={{ display: 'inline-flex', flexShrink: 0, opacity: isSubActive ? 1 : 0.75 }}>
                              {getNavIcon(sub.iconName || sub.id)}
                            </span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id as NavPageId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 9,
                  border: 'none',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: 12.5,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'
                }}
              >
                <span style={{ display: 'inline-flex', opacity: isActive ? 1 : 0.8 }}>
                  {getNavIcon(item.iconName)}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Need Help Footer Card */}
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: 10,
          padding: '10px 12px',
          border: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <HelpCircle size={13} color="#ffffff" />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>Need Help?</p>
            <p style={{ fontSize: 9.5, color: '#94a3b8' }}>Contact Support</p>
          </div>
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 2,
            display: 'inline-flex'
          }}
        >
          <ArrowRight size={12} />
        </button>
      </div>
    </aside>
  );
};

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import {
  LayoutDashboard,
  Building2,
  Users2,
  CreditCard,
  Activity,
  Database,
  ArrowLeftRight,
  ShieldCheck,
  Settings,
  ClipboardCheck,
  PanelLeftClose,
  HelpCircle,
  Cpu
} from 'lucide-react';
import type { PlatformPageId } from '../types/platform';
import { platformStore } from '../services/platformState';
import { Tooltip } from '../../../components/ui/tooltip';
import { ResizableHandle } from '../../../components/ui/resizable';

interface PlatformSidebarProps {
  activeTab: PlatformPageId;
  onSelectTab: (tab: PlatformPageId) => void;
}

const COLLAPSED_WIDTH = 68;
const MIN_EXPANDED_WIDTH = 190;
const MAX_EXPANDED_WIDTH = 380;
const DEFAULT_EXPANDED_WIDTH = 215;

export const PlatformSidebar: React.FC<PlatformSidebarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const pendingCount = platformStore.organizations.filter((o) => o.status === 'PENDING').length;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('qf_platform_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('qf_platform_sidebar_width');
      return saved ? Math.max(MIN_EXPANDED_WIDTH, Math.min(MAX_EXPANDED_WIDTH, parseInt(saved, 10))) : DEFAULT_EXPANDED_WIDTH;
    } catch {
      return DEFAULT_EXPANDED_WIDTH;
    }
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // GSAP Refs
  const asideRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const activePillRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      localStorage.setItem('qf_platform_sidebar_collapsed', String(isCollapsed));
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (!isCollapsed) {
      try {
        localStorage.setItem('qf_platform_sidebar_width', String(sidebarWidth));
      } catch {
        // ignore
      }
    }
  }, [sidebarWidth, isCollapsed]);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // GSAP: Collapse / Expand Smooth Transition
  useLayoutEffect(() => {
    if (!asideRef.current) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      gsap.set(asideRef.current, {
        width: isCollapsed ? COLLAPSED_WIDTH : sidebarWidth,
        margin: isCollapsed ? '10px 0 10px 10px' : '0px',
        borderRadius: isCollapsed ? 28 : 0,
        height: isCollapsed ? 'calc(100vh - 20px)' : '100%',
        padding: isCollapsed ? '14px 6px 12px 6px' : '10px 8px'
      });
      return;
    }

    const aside = asideRef.current;
    gsap.to(aside, {
      width: isCollapsed ? COLLAPSED_WIDTH : sidebarWidth,
      margin: isCollapsed ? '10px 0 10px 10px' : '0px',
      borderRadius: isCollapsed ? 28 : 0,
      height: isCollapsed ? 'calc(100vh - 20px)' : '100%',
      padding: isCollapsed ? '14px 6px 12px 6px' : '10px 8px',
      duration: 0.36,
      ease: 'power3.inOut'
    });
  }, [isCollapsed]);

  // GSAP: Sliding Indicator Navigation Transition
  useLayoutEffect(() => {
    if (!navRef.current || !activePillRef.current) return;

    const targetEl = navRef.current.querySelector<HTMLElement>(`[data-nav-id="${activeTab}"]`);
    if (!targetEl) {
      gsap.to(activePillRef.current, { opacity: 0, duration: 0.2 });
      return;
    }

    const navRect = navRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const top = targetRect.top - navRect.top + navRef.current.scrollTop;
    const height = targetRect.height;
    const left = isCollapsed ? (navRect.width - 40) / 2 : 0;
    const width = isCollapsed ? 40 : targetRect.width;

    gsap.to(activePillRef.current, {
      top,
      left,
      width,
      height,
      opacity: 1,
      duration: 0.34,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    const iconEl = targetEl.querySelector('svg');
    if (iconEl) {
      gsap.fromTo(
        iconEl,
        { scale: 0.82 },
        { scale: 1, duration: 0.35, ease: 'back.out(2.2)', overwrite: 'auto' }
      );
    }
  }, [activeTab, isCollapsed]);

  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const initialWidth = isCollapsed ? COLLAPSED_WIDTH : sidebarWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const targetWidth = initialWidth + deltaX;

      if (targetWidth < 130) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        const clamped = Math.max(MIN_EXPANDED_WIDTH, Math.min(MAX_EXPANDED_WIDTH, targetWidth));
        setSidebarWidth(clamped);
        if (asideRef.current) {
          gsap.set(asideRef.current, { width: clamped });
        }
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleDoubleClickRail = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setSidebarWidth(DEFAULT_EXPANDED_WIDTH);
    } else {
      setIsCollapsed(true);
    }
  };

  const navItems = [
    { id: 'overview' as PlatformPageId, label: 'Overview', icon: LayoutDashboard },
    { id: 'organizations' as PlatformPageId, label: 'Organizations', icon: Building2 },
    { id: 'approvals' as PlatformPageId, label: 'Registration Approvals', icon: ClipboardCheck, badge: pendingCount },
    { id: 'users' as PlatformPageId, label: 'Platform Users', icon: Users2 },
    { id: 'subscriptions' as PlatformPageId, label: 'Subscriptions / Plans', icon: CreditCard },
    { id: 'system-health' as PlatformPageId, label: 'System Health', icon: Activity },
    { id: 'shards' as PlatformPageId, label: 'Shards Management', icon: Database },
    { id: 'migrations' as PlatformPageId, label: 'Tenant Migrations', icon: ArrowLeftRight },
    { id: 'audit' as PlatformPageId, label: 'Platform Audit Logs', icon: ShieldCheck },
    { id: 'settings' as PlatformPageId, label: 'Platform Settings', icon: Settings }
  ];

  return (
    <aside
      ref={asideRef}
      style={{
        width: isCollapsed ? COLLAPSED_WIDTH : sidebarWidth,
        minWidth: isCollapsed ? COLLAPSED_WIDTH : sidebarWidth,
        maxWidth: MAX_EXPANDED_WIDTH,
        backgroundColor: '#090d16', // Preserves exact platform sidebar background color
        borderRight: isCollapsed ? 'none' : '1px solid #1e293b',
        border: isCollapsed ? '1px solid #1e293b' : undefined,
        borderRadius: isCollapsed ? 28 : 0,
        boxShadow: isCollapsed ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isCollapsed ? '14px 6px 12px 6px' : '10px 8px',
        margin: isCollapsed ? '10px 0 10px 10px' : '0px',
        flexShrink: 0,
        height: isCollapsed ? 'calc(100vh - 20px)' : '100%',
        position: 'relative',
        userSelect: isDragging ? 'none' : 'auto'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'visible' }}>
        {/* Header Area */}
        {!isCollapsed ? (
          <div
            style={{
              padding: '2px 8px 8px 8px',
              marginBottom: 6,
              borderBottom: '1px solid #1e293b',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              Platform Control Plane
            </p>

            <Tooltip content="Collapse sidebar (Ctrl+B)" side="bottom">
              <button
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <PanelLeftClose size={13} />
              </button>
            </Tooltip>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: 6 }}>
            <Tooltip content="Expand Control Plane (Ctrl+B)" side="right">
              <button
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand sidebar"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: '#3730a3',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 3px 8px rgba(55, 48, 163, 0.4)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3730a3';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Cpu size={18} color="#ffffff" />
              </button>
            </Tooltip>

            <div style={{ width: 28, height: 1, backgroundColor: '#1e293b', margin: '12px 0 6px 0' }} />
          </div>
        )}

        {/* Navigation Area with GSAP sliding pill */}
        <nav
          ref={navRef}
          className="qf-sidebar-nav"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isCollapsed ? 'center' : 'stretch',
            gap: isCollapsed ? 6 : 4,
            overflowY: 'auto',
            flex: 1,
            padding: isCollapsed ? '4px 0' : '0 2px 0 0'
          }}
        >
          {/* GSAP Sliding Indicator */}
          <div
            ref={activePillRef}
            className={`qf-nav-sliding-pill ${isCollapsed ? 'collapsed' : ''}`}
            style={{
              backgroundColor: '#3730a3',
              boxShadow: '0 2px 10px rgba(55, 48, 163, 0.5)',
              opacity: 0
            }}
          />

          {navItems.filter((item) => (isCollapsed ? item.id !== 'settings' : true)).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (isCollapsed) {
              return (
                <div key={item.id} style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', zIndex: 2 }}>
                  <Tooltip content={item.badge && item.badge > 0 ? `${item.label} (${item.badge})` : item.label} side="right">
                    <button
                      data-nav-id={item.id}
                      onClick={() => onSelectTab(item.id)}
                      aria-label={item.label}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: isActive ? '#ffffff' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'color 0.15s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#94a3b8';
                      }}
                    >
                      <Icon size={18} color={isActive ? '#818cf8' : '#94a3b8'} />
                      {item.badge && item.badge > 0 ? (
                        <span
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#f59e0b'
                          }}
                        />
                      ) : null}
                    </button>
                  </Tooltip>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                data-nav-id={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: 12.5,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'color 0.15s ease',
                  zIndex: 2
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Icon size={16} color={isActive ? '#818cf8' : '#64748b'} style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      borderRadius: 10,
                      padding: '1px 6px',
                      lineHeight: '14px',
                      flexShrink: 0
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      {!isCollapsed ? (
        <div
          style={{
            padding: 8,
            borderRadius: 6,
            backgroundColor: '#111827',
            border: '1px solid #1f2937',
            marginTop: 8,
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#f3f4f6' }}>Shard Ring</span>
            <span style={{ fontSize: 9.5, color: '#34d399', fontWeight: 800 }}>5 Shards</span>
          </div>
          <p style={{ fontSize: 9.5, color: '#9ca3af', margin: 0 }}>
            Consistent-hashing router.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            paddingTop: 8,
            borderTop: '1px solid #1e293b'
          }}
        >
          <Tooltip content="System Health" side="right">
            <button
              onClick={() => onSelectTab('system-health')}
              aria-label="System Health"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: 'none',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <HelpCircle size={18} />
            </button>
          </Tooltip>

          <Tooltip content="Platform Settings" side="right">
            <button
              data-nav-id="settings"
              onClick={() => onSelectTab('settings')}
              aria-label="Settings"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: 'none',
                backgroundColor: activeTab === 'settings' ? '#3730a3' : 'transparent',
                color: activeTab === 'settings' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'settings') {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'settings') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <Settings size={18} />
            </button>
          </Tooltip>

          <Tooltip content="Platform Super Admin" side="right">
            <div
              onClick={() => onSelectTab('settings')}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid #334155',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Platform Admin"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </Tooltip>
        </div>
      )}

      {/* Draggable Resizable Handle (shadcn UI style) */}
      <ResizableHandle
        onMouseDown={handleStartResize}
        onDoubleClick={handleDoubleClickRail}
        isDragging={isDragging}
        title="Drag right to expand Control Plane • Double-click to expand"
      />
    </aside>
  );
};

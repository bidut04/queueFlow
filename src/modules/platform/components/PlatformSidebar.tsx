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
  PanelLeftOpen,
  Layers3,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import type { PlatformPageId } from '../types/platform';
import { platformStore } from '../services/platformState';
import { Tooltip } from '../../../components/ui/tooltip';
import { ResizableHandle } from '../../../components/ui/resizable';

interface PlatformSidebarProps {
  activeTab: PlatformPageId;
  onSelectTab: (tab: PlatformPageId) => void;
}

const COLLAPSED_WIDTH = 60;
const MIN_EXPANDED_WIDTH = 230;
const MAX_EXPANDED_WIDTH = 380;
const DEFAULT_EXPANDED_WIDTH = 250;

export const PlatformSidebar: React.FC<PlatformSidebarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const [pendingCount, setPendingCount] = useState<number>(() =>
    platformStore.organizations.filter((o) => o.status === 'PENDING').length
  );

  useEffect(() => {
    return platformStore.subscribe(() => {
      setPendingCount(platformStore.organizations.filter((o) => o.status === 'PENDING').length);
    });
  }, []);

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
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= MIN_EXPANDED_WIDTH && parsed <= MAX_EXPANDED_WIDTH) {
          return parsed;
        }
      }
      return DEFAULT_EXPANDED_WIDTH;
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
        padding: isCollapsed ? '12px 4px 10px 4px' : '14px 10px'
      });
      return;
    }

    const aside = asideRef.current;
    gsap.to(aside, {
      width: isCollapsed ? COLLAPSED_WIDTH : sidebarWidth,
      padding: isCollapsed ? '12px 4px 10px 4px' : '14px 10px',
      duration: 0.28,
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
    const left = isCollapsed ? (navRect.width - 38) / 2 : 0;
    const width = isCollapsed ? 38 : targetRect.width;

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
        backgroundColor: '#0f172a',
        borderRight: '1px solid #1e293b',
        borderRadius: 0,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isCollapsed ? '12px 4px 10px 4px' : '14px 10px',
        margin: 0,
        flexShrink: 0,
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        alignSelf: 'stretch',
        position: 'relative',
        userSelect: isDragging ? 'none' : 'auto'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Header Area: Matches Tenant Admin Sidebar */}
        {!isCollapsed ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '2px 6px 14px 6px',
              borderBottom: '1px solid #1e293b',
              marginBottom: 8,
              flexShrink: 0
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={() => onSelectTab('overview')}
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

            <Tooltip content="Collapse sidebar (Ctrl+B)" side="bottom">
              <button
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <PanelLeftClose size={15} />
              </button>
            </Tooltip>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: 6, flexShrink: 0 }}>
            <Tooltip content="Expand sidebar (Ctrl+B)" side="right">
              <button
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand sidebar"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  border: '1px solid #1e293b',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <PanelLeftOpen size={16} />
              </button>
            </Tooltip>

            <div style={{ width: 28, height: 1, backgroundColor: '#1e293b', margin: '8px 0 4px 0' }} />
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
            gap: 4,
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1,
            padding: isCollapsed ? '2px 0' : '0 4px 0 0'
          }}
        >
          {/* GSAP Sliding Indicator: Matches Tenant Admin Brand Blue */}
          <div
            ref={activePillRef}
            className={`qf-nav-sliding-pill ${isCollapsed ? 'collapsed' : ''}`}
            style={{
              backgroundColor: '#2563eb',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.45)',
              opacity: 0
            }}
          />

          {navItems.map((item) => {
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
                        width: 38,
                        height: 38,
                        borderRadius: 8,
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
                      <Icon size={17} />
                      {item.badge && item.badge > 0 ? (
                        <span
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            backgroundColor: '#2563eb',
                            border: '1.5px solid #0f172a'
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
                  padding: '8px 10px',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      padding: '2px 6px',
                      borderRadius: 10,
                      lineHeight: 1
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

      {/* Footer Section: Matches Tenant Admin Sidebar Support Card */}
      {!isCollapsed ? (
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 10,
            padding: '10px 12px',
            border: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <HelpCircle size={13} color="#ffffff" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', margin: 0 }}>
                Need Help?
              </p>
              <p style={{ fontSize: 9.5, color: '#94a3b8', whiteSpace: 'nowrap', margin: 0 }}>
                Contact Support
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Contacting QueueFlow Support: help@queflow.io')}
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
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 7,
            width: '100%',
            paddingTop: 6,
            borderTop: '1px solid #1e293b',
            flexShrink: 0
          }}
        >
          <Tooltip content="Need Help? Contact Support" side="right">
            <button
              onClick={() => alert('Support: help@queflow.io')}
              aria-label="Contact Support"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
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
              <HelpCircle size={16} />
            </button>
          </Tooltip>

          <Tooltip content="Settings" side="right">
            <button
              data-nav-id="settings"
              onClick={() => onSelectTab('settings')}
              aria-label="Settings"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                backgroundColor: activeTab === 'settings' ? '#2563eb' : 'transparent',
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
              <Settings size={16} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Draggable Resizable Handle */}
      <ResizableHandle
        onMouseDown={handleStartResize}
        onDoubleClick={handleDoubleClickRail}
        isDragging={isDragging}
        title="Drag right to expand sidebar • Double-click to toggle"
      />
    </aside>
  );
};

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
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
  GitMerge,
  PanelLeftClose
} from 'lucide-react';
import type { NavPageId, NavItem } from '../../types/navigation';
import { Tooltip } from '../ui/tooltip';
import { ResizableHandle } from '../ui/resizable';

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
      { id: 'org-portal', label: 'Org Admin Portal', iconName: 'org-portal' },
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

const COLLAPSED_WIDTH = 68;
const MIN_EXPANDED_WIDTH = 190;
const MAX_EXPANDED_WIDTH = 380;
const DEFAULT_EXPANDED_WIDTH = 220;

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage }) => {
  // Read persisted sidebar state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('qf_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('qf_sidebar_width');
      return saved ? Math.max(MIN_EXPANDED_WIDTH, Math.min(MAX_EXPANDED_WIDTH, parseInt(saved, 10))) : DEFAULT_EXPANDED_WIDTH;
    } catch {
      return DEFAULT_EXPANDED_WIDTH;
    }
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const [flyoutAnchorRect, setFlyoutAnchorRect] = useState<DOMRect | null>(null);
  const flyoutCloseTimerRef = useRef<number | null>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    master: true,
    association: true
  });

  // DOM Refs for GSAP
  const asideRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const activePillRef = useRef<HTMLDivElement>(null);
  const headerExpandedRef = useRef<HTMLDivElement>(null);
  const headerCollapsedRef = useRef<HTMLDivElement>(null);
  const footerExpandedRef = useRef<HTMLDivElement>(null);
  const footerCollapsedRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Persist collapsed state
  useEffect(() => {
    try {
      localStorage.setItem('qf_sidebar_collapsed', String(isCollapsed));
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  // Persist sidebar width
  useEffect(() => {
    if (!isCollapsed) {
      try {
        localStorage.setItem('qf_sidebar_width', String(sidebarWidth));
      } catch {
        // ignore
      }
    }
  }, [sidebarWidth, isCollapsed]);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };

    const handleCustomToggle = () => {
      setIsCollapsed((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('qf-toggle-sidebar', handleCustomToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('qf-toggle-sidebar', handleCustomToggle);
    };
  }, []);

  // ==========================================
  // GSAP: Sidebar Collapse / Expand Animation
  // ==========================================
  useLayoutEffect(() => {
    if (!asideRef.current) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Set initial styles without animation on first load
      gsap.set(asideRef.current, {
        width: isCollapsed ? COLLAPSED_WIDTH : sidebarWidth,
        margin: isCollapsed ? '10px 0 10px 10px' : '0px',
        borderRadius: isCollapsed ? 28 : 0,
        height: isCollapsed ? 'calc(100vh - 20px)' : '100vh',
        padding: isCollapsed ? '14px 6px 12px 6px' : '14px 10px'
      });
      return;
    }

    const aside = asideRef.current;
    const labels = aside.querySelectorAll<HTMLElement>('.qf-nav-label');
    const chevrons = aside.querySelectorAll<HTMLElement>('.qf-nav-chevron');
    const subLists = aside.querySelectorAll<HTMLElement>('.qf-sub-nav');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (isCollapsed) {
        // Collapsing Animation
        tl.to(labels, {
          opacity: 0,
          x: -12,
          duration: 0.18,
          stagger: 0.01
        }, 0);

        tl.to(chevrons, {
          opacity: 0,
          duration: 0.15
        }, 0);

        tl.to(subLists, {
          height: 0,
          opacity: 0,
          duration: 0.2
        }, 0);

        tl.to(aside, {
          width: COLLAPSED_WIDTH,
          margin: '10px 0 10px 10px',
          borderRadius: 28,
          height: 'calc(100vh - 20px)',
          padding: '14px 6px 12px 6px',
          duration: 0.38,
          ease: 'power3.inOut'
        }, 0.05);

        if (headerExpandedRef.current && headerCollapsedRef.current) {
          tl.to(headerExpandedRef.current, { opacity: 0, scale: 0.9, duration: 0.15, display: 'none' }, 0);
          tl.fromTo(headerCollapsedRef.current, 
            { opacity: 0, scale: 0.75, display: 'flex' },
            { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, 
            0.15
          );
        }

        if (footerExpandedRef.current && footerCollapsedRef.current) {
          tl.to(footerExpandedRef.current, { opacity: 0, duration: 0.15, display: 'none' }, 0);
          tl.fromTo(footerCollapsedRef.current,
            { opacity: 0, scale: 0.85, display: 'flex' },
            { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.5)' },
            0.15
          );
        }
      } else {
        // Expanding Animation
        tl.to(aside, {
          width: sidebarWidth,
          margin: '0px',
          borderRadius: 0,
          height: '100vh',
          padding: '14px 10px',
          duration: 0.38,
          ease: 'power3.inOut'
        }, 0);

        if (headerExpandedRef.current && headerCollapsedRef.current) {
          tl.to(headerCollapsedRef.current, { opacity: 0, scale: 0.8, duration: 0.15, display: 'none' }, 0);
          tl.fromTo(headerExpandedRef.current,
            { opacity: 0, scale: 0.95, display: 'flex' },
            { opacity: 1, scale: 1, duration: 0.25 },
            0.12
          );
        }

        if (footerExpandedRef.current && footerCollapsedRef.current) {
          tl.to(footerCollapsedRef.current, { opacity: 0, duration: 0.15, display: 'none' }, 0);
          tl.fromTo(footerExpandedRef.current,
            { opacity: 0, display: 'flex' },
            { opacity: 1, duration: 0.25 },
            0.15
          );
        }

        tl.fromTo(labels, {
          opacity: 0,
          x: -10
        }, {
          opacity: 1,
          x: 0,
          duration: 0.24,
          stagger: 0.015,
          ease: 'power2.out'
        }, 0.12);

        tl.to(chevrons, {
          opacity: 0.7,
          duration: 0.2
        }, 0.18);

        tl.to(subLists, {
          height: 'auto',
          opacity: 1,
          duration: 0.2
        }, 0.15);
      }
    }, aside);

    return () => ctx.revert();
  }, [isCollapsed]);

  // ==========================================
  // GSAP: Smooth Sliding Indicator Navigation
  // ==========================================
  useLayoutEffect(() => {
    if (!navRef.current || !activePillRef.current) return;

    // Check if active page is a top-level nav item
    const isTopLevel = NAV_ITEMS.some((item) => item.id === activePage);

    let targetEl: HTMLElement | null = null;
    if (isTopLevel) {
      targetEl = navRef.current.querySelector<HTMLElement>(`[data-nav-id="${activePage}"]`);
    } else if (isCollapsed) {
      // In collapsed mode, highlight the parent dock icon
      if (NAV_ITEMS.find((n) => n.id === 'master')?.subItems?.some((s) => s.id === activePage)) {
        targetEl = navRef.current.querySelector<HTMLElement>(`[data-nav-id="master"]`);
      } else if (NAV_ITEMS.find((n) => n.id === 'association')?.subItems?.some((s) => s.id === activePage)) {
        targetEl = navRef.current.querySelector<HTMLElement>(`[data-nav-id="association"]`);
      }
    }

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

    // Smoothly glide the indicator pill to the selected nav item
    gsap.to(activePillRef.current, {
      top,
      left,
      width,
      height,
      opacity: 1,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    // Micro spring-bounce on the active icon
    const iconEl = targetEl.querySelector('.qf-nav-icon');
    if (iconEl) {
      gsap.fromTo(
        iconEl,
        { scale: 0.8 },
        { scale: 1, duration: 0.38, ease: 'back.out(2.2)', overwrite: 'auto' }
      );
    }
  }, [activePage, isCollapsed, openSections]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Drag-to-resize handler
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

  const getNavIcon = (iconName: string, size = 16) => {
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
      case 'org-portal':
        return <Building2 size={size} color="#818cf8" />;
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

  const handleFlyoutEnter = (itemId: string, targetEl?: HTMLElement | null) => {
    if (flyoutCloseTimerRef.current) {
      clearTimeout(flyoutCloseTimerRef.current);
      flyoutCloseTimerRef.current = null;
    }
    if (targetEl) {
      setFlyoutAnchorRect(targetEl.getBoundingClientRect());
    }
    setActiveFlyout(itemId);
  };

  const handleFlyoutLeave = () => {
    flyoutCloseTimerRef.current = window.setTimeout(() => {
      setActiveFlyout(null);
    }, 180);
  };

  return (
    <aside
      ref={asideRef}
      style={{
        width: isCollapsed ? COLLAPSED_WIDTH : sidebarWidth,
        minWidth: isCollapsed ? COLLAPSED_WIDTH : sidebarWidth,
        maxWidth: MAX_EXPANDED_WIDTH,
        backgroundColor: '#0f172a', // Preserves exact present sidebar background color
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isCollapsed ? '14px 6px 12px 6px' : '14px 10px',
        height: isCollapsed ? 'calc(100vh - 20px)' : '100vh',
        margin: isCollapsed ? '10px 0 10px 10px' : '0px',
        borderRadius: isCollapsed ? 28 : 0,
        border: '1px solid #1e293b',
        boxShadow: isCollapsed ? '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.25)' : 'none',
        position: 'sticky',
        top: isCollapsed ? 10 : 0,
        zIndex: 50,
        userSelect: isDragging ? 'none' : 'auto',
        overflow: 'visible'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'visible' }}>
        {/* ==========================================
            HEADER: EXPANDED MODE
        ========================================== */}
        <div
          ref={headerExpandedRef}
          style={{
            display: isCollapsed ? 'none' : 'flex',
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

        {/* ==========================================
            HEADER: COLLAPSED MODE (Top Pill Dock Trigger)
        ========================================== */}
        <div
          ref={headerCollapsedRef}
          style={{
            display: isCollapsed ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginBottom: 6,
            flexShrink: 0
          }}
        >
          <Tooltip content="Expand sidebar (Ctrl+B)" side="right">
            <button
              onClick={() => setIsCollapsed(false)}
              aria-label="Expand sidebar"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: '#2563eb',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Layers3 size={18} color="#ffffff" />
            </button>
          </Tooltip>

          <div
            style={{
              width: 28,
              height: 1,
              backgroundColor: '#1e293b',
              margin: '12px 0 6px 0'
            }}
          />
        </div>

        {/* ==========================================
            NAVIGATION AREA (With GSAP Sliding Indicator)
        ========================================== */}
        <nav
          ref={navRef}
          className="qf-sidebar-nav"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isCollapsed ? 'center' : 'stretch',
            gap: isCollapsed ? 6 : 2,
            flex: 1,
            overflowY: 'auto',
            padding: isCollapsed ? '4px 0' : '0'
          }}
        >
          {/* GSAP Active Sliding Indicator Pill */}
          <div
            ref={activePillRef}
            className={`qf-nav-sliding-pill ${isCollapsed ? 'collapsed' : ''}`}
            style={{ opacity: 0 }}
          />

          {NAV_ITEMS.filter((item) => (isCollapsed ? item.id !== 'settings' : true)).map((item) => {
            const hasSub = !!item.subItems;
            const isChildActive = hasSub && item.subItems?.some((sub) => sub.id === activePage);
            const isActive = activePage === item.id || isChildActive;
            const isOpen = !!openSections[item.id];

            if (isCollapsed) {
              // Collapsed item (pill dock icon button matching image)
              return (
                <div
                  key={item.id}
                  style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', zIndex: 2 }}
                  onMouseEnter={(e) => hasSub && handleFlyoutEnter(item.id, e.currentTarget)}
                  onMouseLeave={() => hasSub && handleFlyoutLeave()}
                >
                  <Tooltip content={item.label} side="right" disabled={hasSub && activeFlyout === item.id}>
                    <button
                      data-nav-id={item.id}
                      onClick={(e) => {
                        if (hasSub) {
                          if (activeFlyout === item.id) {
                            setActiveFlyout(null);
                          } else {
                            handleFlyoutEnter(item.id, e.currentTarget);
                          }
                        } else {
                          onSelectPage(item.id as NavPageId);
                        }
                      }}
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
                        transition: 'color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#94a3b8';
                      }}
                    >
                      <span className="qf-nav-icon" style={{ display: 'inline-flex' }}>
                        {getNavIcon(item.iconName, 18)}
                      </span>
                    </button>
                  </Tooltip>

                  {/* Portaled Flyout submenu for Master and Association */}
                  {hasSub && activeFlyout === item.id && flyoutAnchorRect && typeof document !== 'undefined' &&
                    createPortal(
                      <div
                        onMouseEnter={() => handleFlyoutEnter(item.id)}
                        onMouseLeave={handleFlyoutLeave}
                        style={{
                          position: 'fixed',
                          left: flyoutAnchorRect.right + 10,
                          top: Math.max(12, Math.min(flyoutAnchorRect.top - 6, window.innerHeight - 380)),
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: 12,
                          padding: 6,
                          minWidth: 190,
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)',
                          zIndex: 99998,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          animation: 'qfTooltipEnter 0.14s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        }}
                      >
                        <div style={{ padding: '4px 8px 6px 8px', borderBottom: '1px solid #1e293b', marginBottom: 2 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {item.label}
                          </span>
                        </div>
                        {item.subItems?.map((sub) => {
                          const isSubActive = activePage === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                onSelectPage(sub.id);
                                setActiveFlyout(null);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                                padding: '6px 9px',
                                borderRadius: 6,
                                border: 'none',
                                backgroundColor: isSubActive ? '#2563eb' : 'transparent',
                                color: isSubActive ? '#ffffff' : '#cbd5e1',
                                fontSize: 11.5,
                                fontWeight: isSubActive ? 700 : 500,
                                cursor: 'pointer',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.12s ease',
                                boxShadow: isSubActive ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) e.currentTarget.style.backgroundColor = '#1e293b';
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ display: 'inline-flex', color: isSubActive ? '#ffffff' : '#94a3b8' }}>
                                  {getNavIcon(sub.iconName || sub.id, 14)}
                                </span>
                                <span>{sub.label}</span>
                              </div>
                              {isSubActive && (
                                <span
                                  style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    backgroundColor: '#ffffff',
                                    flexShrink: 0
                                  }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>,
                      document.body
                    )}
                </div>
              );
            }

            // Expanded view item
            if (hasSub) {
              return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, zIndex: 2 }}>
                  <button
                    data-nav-id={item.id}
                    onClick={() => toggleSection(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 8,
                      border: 'none',
                      backgroundColor: isChildActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span className="qf-nav-icon" style={{ display: 'inline-flex', color: isChildActive ? '#60a5fa' : 'inherit' }}>
                        {getNavIcon(item.iconName)}
                      </span>
                      <span className="qf-nav-label" style={{ color: isChildActive ? '#ffffff' : 'inherit' }}>
                        {item.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isChildActive && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6',
                            boxShadow: '0 0 6px #3b82f6'
                          }}
                        />
                      )}
                      <ChevronDown
                        className="qf-nav-chevron"
                        size={13}
                        style={{
                          transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                          transition: 'transform 0.2s ease',
                          opacity: isChildActive ? 1 : 0.7,
                          color: isChildActive ? '#93c5fd' : 'inherit'
                        }}
                      />
                    </div>
                  </button>

                  <div
                    className="qf-sub-nav-wrapper"
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease',
                      opacity: isOpen ? 1 : 0,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ minHeight: 0 }}>
                      <div
                        className="qf-sub-nav"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          paddingLeft: 8,
                          borderLeft: '1.5px solid #334155',
                          marginLeft: 15,
                          marginTop: 3,
                          marginBottom: 4,
                          position: 'relative'
                        }}
                      >
                        {item.subItems?.map((sub) => {
                          const isSubActive = activePage === sub.id;
                          return (
                            <button
                              key={sub.id}
                              data-nav-id={sub.id}
                              onClick={() => onSelectPage(sub.id)}
                              style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 7,
                                width: '100%',
                                padding: '6px 9px',
                                borderRadius: 6,
                                border: 'none',
                                backgroundColor: isSubActive ? '#2563eb' : 'transparent',
                                color: isSubActive ? '#ffffff' : '#94a3b8',
                                fontSize: 11.5,
                                fontWeight: isSubActive ? 700 : 500,
                                cursor: 'pointer',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                transform: isSubActive ? 'none' : 'translateX(0)',
                                boxShadow: isSubActive ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                                  e.currentTarget.style.color = '#ffffff';
                                  e.currentTarget.style.transform = 'translateX(2px)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#94a3b8';
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }
                              }}
                            >
                              {/* Connector line to the left border */}
                              {isSubActive && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: -9.5,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 8,
                                    height: 2,
                                    backgroundColor: '#60a5fa',
                                    borderRadius: 1,
                                    boxShadow: '0 0 6px rgba(96, 165, 250, 0.8)',
                                    transition: 'all 0.2s ease'
                                  }}
                                />
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                                <span
                                  className="qf-nav-icon"
                                  style={{
                                    display: 'inline-flex',
                                    flexShrink: 0,
                                    color: isSubActive ? '#ffffff' : '#64748b',
                                    transition: 'color 0.18s ease'
                                  }}
                                >
                                  {getNavIcon(sub.iconName || sub.id, 13)}
                                </span>
                                <span
                                  className="qf-nav-label"
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: isSubActive ? '#ffffff' : '#cbd5e1',
                                    transition: 'color 0.18s ease'
                                  }}
                                >
                                  {sub.label}
                                </span>
                              </div>
                              {isSubActive && (
                                <span
                                  style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    backgroundColor: '#ffffff',
                                    flexShrink: 0,
                                    boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                                    transition: 'all 0.2s ease'
                                  }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                data-nav-id={item.id}
                onClick={() => onSelectPage(item.id as NavPageId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 9,
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
                  if (!isActive) e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <span className="qf-nav-icon" style={{ display: 'inline-flex' }}>
                  {getNavIcon(item.iconName)}
                </span>
                <span className="qf-nav-label" style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ==========================================
          FOOTER: EXPANDED MODE (Need Help Card)
      ========================================== */}
      <div
        ref={footerExpandedRef}
        style={{
          display: isCollapsed ? 'none' : 'flex',
          backgroundColor: '#1e293b',
          borderRadius: 10,
          padding: '10px 12px',
          border: '1px solid #334155',
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

      {/* ==========================================
          FOOTER: COLLAPSED MODE (Matching the image)
      ========================================== */}
      <div
        ref={footerCollapsedRef}
        style={{
          display: isCollapsed ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          paddingTop: 8,
          borderTop: '1px solid #1e293b',
          flexShrink: 0
        }}
      >
        {/* Support Icon */}
        <Tooltip content="Need Help? Contact Support" side="right">
          <button
            onClick={() => alert('Support: help@queflow.io')}
            aria-label="Contact Support"
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

        {/* Settings Icon */}
        <Tooltip content="Settings" side="right">
          <button
            data-nav-id="settings"
            onClick={() => onSelectPage('settings')}
            aria-label="Settings"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: 'none',
              backgroundColor: activePage === 'settings' ? '#2563eb' : 'transparent',
              color: activePage === 'settings' ? '#ffffff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (activePage !== 'settings') {
                e.currentTarget.style.backgroundColor = '#1e293b';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (activePage !== 'settings') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            <Settings size={18} />
          </button>
        </Tooltip>

        {/* Circular User Avatar Profile Photo (Just like in the image) */}
        <Tooltip content="Rahul Admin • Super Admin" side="right">
          <div
            onClick={() => onSelectPage('settings')}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '2px solid #334155',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.15s ease, border-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.borderColor = '#60a5fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = '#334155';
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="User Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </Tooltip>
      </div>

      {/* Draggable Resizable Handle (shadcn UI style) */}
      <ResizableHandle
        onMouseDown={handleStartResize}
        onDoubleClick={handleDoubleClickRail}
        isDragging={isDragging}
      />
    </aside>
  );
};

import React from 'react';
import { Home, Briefcase, Building, Calendar } from 'lucide-react';

export type MobileBottomNavTab = 'home' | 'services' | 'branches' | 'bookings';

export interface MobileQueueBottomNavProps {
  activeTab: MobileBottomNavTab;
  onChangeTab: (tab: MobileBottomNavTab) => void;
  hasActiveAppointment?: boolean;
  hasActiveLiveToken?: boolean;
}

export const MobileQueueBottomNav: React.FC<MobileQueueBottomNavProps> = ({
  activeTab,
  onChangeTab,
  hasActiveAppointment = false,
  hasActiveLiveToken = false,
}) => {
  const navItems: Array<{
    id: MobileBottomNavTab;
    label: string;
    icon: typeof Home;
    badge?: boolean;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'branches', label: 'Branches', icon: Building },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      badge: hasActiveAppointment || hasActiveLiveToken,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden w-auto max-w-[calc(100vw-20px)] select-none pointer-events-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Pill Capsule Container */}
      <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.18),0_4px_12px_-2px_rgba(0,0,0,0.06)] transition-all">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`relative flex items-center justify-center gap-1.5 rounded-full cursor-pointer transition-all duration-200 text-xs sm:text-sm font-semibold ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/25 px-3.5 sm:px-5 py-2 sm:py-2.5 font-bold'
                  : 'text-slate-800 hover:text-black px-2.5 sm:px-3.5 py-2 hover:bg-slate-100/60'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
              <span className={isActive ? 'inline' : 'inline'}>{item.label}</span>

              {item.badge && !isActive && (
                <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white absolute top-1.5 right-1.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React from 'react';
import {
  X,
  Home,
  Briefcase,
  Building,
  HelpCircle,
  Calendar,
  LogOut,
  LogIn,
  ChevronRight,
  Globe,
} from 'lucide-react';
import type { BookingFlowStep } from '../types/queuePortal.types';

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: BookingFlowStep;
  onNavigateStep?: (step: BookingFlowStep) => void;
  onOpenHowItWorks?: () => void;
  onOpenBookings: () => void;
  isAuthenticated: boolean;
  displayName: string;
  displayEmail: string;
  userAvatar: string;
  onLogout: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  currentStep,
  onNavigateStep,
  onOpenHowItWorks,
  onOpenBookings,
  isAuthenticated,
  displayName,
  displayEmail,
  userAvatar,
  onLogout,
}) => {
  if (!isOpen) return null;

  const handleNav = (step: BookingFlowStep) => {
    onNavigateStep?.(step);
    onClose();
  };

  const navItems = [
    { id: 'home' as BookingFlowStep, label: 'Home', icon: Home, desc: 'QueueFlow main page' },
    { id: 'select-org' as BookingFlowStep, label: 'Services', icon: Briefcase, desc: 'Browse organizations & services' },
    { id: 'select-branch' as BookingFlowStep, label: 'Branches', icon: Building, desc: 'Find nearby branch counters' },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              Q
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900">QueueFlow Navigation</span>
              <p className="text-[10px] text-slate-400">Smart Queue & Booking Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card if Authenticated */}
        {isAuthenticated ? (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={userAvatar}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-500 truncate">{displayEmail}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => (window.location.href = '/login')}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm mb-3 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </button>
        )}

        {/* Navigation Links */}
        <div className="space-y-1 mb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentStep === item.id ||
              (item.id === 'select-org' && (currentStep === 'select-service' || currentStep === 'select-org')) ||
              (item.id === 'select-branch' && currentStep === 'branch-details');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}

          {/* How It Works Action */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenHowItWorks?.();
            }}
            className="w-full text-left p-3 rounded-2xl flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block">How It Works</span>
                <span className="text-[10px] text-slate-400 block">3-step queue booking guide</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Quick Action: My Booked Slots */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenBookings();
          }}
          className="w-full p-3 rounded-2xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 border border-blue-100 mb-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>View My Booked Slots & Live Queue</span>
        </button>

        {/* Language Indicator */}
        <div className="flex items-center justify-center gap-1.5 py-2 text-slate-400 text-[11px] font-medium border-t border-slate-100">
          <Globe className="w-3.5 h-3.5" />
          <span>Language: English (US)</span>
        </div>
      </div>
    </div>
  );
};

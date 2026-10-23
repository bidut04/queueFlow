import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  ChevronDown,
  LogOut,
  LogIn,
  X,
  Navigation,
  RefreshCw,
  Check,
  Globe,
  Search,
  Menu,
} from 'lucide-react';
import type { LocationArea, UserProfileInfo, BookingFlowStep } from '../types/queuePortal.types';
import { authApi } from '../../../api/auth.api';
import { MobileNavDrawer } from './MobileNavDrawer';

export interface QueuePortalNavbarProps {
  currentLocation: string;
  isLocating?: boolean;
  locations: LocationArea[];
  onSelectLocation: (locLabel: string) => void;
  onDetectLocation?: () => void;
  userProfile: UserProfileInfo;
  onOpenBookings: () => void;
  currentStep?: BookingFlowStep;
  onNavigateStep?: (step: BookingFlowStep) => void;
  onOpenHowItWorks?: () => void;
}

export const QueuePortalNavbar: React.FC<QueuePortalNavbarProps> = ({
  currentLocation,
  isLocating = false,
  locations,
  onSelectLocation,
  onDetectLocation,
  userProfile,
  onOpenBookings,
  currentStep = 'home',
  onNavigateStep,
  onOpenHowItWorks,
}) => {
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState('');

  const locationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = authApi.isAuthenticated();
  const currentUser = authApi.getCurrentUser();
  const displayName = currentUser?.email?.split('@')[0] || userProfile.name || 'User';
  const displayEmail = currentUser?.email || 'user@queflow.com';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = '/login';
  };

  const filteredLocations = locations.filter((loc) =>
    loc.label.toLowerCase().includes(locationSearchInput.toLowerCase().trim())
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-2.5 sm:px-4 lg:px-6 h-12 sm:h-13 flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          {/* Left: Brand Logo & Food Delivery Style Location Pill */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              onClick={() => onNavigateStep?.('home')}
              className="flex items-center gap-1.5 cursor-pointer select-none shrink-0"
              title="QueueFlow Home"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shadow-blue-500/30 shrink-0 font-black">
                Q
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 hidden sm:inline">
                QueueFlow
              </span>
            </div>

            {/* Location Selector Pill */}
            <div className="relative min-w-0" ref={locationRef}>
              <button
                type="button"
                onClick={() => setIsLocationMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-slate-200 bg-slate-50/80 hover:bg-white text-slate-800 text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all shadow-2xs hover:border-blue-300 min-w-0 max-w-[130px] sm:max-w-[190px] group"
                title="Change location or use GPS"
              >
                <div className="relative flex items-center justify-center shrink-0">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                  {isLocating && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                  )}
                </div>
                <span className="truncate block">{isLocating ? 'Detecting...' : currentLocation}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 group-hover:text-slate-700 transition-colors" />
              </button>

              {/* Location Dropdown */}
              {isLocationMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-[280px] max-w-[90vw] bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Select Your Area
                    </span>
                    {isLocating && (
                      <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        Locating...
                      </span>
                    )}
                  </div>

                  {onDetectLocation && (
                    <div className="p-2 border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          onDetectLocation();
                          setIsLocationMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-blue-50/70 hover:bg-blue-100/80 text-blue-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="block leading-tight">Use Current GPS Location</span>
                          <span className="block text-[10px] text-blue-500 font-normal leading-tight">Auto-detect</span>
                        </div>
                      </button>
                    </div>
                  )}

                  <div className="p-2 border-b border-slate-100">
                    <div className="relative flex items-center">
                      <Search className="w-3 h-3 text-slate-400 absolute left-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={locationSearchInput}
                        onChange={(e) => setLocationSearchInput(e.target.value)}
                        placeholder="Search area..."
                        className="w-full pl-7 pr-2.5 py-1 text-[11px] bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:border-blue-500"
                      />
                      {locationSearchInput && (
                        <button type="button" onClick={() => setLocationSearchInput('')} className="absolute right-2 text-slate-400 hover:text-slate-600">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto py-1">
                    {filteredLocations.map((loc) => {
                      const isSelected = loc.label === currentLocation;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => {
                            onSelectLocation(loc.label);
                            setIsLocationMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            isSelected ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <MapPin className={`w-3 h-3 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="truncate">{loc.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Navigation Links matching Mockup 1 (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              type="button"
              onClick={() => onNavigateStep?.('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentStep === 'home'
                  ? 'text-blue-600 bg-blue-50/70 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => onNavigateStep?.('select-org')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentStep === 'select-org' || currentStep === 'select-service'
                  ? 'text-blue-600 bg-blue-50/70 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Services
            </button>

            <button
              type="button"
              onClick={() => onNavigateStep?.('select-branch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentStep === 'select-branch' || currentStep === 'branch-details'
                  ? 'text-blue-600 bg-blue-50/70 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Branches
            </button>

            <button
              type="button"
              onClick={() => onOpenHowItWorks?.()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Right: Language, My Bookings, User Account & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language selector */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 border border-slate-200 bg-slate-50/60">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>English</span>
            </div>

            {/* My Bookings button */}
            <button
              type="button"
              onClick={onOpenBookings}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/40 text-slate-700 hover:text-blue-700 text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all shadow-2xs"
              title="View Active Tickets"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden xs:inline">My Bookings</span>
            </button>

            {/* User Profile on Desktop */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 p-0.5 sm:px-1.5 sm:py-0.5 rounded-full sm:rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <img
                    src={userProfile.avatarUrl}
                    alt={displayName}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-blue-500/30"
                  />
                  <span className="hidden md:inline text-xs font-semibold text-slate-700 max-w-[80px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{displayEmail}</p>
                      <span className="inline-block text-[9px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded mt-0.5">
                        Customer Account
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenBookings();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>My Booked Slots</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => (window.location.href = '/login')}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
              >
                <LogIn className="w-3 h-3" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer shadow-2xs"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentStep={currentStep}
        onNavigateStep={onNavigateStep}
        onOpenHowItWorks={onOpenHowItWorks}
        onOpenBookings={onOpenBookings}
        isAuthenticated={isAuthenticated}
        displayName={displayName}
        displayEmail={displayEmail}
        userAvatar={userProfile.avatarUrl}
        onLogout={handleLogout}
      />
    </>
  );
};

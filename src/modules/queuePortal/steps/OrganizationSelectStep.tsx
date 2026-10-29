import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  Building2,
  Landmark,
  Hospital,
  Mail,
  HeartPulse,
  Briefcase,
  ChevronRight,
  ChevronDown,
  MapPin,
  Loader2,
  Sparkles,
  SlidersHorizontal,
  Navigation,
  Lightbulb,
} from 'lucide-react';
import type {
  TenantItem,
  OrganizationCategoryFilter,
  OrganizationDistanceFilter,
  NearbyStats,
} from '../types/queuePortal.types';
import { MOCK_TENANTS } from '../data/queuePortalMockData';

export interface OrganizationSelectStepProps {
  tenants?: TenantItem[];
  isLoading?: boolean;
  currentLocationText?: string;
  onSelectTenant: (tenant: TenantItem) => void;
  onBack: () => void;
  onSelectLocation?: (locationName: string) => void;
}

interface CategoryOption {
  id: OrganizationCategoryFilter;
  label: string;
}

interface DistanceOption {
  id: OrganizationDistanceFilter;
  label: string;
  maxKm?: number;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'bank', label: 'Banks & Financial' },
  { id: 'government', label: 'Government Offices' },
  { id: 'clinic', label: 'Hospitals & Clinics' },
  { id: 'mail', label: 'Postal Services' },
];

const DISTANCE_OPTIONS: DistanceOption[] = [
  { id: 'all', label: 'Any Distance' },
  { id: '5', label: '< 5 km', maxKm: 5 },
  { id: '10', label: '< 10 km', maxKm: 10 },
  { id: '15', label: '< 15 km', maxKm: 15 },
];

const DEFAULT_BANK_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80',
];

export const OrganizationSelectStep: React.FC<OrganizationSelectStepProps> = ({
  tenants = [],
  isLoading = false,
  currentLocationText = 'Kolkata, West Bengal',
  onSelectTenant,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<OrganizationCategoryFilter>('all');
  const [selectedDistance, setSelectedDistance] = useState<OrganizationDistanceFilter>('all');
  const [sortByNearby, setSortByNearby] = useState<boolean>(true);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState<boolean>(false);
  const [isDistanceMenuOpen, setIsDistanceMenuOpen] = useState<boolean>(false);

  // If no tenants passed or backend list is empty, seamlessly use curated MOCK_TENANTS
  const baseTenants: TenantItem[] = useMemo(() => {
    if (tenants && tenants.length > 0) {
      return tenants;
    }
    return MOCK_TENANTS;
  }, [tenants]);

  const getTenantIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('bank') || lower.includes('financial')) return Landmark;
    if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('health') || lower.includes('diagnostic')) return Hospital;
    if (lower.includes('post') || lower.includes('mail')) return Mail;
    if (lower.includes('rural')) return HeartPulse;
    if (lower.includes('land') || lower.includes('government') || lower.includes('municipal')) return Building2;
    return Briefcase;
  };

  const getTenantImage = (tenant: TenantItem, index: number): string => {
    if (tenant.imageUrl) return tenant.imageUrl;
    return DEFAULT_BANK_IMAGES[index % DEFAULT_BANK_IMAGES.length];
  };

  const filteredTenants = useMemo(() => {
    let list = baseTenants.filter((t) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesType = t.type.toLowerCase().includes(q);
        const matchesLoc = t.locality ? t.locality.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesType && !matchesLoc) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        const lowerType = t.type.toLowerCase();
        if (selectedCategory === 'bank' && !lowerType.includes('bank') && !lowerType.includes('financial')) return false;
        if (selectedCategory === 'government' && !lowerType.includes('government') && !lowerType.includes('land') && !lowerType.includes('municipal')) return false;
        if (selectedCategory === 'clinic' && !lowerType.includes('hospital') && !lowerType.includes('clinic') && !lowerType.includes('diagnostic') && !lowerType.includes('health')) return false;
        if (selectedCategory === 'mail' && !lowerType.includes('post') && !lowerType.includes('mail')) return false;
      }

      // 3. Distance filter
      if (selectedDistance !== 'all') {
        const option = DISTANCE_OPTIONS.find((d) => d.id === selectedDistance);
        if (option && option.maxKm !== undefined && (t.distanceKm ?? 99) > option.maxKm) {
          return false;
        }
      }

      return true;
    });

    if (sortByNearby) {
      list = [...list].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    }

    return list;
  }, [baseTenants, searchQuery, selectedCategory, selectedDistance, sortByNearby]);

  const stats: NearbyStats = useMemo(() => {
    return {
      banksCount: 12,
      governmentCount: 5,
      serviceCentersCount: 3,
    };
  }, []);

  const activeCategoryLabel = useMemo(() => {
    const opt = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory);
    return opt ? opt.label : 'All Categories';
  }, [selectedCategory]);

  const activeDistanceLabel = useMemo(() => {
    const opt = DISTANCE_OPTIONS.find((d) => d.id === selectedDistance);
    return opt ? opt.label : 'Distance';
  }, [selectedDistance]);

  return (
    <div className="w-full max-w-[1540px] mx-auto py-2 sm:py-4 px-2.5 sm:px-6 lg:px-8 min-w-0">
      {/* 1. Top Back Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 mb-2 sm:mb-4 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to home</span>
      </button>

      {/* 2. Hero Section: Left Header Text & Right Modern Vector Illustration */}
      <section className="relative w-full rounded-3xl bg-gradient-to-b from-blue-50/40 via-white to-transparent p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-slate-100/80 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Hero Title & Location Info */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2444] tracking-tight leading-[1.15] mb-3">
              Which organization do you{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                want to visit?
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium max-w-xl mb-4 sm:mb-5 leading-relaxed">
              Select your organization to see available services, location, distance and more.
            </p>

            {/* Showing nearby location badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-100/90 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-100/80 transition-colors cursor-pointer select-none">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                Showing nearby organizations near:{' '}
                <strong className="text-blue-900 font-bold">{currentLocationText}</strong>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </div>
          </div>

          {/* Right Hero Illustration with "Local Services Closer to You" badge */}
          <div className="lg:col-span-5 xl:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px]">
              {/* Handwritten note & arrow annotation */}
              <div className="absolute top-1 right-2 sm:top-2 sm:right-6 flex flex-col items-center select-none pointer-events-none z-20">
                <span className="text-xs sm:text-sm font-extrabold text-blue-600 font-serif italic tracking-wide rotate-[-6deg] drop-shadow-xs text-center leading-tight">
                  Local Services<br />Closer to You
                </span>
                <svg
                  className="w-7 h-7 text-blue-500 -rotate-12 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 9l6 6-6 6" />
                  <path d="M4 4v7a4 4 0 0 0 4 4h11" />
                </svg>
              </div>

              {/* High-res Hero Illustration Scene */}
              <div className="relative w-full h-48 sm:h-56 lg:h-64 rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-100/60 to-purple-50 flex items-center justify-center">
                <img
                  src="/images/org_hero_visit.jpg"
                  alt="Local Services Closer to You - Person visiting modern bank building"
                  className="w-full h-full object-cover object-center select-none"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to high quality architectural imagery if local image path fails
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search & Interactive Filter Bar matching Image 1 */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        {/* Left: Search input */}
        <div className="relative flex-1 w-full max-w-2xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organization or service category..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all"
          />
        </div>

        {/* Right: Filters & Nearby First Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsCategoryMenuOpen((prev) => !prev);
                setIsDistanceMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeCategoryLabel}</span>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCategoryMenuOpen ? 'rotate-90' : ''}`} />
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Distance Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDistanceMenuOpen((prev) => !prev);
                setIsCategoryMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeDistanceLabel}</span>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDistanceMenuOpen ? 'rotate-90' : ''}`} />
            </button>

            {isDistanceMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                {DISTANCE_OPTIONS.map((dist) => (
                  <button
                    key={dist.id}
                    type="button"
                    onClick={() => {
                      setSelectedDistance(dist.id);
                      setIsDistanceMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      selectedDistance === dist.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{dist.label}</span>
                    {selectedDistance === dist.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nearby First Gradient Button */}
          <button
            type="button"
            onClick={() => setSortByNearby((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
              sortByNearby
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/25 hover:opacity-95 hover:scale-[1.02]'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Nearby First</span>
          </button>
        </div>
      </section>

      {/* 4. Main Body: Organization Cards Grid (3 Columns) + Right Sidebar Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: 3-column Card Grid */}
        <div className="lg:col-span-8 xl:col-span-9 min-w-0">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
              <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-600">Loading organizations...</p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-2xs">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No organizations found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
                We couldn't find any organizations matching your filter criteria. Try adjusting your search query or reset your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDistance('all');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredTenants.map((tenant, idx) => {
                const IconComp = getTenantIcon(tenant.type);
                const imageUrl = getTenantImage(tenant, idx);
                const isPopular = tenant.isPopular || idx === 0;

                return (
                  <div
                    key={tenant.id}
                    onClick={() => onSelectTenant(tenant)}
                    className="group relative bg-white rounded-[22px] border border-slate-200/80 hover:border-blue-500/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    {/* Top Image Section */}
                    <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-100">
                      <img
                        src={imageUrl}
                        alt={tenant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = DEFAULT_BANK_IMAGES[idx % DEFAULT_BANK_IMAGES.length];
                        }}
                      />

                      {/* Top-Left Floating Icon Badge */}
                      <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-xs text-blue-600 flex items-center justify-center shadow-md">
                        <IconComp className="w-5 h-5" />
                      </div>

                      {/* Top-Right Distance Pill Badge */}
                      {tenant.distanceKm !== undefined && (
                        <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50/95 backdrop-blur-xs text-emerald-700 text-[11px] font-bold border border-emerald-200/80 shadow-xs">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{tenant.distanceKm} km away</span>
                        </div>
                      )}

                      {/* Bottom-Left Popular Badge (if popular) */}
                      {isPopular && (
                        <div className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-[10px] font-extrabold shadow-md">
                          <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                          <span>Popular</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-0.5 truncate">
                          {tenant.name}
                        </h3>

                        {/* Category Label */}
                        <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                          {tenant.type}
                        </p>

                        {/* Location */}
                        {tenant.locality && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{tenant.locality}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Row: Branch Count & View Services Button */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>
                            {tenant.branchesCount ?? 0} branch{(tenant.branchesCount ?? 0) === 1 ? '' : 'es'}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white text-xs font-bold transition-all shadow-2xs">
                          <span>View Services</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Mini-map + Quick Stats + Need help */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4 sm:space-y-5">
          {/* Card 1: Nearby Organizations Mini Map Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 leading-tight">Nearby Organizations</h4>
                <p className="text-[11px] text-slate-500 font-medium">Find the nearest service center around you</p>
              </div>
            </div>

            {/* Stylized Vector Map Preview */}
            <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-[#e8f1f5] border border-slate-200/90 select-none shadow-inner">
              {/* Simulated Map Streets & Waterway */}
              <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 300 200" fill="none">
                {/* River water body */}
                <path
                  d="M-20 60 C 60 40, 100 120, 180 90 C 230 70, 260 140, 320 120 L 320 220 L -20 220 Z"
                  fill="#c7e3f2"
                />
                {/* Green park patches */}
                <path d="M 20 20 Q 60 10 70 50 Q 50 80 15 60 Z" fill="#d4edda" />
                <path d="M 220 30 Q 280 20 270 70 Q 230 80 210 50 Z" fill="#d4edda" />
                <path d="M 200 130 Q 250 120 270 170 Q 220 190 190 160 Z" fill="#d4edda" />
                {/* Primary road network */}
                <path d="M -10 110 L 310 70" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
                <path d="M 120 -10 L 150 210" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
                <path d="M 40 180 Q 140 130 260 180" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                <path d="M 210 -10 L 250 210" stroke="#fefefe" strokeWidth="5" />
              </svg>

              {/* Center Radar Pulsing Circle & Purple Location Marker */}
              <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <span className="absolute w-20 h-20 rounded-full bg-indigo-500/15 animate-ping" />
                <span className="absolute w-12 h-12 rounded-full bg-indigo-500/25" />
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white z-10">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>

              {/* Floating Tooltip Card over Map Center */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-slate-200/80 flex items-center gap-1.5 z-20 whitespace-nowrap">
                <Landmark className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">Aranya Bank</span>
                <span className="text-[10px] text-slate-400 font-semibold">• 3 km</span>
              </div>

              {/* Nearby Secondary Pins */}
              <div className="absolute top-[28%] left-[24%] text-blue-600 drop-shadow-xs">
                <MapPin className="w-4 h-4 fill-blue-600 text-white" />
              </div>
              <div className="absolute top-[68%] left-[78%] text-blue-600 drop-shadow-xs">
                <MapPin className="w-4 h-4 fill-blue-600 text-white" />
              </div>
              <div className="absolute top-[22%] left-[82%] text-blue-600 drop-shadow-xs">
                <MapPin className="w-4 h-4 fill-blue-600 text-white" />
              </div>
              <div className="absolute top-[75%] left-[32%] text-blue-600 drop-shadow-xs">
                <MapPin className="w-4 h-4 fill-blue-600 text-white" />
              </div>

              {/* Bottom Right Floating Compass / Navigation Action */}
              <button
                type="button"
                className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white text-slate-700 hover:text-blue-600 shadow-md flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"
                title="Center on user location"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Quick Stats Widget */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white rounded-3xl border border-indigo-100/80 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.06)]">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-tight">Quick Stats</h4>
                <p className="text-[11px] text-slate-500 font-medium">Nearby organizations</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-indigo-100/70 text-center">
              <div className="p-1.5">
                <span className="block text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {stats.banksCount}
                </span>
                <span className="block text-[11px] font-semibold text-slate-500 mt-0.5">
                  Banks
                </span>
              </div>

              <div className="p-1.5 border-x border-indigo-100/70">
                <span className="block text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {stats.governmentCount}
                </span>
                <span className="block text-[11px] font-semibold text-slate-500 mt-0.5 leading-tight">
                  Government Offices
                </span>
              </div>

              <div className="p-1.5">
                <span className="block text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {stats.serviceCentersCount}
                </span>
                <span className="block text-[11px] font-semibold text-slate-500 mt-0.5 leading-tight">
                  Service Centers
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Need Help Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-blue-400 transition-colors cursor-pointer group flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
              <Lightbulb className="w-4.5 h-4.5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Need help?
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Use filters to find the right service or choose "Nearby First" to see closest options.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

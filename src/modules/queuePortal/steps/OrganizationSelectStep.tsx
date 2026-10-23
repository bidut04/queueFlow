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
  MapPin,
  Loader2,
} from 'lucide-react';
import type { TenantItem } from '../types/queuePortal.types';

interface OrganizationSelectStepProps {
  tenants?: TenantItem[];
  isLoading?: boolean;
  currentLocationText?: string;
  onSelectTenant: (tenant: TenantItem) => void;
  onBack: () => void;
}

export const OrganizationSelectStep: React.FC<OrganizationSelectStepProps> = ({
  tenants = [],
  isLoading = false,
  currentLocationText = 'Current Location',
  onSelectTenant,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByNearby, setSortByNearby] = useState(true);

  const getTenantIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('bank') || lower.includes('financial')) return Landmark;
    if (lower.includes('hospital') || lower.includes('health')) return Hospital;
    if (lower.includes('post') || lower.includes('mail')) return Mail;
    if (lower.includes('rural') || lower.includes('clinic')) return HeartPulse;
    if (lower.includes('land') || lower.includes('government')) return Building2;
    return Briefcase;
  };

  const filteredTenants = useMemo(() => {
    let list = tenants.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.locality && t.locality.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (sortByNearby) {
      list = [...list].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    }
    return list;
  }, [tenants, searchQuery, sortByNearby]);

  return (
    <div className="w-full max-w-7xl mx-auto py-3 sm:py-6 px-3 sm:px-6 min-w-0">
      {/* Top Back Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to home</span>
      </button>

      {/* Header Title & Subtitle */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0e2142] tracking-tight mb-2">
          Which organization do you want to visit?
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          Select your organization to see available services.
        </p>

        {/* Location Indicator & Proximity Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mt-3">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Showing nearby organizations near: {currentLocationText}</span>
        </div>
      </div>

      {/* Search Input Bar with Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organization or service category..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setSortByNearby(!sortByNearby)}
          className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            sortByNearby
              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Nearby First</span>
        </button>
      </div>

      {/* Grid of Organization Cards */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading organizations from database API...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTenants.map((tenant) => {
          const IconComp = getTenantIcon(tenant.type);
          return (
            <div
              key={tenant.id}
              onClick={() => onSelectTenant(tenant)}
              className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                    <IconComp className="w-6 h-6" />
                  </div>

                  {tenant.distanceKm !== undefined && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-100">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{tenant.distanceKm} km away</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-1">
                  {tenant.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-2">
                  {tenant.type}
                </p>
                {tenant.locality && (
                  <p className="text-xs text-slate-500 truncate mb-1">
                    {tenant.locality}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  {tenant.branchesCount ?? 1} branch{(tenant.branchesCount ?? 1) > 1 ? 'es' : ''}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white text-xs font-bold transition-all shadow-2xs">
                  <span>View Services</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {!isLoading && filteredTenants.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 mt-2">
          <p className="text-xs font-semibold text-slate-600">No organizations found matching your search.</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Clear search filter
          </button>
        </div>
      )}
    </div>
  );
};

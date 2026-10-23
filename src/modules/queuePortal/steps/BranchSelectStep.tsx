import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock,
  Building,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Landmark,
  Loader2,
} from 'lucide-react';
import type { TenantItem, QueueServiceItem, BranchItem } from '../types/queuePortal.types';

interface BranchSelectStepProps {
  selectedTenant: TenantItem;
  selectedService: QueueServiceItem;
  branches?: BranchItem[];
  isLoading?: boolean;
  onSelectBranch: (branch: BranchItem) => void;
  onBack: () => void;
}

export const BranchSelectStep: React.FC<BranchSelectStepProps> = ({
  selectedTenant,
  selectedService,
  branches = [],
  isLoading = false,
  onSelectBranch,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusFilter, setRadiusFilter] = useState<'all' | '5' | '10' | '20'>('all');

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (radiusFilter === '5') return b.distanceKm <= 5;
      if (radiusFilter === '10') return b.distanceKm <= 10;
      if (radiusFilter === '20') return b.distanceKm <= 20;
      return true;
    });
  }, [branches, searchQuery, radiusFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto py-3 sm:py-6 px-3 sm:px-6 min-w-0">
      {/* Top Back Navigation & Context Badges */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to services</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <Landmark className="w-3.5 h-3.5" />
            {selectedTenant.name}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            {selectedService.name} (Selected)
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0e2142] tracking-tight">
          Choose a branch that offers this service
        </h1>
        <p className="text-xs text-slate-500">
          Showing verified branches offering {selectedService.name}.
        </p>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search branches by area or name..."
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-100 text-xs font-semibold text-blue-700 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Sorted: Nearby First</span>
        </div>
      </div>

      {/* Main Content Layout: Radius Filters on Left, Branch Cards on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        {/* Left Filter Pills */}
        <div className="md:col-span-3 flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Branches', count: branches.length },
            { id: '5', label: 'Within 5 km', count: branches.filter((b) => b.distanceKm <= 5).length },
            { id: '10', label: 'Within 10 km', count: branches.filter((b) => b.distanceKm <= 10).length },
            { id: '20', label: 'Within 20 km', count: branches.filter((b) => b.distanceKm <= 20).length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRadiusFilter(tab.id as any)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                radiusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-2 ${
                  radiusFilter === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Branch Cards List */}
        <div className="md:col-span-9 space-y-2.5">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-600">Loading branch counters from database...</p>
            </div>
          ) : (
            filteredBranches.map((branch) => (
              <div
                key={branch.id}
                onClick={() => onSelectBranch(branch)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
              <div className="flex items-start gap-3">
                <img
                  src={branch.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=160&q=80'}
                  alt={branch.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-100 group-hover:scale-102 transition-transform"
                />

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {branch.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Service available
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 mb-1.5">
                    {branch.address}
                  </p>

                  <div className="flex items-center gap-2.5 text-[11px] text-slate-500 font-medium flex-wrap">
                    <span className="flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      {branch.distanceKm} km away
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Building className="w-3 h-3 text-slate-400" />
                      {branch.activeCounters} counters
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{branch.openingHours}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Wait Time & Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  ~{branch.waitMinutes} min wait
                </span>

                <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          )))}

          {!isLoading && filteredBranches.length === 0 && (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-semibold text-slate-600">No branches found within this distance.</p>
              <button
                type="button"
                onClick={() => {
                  setRadiusFilter('all');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Reset radius filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

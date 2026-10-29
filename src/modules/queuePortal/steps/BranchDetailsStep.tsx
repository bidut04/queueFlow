import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ExternalLink,
  ArrowRight,
  Check,
} from 'lucide-react';
import type { TenantItem, QueueServiceItem, BranchItem } from '../types/queuePortal.types';

interface BranchDetailsStepProps {
  selectedTenant: TenantItem;
  selectedBranch: BranchItem;
  selectedService: QueueServiceItem;
  services?: QueueServiceItem[];
  onSelectService: (service: QueueServiceItem) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const BranchDetailsStep: React.FC<BranchDetailsStepProps> = ({
  selectedTenant,
  selectedBranch,
  selectedService,
  services = [],
  onSelectService,
  onContinue,
  onBack,
}) => {
  const [showAllServices, setShowAllServices] = useState(false);

  const allServices = services.length > 0 ? services : [selectedService];
  const visibleServices = showAllServices ? allServices : allServices.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto py-3 sm:py-6 px-3 sm:px-6 min-w-0">
      {/* Top Back Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 mb-3 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {selectedTenant?.name ? `${selectedTenant.name} branches` : 'branch list'}</span>
      </button>

      {/* Main Branch Details Overview Card matching Mockup 5 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Photo & Branch Info */}
          <div className="md:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
            <img
              src={selectedBranch.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=300&q=80'}
              alt={selectedBranch.name}
              className="w-full sm:w-28 h-28 rounded-xl object-cover border border-slate-100 shadow-2xs shrink-0"
            />

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0e2142]">
                  {selectedBranch.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open Now
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2 flex-wrap">
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {selectedBranch.distanceKm} km away
                </span>
                <span>•</span>
                <span>{selectedBranch.activeCounters} active counters</span>
                <span>•</span>
                <span>{selectedBranch.openingHours}</span>
              </div>

              <p className="text-xs text-slate-600 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedBranch.address}</span>
              </p>
            </div>
          </div>

          {/* Right Mini Map Preview Widget */}
          <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">
              {selectedBranch.name}
            </span>
            <span className="text-[10px] text-slate-400 mb-2">
              {typeof selectedBranch.latitude === 'number' && typeof selectedBranch.longitude === 'number'
                ? `${selectedBranch.latitude.toFixed(4)}° N, ${selectedBranch.longitude.toFixed(4)}° E`
                : 'Coordinates Available'}
            </span>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(selectedBranch.name + ' ' + selectedBranch.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View on Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Services At This Branch Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-5 shadow-2xs">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mb-3">
          Services at this branch
        </h2>

        <div className="space-y-2">
          {visibleServices.map((srv) => {
            const isSelected = selectedService.id === srv.id;
            return (
              <div
                key={srv.id}
                onClick={() => onSelectService(srv)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {srv.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {srv.description || 'Fast verification available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    ~{srv.estWaitMinutes} min
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    {srv.activeCounters ?? 2} counters
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {allServices.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAllServices(!showAllServices)}
            className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            {showAllServices ? 'Show fewer services' : 'Show more services ▾'}
          </button>
        )}
      </div>

      {/* Action Navigation Footer matching Mockup 5 */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer"
        >
          ← Change branch
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to booking</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Landmark,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Send,
  FileText,
  HelpCircle,
  Building,
  MapPin,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import type { TenantItem, QueueServiceItem } from '../types/queuePortal.types';

interface ServiceSelectStepProps {
  selectedTenant: TenantItem;
  services?: QueueServiceItem[];
  isLoading?: boolean;
  onSelectService: (service: QueueServiceItem) => void;
  onBack: () => void;
}

export const ServiceSelectStep: React.FC<ServiceSelectStepProps> = ({
  selectedTenant,
  services = [],
  isLoading = false,
  onSelectService,
  onBack,
}) => {

  // Distinct color palettes and icons per service
  const getServiceTheme = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('kyc') || lower.includes('verify')) {
      return {
        icon: UserCheck,
        badgeBg: 'bg-emerald-100/90 text-emerald-800 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
      };
    }
    if (lower.includes('account')) {
      return {
        icon: ShieldCheck,
        badgeBg: 'bg-blue-100/90 text-blue-800 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
      };
    }
    if (lower.includes('cash') || lower.includes('deposit')) {
      return {
        icon: CreditCard,
        badgeBg: 'bg-amber-100/90 text-amber-800 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
      };
    }
    if (lower.includes('transfer') || lower.includes('fund')) {
      return {
        icon: Send,
        badgeBg: 'bg-cyan-100/90 text-cyan-800 border-cyan-200 group-hover:bg-cyan-600 group-hover:text-white',
      };
    }
    if (lower.includes('loan')) {
      return {
        icon: FileText,
        badgeBg: 'bg-purple-100/90 text-purple-800 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
      };
    }
    return {
      icon: HelpCircle,
      badgeBg: 'bg-rose-100/90 text-rose-800 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-3 sm:py-6 px-3 sm:px-6 min-w-0">
      {/* 1. Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to organizations</span>
        </button>

        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          Step 3 of 9 • Select Service
        </span>
      </div>

      {/* 2. Enriched Full-Width Organization Banner Card */}
      <div className="bg-white rounded-2xl border-2 border-blue-100/90 p-4 sm:p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {selectedTenant.name}
              </h2>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {selectedTenant.type}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium flex-wrap">
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Working Hours: 9:30 AM – 4:00 PM (Mon – Fri)</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedTenant.branchesCount ?? 4} branches available</span>
              </span>
              {selectedTenant.distanceKm !== undefined && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{selectedTenant.distanceKm} km away</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Change Organization Action */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 self-start md:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Change Org</span>
        </button>
      </div>

      {/* 3. Section Title & Description */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0e2142] tracking-tight mb-1">
          Select a service
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Choose the service you need below. On the next step, you'll select your preferred branch counter and see live wait times.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading services from organization counter API...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-6">
          <p className="text-sm font-bold text-slate-700">No active services currently listed for this organization.</p>
          <p className="text-xs text-slate-500 mt-1">Please try another organization or check back shortly.</p>
        </div>
      ) : (
        /* 4. Responsive Grid of Enhanced Service Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const theme = getServiceTheme(service.name);
            const IconComp = theme.icon;
            const isHighWait = service.estWaitMinutes >= 18;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Header with Distinctive Color Icon & Avg Service Time Chip */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-2xs border ${theme.badgeBg}`}
                    >
                      <IconComp className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>

                    {/* Clarified Time Estimation */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/80">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Avg. Service: ~{service.estWaitMinutes} min</span>
                    </span>
                  </div>

                  {/* Service Name & Darkened High-Contrast Description */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed font-normal mb-4">
                    {service.description || 'Fast-track digital token booking with counter priority.'}
                  </p>
                </div>

                {/* Card Footer with Contextual Status and Interactive CTA Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                  <div>
                    {isHighWait ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        High Wait Period
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500">
                        {service.activeCounters ?? 2} counters open
                      </span>
                    )}
                  </div>

                  {/* Prominent Interactive CTA */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-xs font-bold text-slate-800 transition-all duration-200 shadow-2xs">
                    <span>Select Service</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

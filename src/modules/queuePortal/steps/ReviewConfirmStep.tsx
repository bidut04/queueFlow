import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  Building,
  Info,
} from 'lucide-react';
import type { TenantItem, QueueServiceItem, BranchItem } from '../types/queuePortal.types';

interface ReviewConfirmStepProps {
  selectedTenant: TenantItem;
  selectedService: QueueServiceItem;
  selectedBranch: BranchItem;
  onEdit: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ReviewConfirmStep: React.FC<ReviewConfirmStepProps> = ({
  selectedTenant,
  selectedService,
  selectedBranch,
  onEdit,
  onContinue,
  onBack,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 px-2 min-w-0">
      {/* Top Back Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 mb-3 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to branch details</span>
      </button>

      {/* Main 2-Column Review Layout matching Mockup 6 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch mb-6">
        {/* Left Column: Booking Summary Card */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Landmark className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Booking Summary
                </h2>
              </div>

              <button
                type="button"
                onClick={onEdit}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <Landmark className="w-3.5 h-3.5 text-slate-400" />
                  Organization
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {selectedTenant.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Service
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {selectedService.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Branch
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {selectedBranch.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Estimated Wait Time
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
                  ~{selectedBranch.waitMinutes} min
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  People Ahead
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  2
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  Available Counters
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {selectedBranch.activeCounters}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ready to Book Visual Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/50 rounded-2xl border border-blue-200 p-6 flex flex-col items-center justify-center text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-blue-100/90 text-blue-600 flex items-center justify-center mb-3 shadow-inner">
            <Info className="w-8 h-8" />
          </div>

          <h3 className="text-base font-extrabold text-[#0e2142] mb-1">
            Ready to book?
          </h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-4">
            You're almost there! Click continue to choose your visit time and generate your queue token.
          </p>

          <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            No signup or credit card required
          </span>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

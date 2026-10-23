import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Users,
  Building,
  Landmark,
  ShieldCheck,
  Calendar,
  Eye,
} from 'lucide-react';
import type { BookedTokenInfo } from '../types/queuePortal.types';

interface BookingConfirmationStepProps {
  bookedToken: BookedTokenInfo;
  onTrackQueue: () => void;
  onViewDetails: () => void;
}

export const BookingConfirmationStep: React.FC<BookingConfirmationStepProps> = ({
  bookedToken,
  onTrackQueue,
  onViewDetails,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-6 px-2 min-w-0 text-center">
      {/* Big Green Checkmark Icon matching Mockup 8 */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm animate-in zoom-in duration-300">
        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
      </div>

      {/* Headline & Subtitle */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0e2142] tracking-tight mb-1">
        Your queue token is booked!
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 sm:mb-6">
        You're all set. Keep this token number handy and arrive at the branch at your selected time.
      </p>

      {/* Main Token Display Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm mb-5 max-w-xl mx-auto">
        <div className="grid grid-cols-3 gap-3 divide-x divide-slate-100 pb-4 mb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 block mb-0.5">
              Token Number
            </span>
            <div className="text-2xl sm:text-3.5xl font-black text-blue-600 tracking-tight">
              {bookedToken.tokenNumber}
            </div>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 block mb-0.5">
              Estimated Wait Time
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              <span>~{bookedToken.estWaitMinutes} min</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 block mb-0.5">
              People Ahead
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-800 flex items-center justify-center gap-1">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              <span>{bookedToken.peopleAhead}</span>
            </div>
          </div>
        </div>

        {/* 4 Metadata Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mb-0.5">
              <Landmark className="w-2.5 h-2.5 text-blue-600" />
              Organization
            </span>
            <p className="text-[11px] font-bold text-slate-800 truncate">
              {bookedToken.tenantName}
            </p>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
              Service
            </span>
            <p className="text-[11px] font-bold text-slate-800 truncate">
              {bookedToken.serviceName}
            </p>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mb-0.5">
              <Building className="w-2.5 h-2.5 text-indigo-600" />
              Branch
            </span>
            <p className="text-[11px] font-bold text-slate-800 truncate">
              {bookedToken.branchName}
            </p>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mb-0.5">
              <Calendar className="w-2.5 h-2.5 text-purple-600" />
              Time Slot
            </span>
            <p className="text-[11px] font-bold text-slate-800 truncate">
              {bookedToken.timeSlot}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onViewDetails}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>

        <button
          type="button"
          onClick={onTrackQueue}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
        >
          <span>Track My Queue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

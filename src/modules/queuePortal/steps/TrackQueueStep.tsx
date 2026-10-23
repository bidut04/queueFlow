import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Users,
  Bell,
  ArrowLeft,
  Check,
  Radio,
} from 'lucide-react';
import type { BookedTokenInfo } from '../types/queuePortal.types';

interface TrackQueueStepProps {
  bookedToken: BookedTokenInfo;
  onBookAnother: () => void;
  onBack: () => void;
}

export const TrackQueueStep: React.FC<TrackQueueStepProps> = ({
  bookedToken,
  onBookAnother,
  onBack,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
    }, 600);
  };

  const steps = [
    { id: 1, label: 'Booked', sub: bookedToken.bookedAt, status: 'completed' },
    { id: 2, label: 'Waiting', sub: 'In Queue', status: 'current' },
    { id: 3, label: 'Called', sub: 'Counter Call', status: 'upcoming' },
    { id: 4, label: 'In Service', sub: 'At Counter', status: 'upcoming' },
    { id: 5, label: 'Completed', sub: 'Finished', status: 'upcoming' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-2 sm:py-4 px-2 min-w-0">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to portal</span>
        </button>

        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0e2142] tracking-tight">
            My Queue
          </h1>
          <p className="text-xs text-slate-500">Live ticket updates and progress tracking</p>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Updated: {lastUpdated}
        </span>
      </div>

      {/* Main Live Queue Ticket Card matching Mockup 9 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm mb-5">
        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Token {bookedToken.tokenNumber}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {bookedToken.serviceName} • {bookedToken.branchName}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold block">Counter</span>
            <span className="text-xs font-bold text-slate-800">Counter 2 (Active)</span>
          </div>
        </div>

        {/* 3 Main Live Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">
              Current Status
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Waiting in Line
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">
              Estimated Wait Time
            </span>
            <div className="text-lg sm:text-xl font-black text-emerald-600 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>~{bookedToken.estWaitMinutes} min</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">
              People Ahead
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-800 flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-slate-500" />
              <span>{bookedToken.peopleAhead} people</span>
            </div>
          </div>
        </div>

        {/* 5-Stage Visual Progress Stepper matching Mockup 9 */}
        <div className="mb-6 pt-2">
          <span className="text-xs font-bold text-slate-700 block mb-3">
            Queue Progression
          </span>

          <div className="relative flex items-center justify-between">
            {/* Connecting Bar */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            <div className="absolute top-1/2 left-4 w-1/4 h-0.5 bg-emerald-500 -translate-y-1/2 z-0" />

            {steps.map((st) => (
              <div key={st.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    st.status === 'completed'
                      ? 'bg-emerald-500 text-white shadow-2xs'
                      : st.status === 'current'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {st.status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{st.id}</span>
                  )}
                </div>

                <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1.5 text-center">
                  {st.label}
                </span>
                <span className="text-[9px] text-slate-400 text-center">
                  {st.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Notification Bar matching Mockup 9 */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 font-medium">
          <Bell className="w-4 h-4 text-blue-600 shrink-0 animate-bounce" />
          <span>We'll notify you via SMS and update this page in real-time as your number approaches.</span>
        </div>
      </div>

      {/* Bottom CTA to book another token */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBookAnother}
          className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
        >
          Book Another Token
        </button>
      </div>
    </div>
  );
};

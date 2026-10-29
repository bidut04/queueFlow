import React, { useState } from 'react';
import { Mail, Users, Volume2, VolumeX, Clock, Zap, Info } from 'lucide-react';
import type { LiveQueuePreviewData } from '../types/queuePortal.types';
import { counterChime } from '../../../utils/audioChime';

export interface LiveQueuePreviewCardProps {
  queueData: LiveQueuePreviewData;
  onToggleHurryMode?: (enabled: boolean) => void;
}

export const LiveQueuePreviewCard: React.FC<LiveQueuePreviewCardProps> = ({
  queueData,
  onToggleHurryMode,
}) => {
  const [hurryMode, setHurryMode] = useState<boolean>(queueData.hurryModeEnabled);
  const [isMuted, setIsMuted] = useState<boolean>(() => counterChime.getIsMuted());

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    counterChime.setMuted(nextMuted);
    if (!nextMuted) {
      counterChime.playChime();
    }
  };

  const handleToggleHurry = () => {
    const nextState = !hurryMode;
    setHurryMode(nextState);
    if (onToggleHurryMode) {
      onToggleHurryMode(nextState);
    }
  };

  const isRecentCall = Boolean(
    queueData.lastUpdatedMs && Date.now() - queueData.lastUpdatedMs < 3500
  );

  return (
    <div
      className={`rounded-xl border p-3 sm:p-3.5 shadow-2xs w-full max-w-full min-w-0 overflow-hidden transition-all duration-500 ${
        isRecentCall
          ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-300'
          : 'bg-[#f0fbf7]/60 border-emerald-100/90'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
              Live Queue Status
            </h2>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {queueData.serviceName} • {queueData.branchName}
            </p>
          </div>
        </div>

        {/* Audio Toggle & Status Pill */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute counter chime' : 'Mute counter chime'}
            className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync</span>
          </div>
        </div>
      </div>

      {/* 3-Column Ticket Stats Box */}
      <div className="bg-white rounded-lg border border-emerald-100/80 p-2 my-2 grid grid-cols-3 divide-x divide-slate-100 shadow-2xs w-full min-w-0">
        {/* Now Serving */}
        <div className="flex flex-col items-center justify-center px-1 text-center min-w-0">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mb-0.5">
            <Users className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
            <span className="truncate">Serving</span>
          </div>
          <span
            className={`inline-block px-1.5 py-0.5 text-white font-extrabold text-xs rounded tracking-wider shadow-2xs truncate max-w-full transition-all duration-300 ${
              isRecentCall ? 'bg-emerald-500 scale-105 animate-pulse' : 'bg-emerald-600'
            }`}
          >
            {queueData.nowServingTicket}
          </span>
        </div>

        {/* Your Ticket */}
        <div className="flex flex-col items-center justify-center px-1 text-center min-w-0">
          <span className="text-[10px] font-semibold text-slate-500 mb-0.5 truncate">
            Your Token
          </span>
          <span className="inline-block px-1.5 py-0.5 bg-blue-50 border border-blue-500 text-blue-600 font-extrabold text-xs rounded tracking-wider truncate max-w-full">
            {queueData.userTicket}
          </span>
        </div>

        {/* Position in line */}
        <div className="flex flex-col items-center justify-center px-1 text-center min-w-0">
          <span className="text-[10px] font-semibold text-slate-500 mb-0.5 truncate">
            Position
          </span>
          <span className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight truncate max-w-full">
            {queueData.positionInLine}
          </span>
        </div>
      </div>

      {/* Wait Time & Hurry Mode Row */}
      <div className="flex items-center justify-between gap-2 py-1.5 border-b border-emerald-100/80 mb-2 w-full min-w-0">
        {/* Estimated Wait Time */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] text-slate-500 leading-none block">
              Estimated wait:
            </span>
            <span className="text-xs font-extrabold text-slate-900 leading-tight">
              {queueData.estWaitRange}
            </span>
          </div>
        </div>

        {/* Hurry Mode Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
            <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
            Hurry mode
          </span>
          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={hurryMode}
            onClick={handleToggleHurry}
            className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-150 focus:outline-none ${
              hurryMode ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-2xs transition duration-150 ${
                hurryMode ? 'translate-x-3' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 8-Step Queue Progress Track */}
      <div className="w-full min-w-0 max-w-full overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center justify-between relative min-w-[280px] w-full px-1">
          {/* Horizontal Connecting Line */}
          <div className="absolute top-2.5 left-3 right-3 h-0.5 bg-slate-200 z-0" />

          {queueData.timeline.map((step) => {
            const isServed = step.status === 'served';
            const isServing = step.status === 'serving';
            const isUser = step.status === 'user';

            let circleClass = 'bg-slate-200 text-slate-500';
            let labelClass = 'text-slate-400';

            if (isServing || isServed) {
              circleClass = 'bg-emerald-600 text-white';
              labelClass = isServing ? 'text-emerald-700 font-bold' : 'text-slate-500';
            } else if (isUser) {
              circleClass = 'bg-blue-600 text-white ring-2 ring-blue-200';
              labelClass = 'text-blue-600 font-bold';
            }

            return (
              <div
                key={step.stepNumber}
                className="flex flex-col items-center relative z-10 select-none shrink-0"
              >
                {/* Step Circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-2xs ${circleClass}`}
                >
                  {step.stepNumber}
                </div>

                {/* Ticket Number */}
                <span className="text-[9px] font-bold text-slate-600 mt-0.5">
                  {step.ticketNumber}
                </span>

                {/* Status Subtext */}
                <span className={`text-[8px] ${labelClass}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Live Notice Banner */}
      <div className="mt-2 flex items-center gap-1.5 p-1.5 rounded-lg bg-blue-50/80 border border-blue-100 text-blue-800 text-[10px] font-medium w-full min-w-0">
        <Info className="w-3 h-3 text-blue-600 shrink-0" />
        <span className="truncate">Wait estimates update in real-time.</span>
      </div>
    </div>
  );
};

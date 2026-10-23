import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Ticket,
  Smartphone,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import type { TenantItem, QueueServiceItem, BranchItem } from '../types/queuePortal.types';

interface ChooseTimeSlotStepProps {
  selectedTenant: TenantItem;
  selectedService: QueueServiceItem;
  selectedBranch: BranchItem;
  onGetToken: (timeSlot: string) => void;
  onBack: () => void;
}

export const ChooseTimeSlotStep: React.FC<ChooseTimeSlotStepProps> = ({
  selectedService,
  selectedBranch,
  onGetToken,
  onBack,
}) => {
  const [mode, setMode] = useState<'slot' | 'next'>('slot');
  const [selectedSlot, setSelectedSlot] = useState('Now (8 min)');

  const timeSlots = [
    { id: 'now', label: 'Now', waitText: '8 min wait', full: 'Now (8 min)' },
    { id: '10am', label: '10:00 AM', waitText: '12 min wait', full: '10:00 AM' },
    { id: '11am', label: '11:00 AM', waitText: '16 min wait', full: '11:00 AM' },
    { id: '12pm', label: '12:00 PM', waitText: '25 min wait', full: '12:00 PM' },
    { id: '1pm', label: '1:00 PM', waitText: '32 min wait', full: '1:00 PM' },
  ];

  const handleConfirm = () => {
    const finalSlot = mode === 'next' ? 'Next Available' : selectedSlot;
    onGetToken(finalSlot);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 px-2 min-w-0">
      {/* Top Back Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 mb-3 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to summary</span>
      </button>

      {/* Selected Branch Header Pill */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          {selectedBranch.name} • {selectedBranch.distanceKm} km away
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
          {selectedService.name}
        </span>
      </div>

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0e2142] tracking-tight">
          Choose when you want to visit
        </h1>
        <p className="text-xs text-slate-500">
          Select a time slot or get the next available token immediately.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center p-1 bg-slate-200/70 rounded-xl max-w-sm mb-5 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMode('slot')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center cursor-pointer ${
            mode === 'slot' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Select Time Slot
        </button>
        <button
          type="button"
          onClick={() => setMode('next')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center cursor-pointer ${
            mode === 'next' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Get Next Available
        </button>
      </div>

      {/* Grid: Slots on Left, Token Readiness Note on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch mb-6">
        {/* Left: Time Slots */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
          {mode === 'slot' ? (
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-3">
                Available Slots for Today
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.full;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.full)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-800'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-extrabold">{slot.label}</div>
                      <div
                        className={`text-[10px] font-medium mt-0.5 ${
                          isSelected ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {slot.waitText}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Immediate Next Available Token
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                You will be assigned the next instant number at the counter right now.
              </p>
            </div>
          )}
        </div>

        {/* Right: Info Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/50 rounded-2xl border border-blue-200 p-5 flex flex-col justify-center text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2.5">
            <Ticket className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-extrabold text-[#0e2142] mb-1">
            Your token will be ready
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            You'll receive your token number, real-time wait time, and live position updates via SMS and right on this portal.
          </p>

          <div className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 py-1 px-2.5 rounded-full border border-emerald-200">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Instant SMS & QR verification</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
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
          onClick={handleConfirm}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Get Token</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

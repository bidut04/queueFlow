import React from 'react';
import { X, Calendar, Ticket, Clock, CheckCircle2 } from 'lucide-react';
import type { LiveQueuePreviewData, UpcomingAppointmentItem } from '../types/queuePortal.types';

export interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeQueue: LiveQueuePreviewData;
  upcomingAppointment?: UpcomingAppointmentItem | null;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  activeQueue,
  upcomingAppointment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                My Bookings & Queue Tickets
              </h3>
              <p className="text-[10px] text-slate-500">
                Your active queue tokens and scheduled visits
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Active Live Queue Token */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Ticket className="w-3 h-3 text-emerald-600" />
              Active Live Token
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-100">
              Live in Queue
            </span>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {activeQueue.serviceName}
                </h4>
                <p className="text-[10px] text-slate-600">
                  {activeQueue.branchName}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block">Your Token</span>
                <span className="text-sm font-black text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                  {activeQueue.userTicket}
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Est. Wait: <strong>{activeQueue.estWaitRange}</strong></span>
              </div>
              <div className="text-slate-600">
                Serving: <strong className="text-emerald-700">{activeQueue.nowServingTicket}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Scheduled Appointments */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
            <Calendar className="w-3 h-3 text-blue-600" />
            Confirmed Appointment
          </span>

          {upcomingAppointment ? (
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {upcomingAppointment.serviceName}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {upcomingAppointment.dateText}
                  </p>
                </div>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                  {upcomingAppointment.status}
                </span>
              </div>

              <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Please arrive 5 minutes before your scheduled slot.</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 text-center text-xs text-slate-500">
              No advance appointments booked yet.
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import type { UpcomingAppointmentItem } from '../types/queuePortal.types';

export interface UpcomingAppointmentCardProps {
  appointment?: UpcomingAppointmentItem | null;
  onClick?: () => void;
}

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({
  appointment,
  onClick,
}) => {
  if (!appointment) return null;
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-between gap-2.5"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Calendar Icon Box */}
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
          <Calendar className="w-4 h-4" />
        </div>

        {/* Appointment Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Upcoming appointment
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded-full">
              {appointment.status}
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {appointment.serviceName}
          </h4>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
            <Calendar className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <span className="truncate">{appointment.dateText}</span>
          </div>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-slate-300 hover:text-slate-500 transition-colors shrink-0" />
    </div>
  );
};

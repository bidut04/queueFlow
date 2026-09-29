import React from 'react';
import { UserCheck, Activity, Smile, HeartPulse, Stethoscope, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { PopularServiceData } from '../../types/dashboard';

export interface PopularServicesProps {
  services: PopularServiceData[];
  onViewAll?: () => void;
}

export const PopularServices: React.FC<PopularServicesProps> = ({ services, onViewAll }) => {
  const getServiceIcon = (type: string) => {
    const size = 15;
    switch (type) {
      case 'consultation':
        return <UserCheck size={size} color="#3b82f6" />;
      case 'lab':
        return <Activity size={size} color="#10b981" />;
      case 'dental':
        return <Smile size={size} color="#f59e0b" />;
      case 'physio':
        return <HeartPulse size={size} color="#8b5cf6" />;
      case 'specialist':
      default:
        return <Stethoscope size={size} color="#06b6d4" />;
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Popular Services</h3>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-0 cursor-pointer"
        >
          View all <ArrowRight size={11} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {services.map((srv) => (
          <div key={srv.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                {getServiceIcon(srv.iconType)}
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-800">{srv.name}</h5>
                <p className="text-[10px] text-slate-500">{srv.bookingsCount} bookings</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ArrowUpRight size={10} />
              {srv.growthPercent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

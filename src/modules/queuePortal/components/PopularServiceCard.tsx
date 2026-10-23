import React from 'react';
import {
  Landmark,
  Mail,
  Building2,
  MapPin,
  ChevronRight,
  Clock,
} from 'lucide-react';
import type { QueueServiceItem } from '../types/queuePortal.types';

export interface PopularServiceCardProps {
  service: QueueServiceItem;
  onViewQueue: (service: QueueServiceItem) => void;
  onBookSlot: (service: QueueServiceItem) => void;
  isSelected?: boolean;
}

export const PopularServiceCard: React.FC<PopularServiceCardProps> = ({
  service,
  onViewQueue,
  onBookSlot,
  isSelected = false,
}) => {
  const getIconStyles = () => {
    switch (service.iconType) {
      case 'bank':
        return {
          icon: <Landmark className="w-4 h-4 text-blue-600" />,
          bg: 'bg-blue-50',
          badgeBg: 'bg-blue-100/80 text-blue-700',
        };
      case 'mail':
        return {
          icon: <Mail className="w-4 h-4 text-rose-500" />,
          bg: 'bg-rose-50',
          badgeBg: 'bg-rose-100/80 text-rose-700',
        };
      case 'government':
      default:
        return {
          icon: <Building2 className="w-4 h-4 text-purple-600" />,
          bg: 'bg-purple-50',
          badgeBg: 'bg-purple-100/80 text-purple-700',
        };
    }
  };

  const styling = getIconStyles();

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-150 p-2.5 sm:p-3 mb-1.5 shadow-2xs hover:shadow-xs w-full max-w-full min-w-0 ${
        isSelected
          ? 'border-blue-400 ring-1.5 ring-blue-100 bg-blue-50/20'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
        {/* Left: Icon & Service Identification */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-8 h-8 rounded-lg ${styling.bg} flex items-center justify-center shrink-0 shadow-2xs`}
          >
            {styling.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                {service.name}
              </h3>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${styling.badgeBg}`}
              >
                {service.categoryLabel}
              </span>
            </div>
            {service.branchName && (
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {service.branchName}
              </p>
            )}
          </div>
        </div>

        {/* Middle: Distance, Hours, Wait Time */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 text-[11px] text-slate-600 w-full sm:w-auto min-w-0 shrink-0">
          {/* Distance */}
          <div className="flex items-center gap-1 shrink-0">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="font-medium text-[10px] sm:text-[11px]">
              {service.distanceKm} km
            </span>
          </div>

          {/* Status & Hours */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-semibold text-emerald-700 text-[10px] sm:text-[11px]">
              Open
            </span>
          </div>

          {/* Estimated Wait */}
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0">
            <Clock className="w-2.5 h-2.5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold">
              ~{service.estWaitMinutes} min
            </span>
          </div>
        </div>

        {/* Right: Actions (Full width on mobile, side-by-side on desktop) */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 min-w-0">
          <button
            type="button"
            onClick={() => onViewQueue(service)}
            className="flex-1 sm:flex-initial text-center px-2.5 py-1.5 sm:py-1 rounded-lg border border-blue-500/80 hover:border-blue-600 text-blue-600 hover:bg-blue-50 text-[11px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            View queue
          </button>
          <button
            type="button"
            onClick={() => onBookSlot(service)}
            className="flex-1 sm:flex-initial text-center px-3 py-1.5 sm:py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-2xs shadow-blue-500/20 whitespace-nowrap"
          >
            Book slot
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden md:block shrink-0" />
        </div>
      </div>
    </div>
  );
};

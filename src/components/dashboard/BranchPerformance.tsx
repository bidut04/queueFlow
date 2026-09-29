import React from 'react';
import { Landmark, MapPin, Building2, Navigation, Store, Star, ArrowRight } from 'lucide-react';
import type { BranchPerformanceData } from '../../types/dashboard';
import { Badge } from '../ui/Badge';

export interface BranchPerformanceProps {
  branches: BranchPerformanceData[];
  onViewAll?: () => void;
}

export const BranchPerformance: React.FC<BranchPerformanceProps> = ({ branches, onViewAll }) => {
  const getBranchIcon = (type: string) => {
    const size = 15;
    switch (type) {
      case 'bank':
        return <Landmark size={size} color="#3b82f6" />;
      case 'pin':
        return <MapPin size={size} color="#3b82f6" />;
      case 'building':
        return <Building2 size={size} color="#f59e0b" />;
      case 'location':
        return <Navigation size={size} color="#8b5cf6" />;
      case 'store':
      default:
        return <Store size={size} color="#f43f5e" />;
    }
  };

  const getProgressColor = (status: string) => {
    if (status === 'Busy') return '#f43f5e';
    if (status === 'Slight Delay') return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl shadow-xs justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Branch Performance</h3>
          <p className="text-[11px] text-slate-500">Today's service rating & waiting time</p>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-[8px] font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-0 cursor-pointer"
        >
          View all <ArrowRight size={11} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        {branches.map((branch) => (
          <div key={branch.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {getBranchIcon(branch.iconType)}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">{branch.name}</h4>
                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                    <span className="inline-flex items-center gap-0.5 font-semibold text-slate-800">
                      {branch.rating} <Star size={10} className="fill-amber-400 text-amber-400" />
                    </span>
                    <span>•</span>
                    <span>{branch.avgWaitMinutes} min wait</span>
                  </div>
                </div>
              </div>

              <Badge label={branch.status} />
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${branch.efficiencyPercent}%`,
                  backgroundColor: getProgressColor(branch.status)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

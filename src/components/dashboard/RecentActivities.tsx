import React from 'react';
import { CalendarCheck, Users, CheckCircle2, UserPlus, AlertOctagon, ArrowRight } from 'lucide-react';
import type { RecentActivity } from '../../types/dashboard';

export interface RecentActivitiesProps {
  activities: RecentActivity[];
  onViewAll?: () => void;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, onViewAll }) => {
  const getActivityIcon = (type: string) => {
    const size = 13;
    switch (type) {
      case 'booking':
        return (
          <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarCheck size={size} color="#10b981" />
          </div>
        );
      case 'walkin':
        return (
          <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={size} color="#3b82f6" />
          </div>
        );
      case 'service':
        return (
          <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#fffbe6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={size} color="#f59e0b" />
          </div>
        );
      case 'user':
        return (
          <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={size} color="#8b5cf6" />
          </div>
        );
      case 'alert':
      default:
        return (
          <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertOctagon size={size} color="#f43f5e" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Recent Activities</h3>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-0 cursor-pointer"
        >
          View all <ArrowRight size={11} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {getActivityIcon(act.type)}
              <div className="truncate">
                <h5 className="text-xs font-bold text-slate-800 truncate">{act.title}</h5>
                <p className="text-[10.5px] text-slate-500 truncate">{act.subtitle}</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 font-medium">{act.timeAgo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

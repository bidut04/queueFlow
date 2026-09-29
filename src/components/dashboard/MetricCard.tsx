import React from 'react';
import { Users, Calendar, Clock, TrendingUp, UserCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { MetricCardData } from '../../types/dashboard';
import { Sparkline } from '../ui/Sparkline';

export interface MetricCardProps {
  data: MetricCardData;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const getThemeStyles = () => {
    switch (data.colorTheme) {
      case 'blue':
        return {
          iconBg: '#eff6ff',
          iconColor: '#2563eb',
          sparkColor: '#2563eb'
        };
      case 'emerald':
        return {
          iconBg: '#ecfdf5',
          iconColor: '#10b981',
          sparkColor: '#10b981'
        };
      case 'purple':
        return {
          iconBg: '#f5f3ff',
          iconColor: '#8b5cf6',
          sparkColor: '#8b5cf6'
        };
      case 'amber':
        return {
          iconBg: '#fffbe6',
          iconColor: '#f59e0b',
          sparkColor: '#f59e0b'
        };
      case 'pink':
        return {
          iconBg: '#fff1f2',
          iconColor: '#f43f5e',
          sparkColor: '#f43f5e'
        };
    }
  };

  const theme = getThemeStyles();

  const renderIcon = () => {
    const size = 13;
    switch (data.iconName) {
      case 'users':
        return <Users size={size} color={theme.iconColor} />;
      case 'calendar':
        return <Calendar size={size} color={theme.iconColor} />;
      case 'clock':
        return <Clock size={size} color={theme.iconColor} />;
      case 'check':
        return <TrendingUp size={size} color={theme.iconColor} />;
      case 'userCheck':
        return <UserCheck size={size} color={theme.iconColor} />;
    }
  };

  const isPositive = data.trend === 'up';

  return (
    <div className="relative flex flex-col justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all min-h-[72px]">
      <div className="flex items-center justify-between">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.iconBg }}
        >
          {renderIcon()}
        </div>
        <Sparkline data={data.sparklineData} color={theme.sparkColor} width={55} height={18} />
      </div>

      <div className="mt-1.5">
        <p className="text-[11px] text-slate-500 font-medium leading-none">{data.title}</p>

        <div className="flex items-baseline justify-between gap-1.5 mt-1">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-none">
            {data.value}
          </h2>

          <div className="flex items-center gap-0.5 text-[10.5px] shrink-0">
            <span className={`inline-flex items-center gap-0.5 font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {data.change}
            </span>
            <span className="text-slate-400 text-[10px] whitespace-nowrap">{data.changePeriod}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

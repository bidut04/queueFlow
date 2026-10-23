import React from 'react';
import { Search, MapPin, Ticket } from 'lucide-react';

export const HowItWorksCard: React.FC = () => {
  const steps = [
    {
      num: 1,
      icon: <Search className="w-3 h-3 text-blue-600" />,
      title: 'Choose service',
      desc: 'Pick your service or search.',
    },
    {
      num: 2,
      icon: <MapPin className="w-3 h-3 text-blue-600" />,
      title: 'Select branch',
      desc: 'Check live wait and opening.',
    },
    {
      num: 3,
      icon: <Ticket className="w-3 h-3 text-blue-600" />,
      title: 'Track turn live',
      desc: 'Get real-time token alerts.',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 sm:p-3 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-slate-900 leading-tight">
          How it works
        </h3>
        <span className="text-[10px] text-slate-500 font-medium">
          3 simple steps to skip waiting
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {steps.map((st) => (
          <div
            key={st.num}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50/70 border border-slate-100"
          >
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {st.num}
              </span>
              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                {st.icon}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[11px] font-bold text-slate-900 truncate">
                {st.title}
              </h4>
              <p className="text-[10px] text-slate-500 truncate leading-tight">
                {st.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

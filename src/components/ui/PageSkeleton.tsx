import React from 'react';

interface PageSkeletonProps {
  variant?: 'dashboard' | 'table' | 'form' | 'full';
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({ variant: _variant = 'dashboard' }) => {
  return (
    <div className="w-full min-h-[85vh] p-4 sm:p-6 space-y-6 animate-fadeIn">
      <style>{`
        @keyframes qf-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .qf-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: qf-shimmer 1.6s infinite ease-in-out;
          border-radius: 8px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Top Header Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="space-y-2">
          <div className="qf-skeleton h-4 w-28" />
          <div className="qf-skeleton h-7 w-56 sm:w-72" />
        </div>
        <div className="flex items-center gap-3">
          <div className="qf-skeleton h-9 w-32 hidden sm:block" />
          <div className="qf-skeleton h-9 w-28" />
        </div>
      </div>

      {/* 4 KPI Metric Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="qf-skeleton h-4 w-24" />
              <div className="qf-skeleton h-8 w-8 rounded-lg" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="qf-skeleton h-8 w-20" />
              <div className="qf-skeleton h-4 w-12" />
            </div>
            <div className="qf-skeleton h-2 w-full mt-2 rounded-full" />
          </div>
        ))}
      </div>

      {/* Main Charts & Analytics Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Chart Skeleton (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-100 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="qf-skeleton h-5 w-40" />
              <div className="qf-skeleton h-3 w-56" />
            </div>
            <div className="flex gap-2">
              <div className="qf-skeleton h-7 w-16" />
              <div className="qf-skeleton h-7 w-16" />
            </div>
          </div>
          {/* Simulated Chart Bars */}
          <div className="h-56 pt-6 flex items-end justify-between gap-3 px-2">
            {[45, 65, 30, 80, 55, 95, 70, 40, 85, 60, 75, 90].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="qf-skeleton w-full rounded-t-md"
                  style={{ height: `${h}%` }}
                />
                <div className="qf-skeleton h-2.5 w-6" />
              </div>
            ))}
          </div>
        </div>

        {/* Side Performance / List Skeleton (1 col) */}
        <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="qf-skeleton h-5 w-32" />
            <div className="qf-skeleton h-4 w-12" />
          </div>
          <div className="space-y-3.5 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="qf-skeleton h-9 w-9 rounded-full flex-shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="qf-skeleton h-3.5 w-28" />
                    <div className="qf-skeleton h-2.5 w-16" />
                  </div>
                </div>
                <div className="qf-skeleton h-5 w-14 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Data Table Skeleton */}
      <div className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1.5">
            <div className="qf-skeleton h-5 w-48" />
            <div className="qf-skeleton h-3 w-32" />
          </div>
          <div className="flex gap-2">
            <div className="qf-skeleton h-8 w-24" />
            <div className="qf-skeleton h-8 w-20" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 py-2 border-b border-slate-100">
            <div className="qf-skeleton h-3.5 w-20" />
            <div className="qf-skeleton h-3.5 w-24" />
            <div className="qf-skeleton h-3.5 w-28" />
            <div className="qf-skeleton h-3.5 w-16" />
            <div className="qf-skeleton h-3.5 w-20 justify-self-end" />
          </div>

          {/* Table Data Rows */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="grid grid-cols-5 gap-4 py-2.5 items-center border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className="qf-skeleton h-7 w-7 rounded-full flex-shrink-0" />
                <div className="qf-skeleton h-3.5 w-24" />
              </div>
              <div className="qf-skeleton h-3.5 w-20" />
              <div className="qf-skeleton h-3.5 w-32" />
              <div className="qf-skeleton h-5 w-16 rounded-full" />
              <div className="qf-skeleton h-6 w-16 justify-self-end rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

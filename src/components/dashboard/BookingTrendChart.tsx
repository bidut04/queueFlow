import React, { useState } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import type { BookingTrendPoint } from '../../types/dashboard';

export interface BookingTrendChartProps {
  data: BookingTrendPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.find(p => p.name === 'Total Bookings')?.value ?? 0;
    const completed = payload.find(p => p.name === 'Completed')?.value ?? 0;

    return (
      <div style={{
        backgroundColor: '#090d16',
        color: '#ffffff',
        padding: '10px 14px',
        borderRadius: 10,
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.45)',
        border: '1px solid #1e293b',
        fontSize: 12,
        fontFamily: 'inherit',
        minWidth: 160
      }}>
        <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 6, fontSize: 11 }}>
          24 Jul 2024, 9:23 pm ({label})
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, color: '#38bdf8', fontWeight: 600 }}>
          <span>Consumed:</span>
          <span>{total} MWh</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, color: '#94a3b8', marginTop: 3, fontWeight: 500 }}>
          <span>Consumed:</span>
          <span>{completed} MWh</span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Active Double-Ring Halo Dot
interface ActiveDotProps {
  cx?: number;
  cy?: number;
}

const CustomActiveDot: React.FC<ActiveDotProps> = ({ cx, cy }) => {
  if (cx === undefined || cy === undefined) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="rgba(56, 189, 248, 0.2)" />
      <circle cx={cx} cy={cy} r={6} fill="#ffffff" stroke="#0284c7" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={2.5} fill="#0284c7" />
    </g>
  );
};

export const BookingTrendChart: React.FC<BookingTrendChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<string>('Last 20 Days');

  return (
    <div className="flex flex-col gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Energy & Queue Analytics</h3>
          <p className="text-[11px] text-slate-500">Real-time consumption & booking trend</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3.5 text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600" />
              <span>Current Consumed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Baseline Benchmark</span>
            </div>
          </div>

          {/* Time Filter Select */}
          <div className="relative flex items-center">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none pl-2.5 pr-6 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Last 20 Days">Last 20 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="This Month">This Month</option>
            </select>
            <ChevronDown size={12} className="absolute right-1.5 pointer-events-none text-slate-500" />
          </div>
        </div>
      </div>

      {/* Chart Canvas with thin line width */}
      <div className="w-full h-[210px] mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartBlueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Dotted Matrix Grid */}
            <CartesianGrid strokeDasharray="1 6" stroke="#cbd5e1" strokeWidth={1.5} vertical={true} horizontal={true} />

            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              unit=" kWh"
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
            />

            {/* Glowing Cyan Vertical Cursor Line on Hover */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#0284c7',
                strokeWidth: 1.5,
                strokeDasharray: 'none',
                opacity: 0.85
              }}
            />

            {/* Primary Thin Blue Curve Line */}
            <Area
              type="monotone"
              dataKey="totalBookings"
              name="Total Bookings"
              stroke="#0284c7"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#chartBlueGradient)"
              dot={false}
              activeDot={<CustomActiveDot />}
            />

            {/* Secondary Thin Dashed Benchmark Curve */}
            <Line
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#94a3b8"
              strokeWidth={1.2}
              strokeDasharray="3 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

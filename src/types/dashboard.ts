export type TrendDirection = 'up' | 'down' | 'neutral';

export interface SparklinePoint {
  x: number;
  y: number;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  changePeriod: string;
  trend: TrendDirection;
  iconName: 'users' | 'calendar' | 'clock' | 'check' | 'userCheck';
  sparklineData: number[];
  colorTheme: 'blue' | 'emerald' | 'purple' | 'amber' | 'pink';
}

export interface BookingTrendPoint {
  date: string;
  totalBookings: number;
  completed: number;
}

export type BranchStatusType = 'On Time' | 'Slight Delay' | 'Busy';

export interface BranchPerformanceData {
  id: string;
  name: string;
  rating: number;
  avgWaitMinutes: number;
  status: BranchStatusType;
  efficiencyPercent: number;
  iconType: 'bank' | 'pin' | 'building' | 'location' | 'store';
}

export interface RecentActivity {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: 'booking' | 'walkin' | 'service' | 'user' | 'alert';
}

export interface PopularServiceData {
  id: string;
  name: string;
  bookingsCount: number;
  growthPercent: number;
  iconType: 'consultation' | 'lab' | 'dental' | 'physio' | 'specialist';
}

import type { Booking } from '../types/booking';
import type { MetricCardData, BookingTrendPoint, BranchPerformanceData, RecentActivity, PopularServiceData } from '../types/dashboard';
import type { Branch } from '../types/branch';
import type { Service } from '../types/service';
import type { UserItem } from '../types/user';

export const METRIC_CARDS_DATA: MetricCardData[] = [
  {
    id: 'total-bookings',
    title: 'Total Bookings',
    value: '0',
    change: '0%',
    changePeriod: 'this week',
    trend: 'up',
    iconName: 'users',
    sparklineData: [0, 0, 0, 0, 0, 0, 0],
    colorTheme: 'blue'
  },
  {
    id: 'todays-tickets',
    title: "Today's Tickets",
    value: '0',
    change: '0%',
    changePeriod: 'today',
    trend: 'up',
    iconName: 'calendar',
    sparklineData: [0, 0, 0, 0, 0, 0, 0],
    colorTheme: 'emerald'
  },
  {
    id: 'avg-waiting-time',
    title: 'Avg. Waiting Time',
    value: '0s',
    change: '0%',
    changePeriod: 'today',
    trend: 'down',
    iconName: 'clock',
    sparklineData: [0, 0, 0, 0, 0, 0, 0],
    colorTheme: 'purple'
  },
  {
    id: 'service-accuracy',
    title: 'Service Accuracy',
    value: '100%',
    change: '0%',
    changePeriod: 'today',
    trend: 'up',
    iconName: 'check',
    sparklineData: [0, 0, 0, 0, 0, 0, 0],
    colorTheme: 'amber'
  },
  {
    id: 'total-customers',
    title: 'Total Customers',
    value: '0',
    change: '0%',
    changePeriod: 'all time',
    trend: 'up',
    iconName: 'userCheck',
    sparklineData: [0, 0, 0, 0, 0, 0, 0],
    colorTheme: 'pink'
  }
];

export const BOOKING_TREND_DATA: BookingTrendPoint[] = [];
export const BRANCH_PERFORMANCE_DATA: BranchPerformanceData[] = [];
export const RECENT_ACTIVITIES_DATA: RecentActivity[] = [];
export const POPULAR_SERVICES_DATA: PopularServiceData[] = [];
export const RECENT_BOOKINGS_DATA: Booking[] = [];
export const BRANCHES_LIST: Branch[] = [];
export const SERVICES_LIST: Service[] = [];
export const USERS_LIST: UserItem[] = [];

import type { Booking } from '../types/booking';
import type { MetricCardData, BookingTrendPoint, BranchPerformanceData, RecentActivity, PopularServiceData } from '../types/dashboard';
import type { Branch } from '../types/branch';
import type { Service } from '../types/service';
import type { UserItem } from '../types/user';

export const METRIC_CARDS_DATA: MetricCardData[] = [
  {
    id: 'total-bookings',
    title: 'Total Bookings',
    value: '5,432',
    change: '12%',
    changePeriod: 'vs. last week',
    trend: 'up',
    iconName: 'users',
    sparklineData: [20, 35, 25, 45, 30, 55, 40, 65, 80],
    colorTheme: 'blue'
  },
  {
    id: 'todays-tickets',
    title: "Today's Tickets",
    value: '23',
    change: '8%',
    changePeriod: 'vs. yesterday',
    trend: 'up',
    iconName: 'calendar',
    sparklineData: [10, 18, 15, 22, 28, 24, 35, 42, 50],
    colorTheme: 'emerald'
  },
  {
    id: 'avg-waiting-time',
    title: 'Avg. Waiting Time',
    value: '156s',
    change: '18%',
    changePeriod: 'vs. last week',
    trend: 'down',
    iconName: 'clock',
    sparklineData: [60, 50, 55, 40, 48, 32, 28, 35, 20],
    colorTheme: 'purple'
  },
  {
    id: 'service-accuracy',
    title: 'Service Accuracy',
    value: '142',
    change: '9%',
    changePeriod: 'vs. last week',
    trend: 'up',
    iconName: 'check',
    sparklineData: [30, 40, 35, 50, 45, 60, 55, 70, 85],
    colorTheme: 'amber'
  },
  {
    id: 'total-customers',
    title: 'Total Customers',
    value: '1,240',
    change: '14%',
    changePeriod: 'vs. last week',
    trend: 'up',
    iconName: 'userCheck',
    sparklineData: [25, 30, 45, 40, 55, 60, 75, 70, 90],
    colorTheme: 'pink'
  }
];

// 20-Point Chart Data matching the exact waveform from the reference screenshot
export const BOOKING_TREND_DATA: BookingTrendPoint[] = [
  { date: '1', totalBookings: 5, completed: 3 },
  { date: '2', totalBookings: 12, completed: 8 },
  { date: '3', totalBookings: 9, completed: 10 },
  { date: '4', totalBookings: 15, completed: 11 },
  { date: '5', totalBookings: 11, completed: 14 },
  { date: '6', totalBookings: 16, completed: 18 },
  { date: '7', totalBookings: 24, completed: 21 },
  { date: '8', totalBookings: 29, completed: 25 },
  { date: '9', totalBookings: 31, completed: 28 },
  { date: '10', totalBookings: 16, completed: 22 },
  { date: '11', totalBookings: 17, completed: 16 },
  { date: '12', totalBookings: 27, completed: 20 },
  { date: '13', totalBookings: 39.79, completed: 35.01 }, // Hovered point in screenshot!
  { date: '14', totalBookings: 43, completed: 41 },
  { date: '15', totalBookings: 37, completed: 44 },
  { date: '16', totalBookings: 30, completed: 26 },
  { date: '17', totalBookings: 36, completed: 29 },
  { date: '18', totalBookings: 31, completed: 34 },
  { date: '19', totalBookings: 38, completed: 33 },
  { date: '20', totalBookings: 58, completed: 48 }
];

export const BRANCH_PERFORMANCE_DATA: BranchPerformanceData[] = [
  { id: '1', name: 'Main Branch', rating: 4.8, avgWaitMinutes: 12, status: 'On Time', efficiencyPercent: 92, iconType: 'bank' },
  { id: '2', name: 'Gulshan Branch', rating: 4.6, avgWaitMinutes: 18, status: 'On Time', efficiencyPercent: 86, iconType: 'pin' },
  { id: '3', name: 'Dhanmondi Branch', rating: 4.4, avgWaitMinutes: 28, status: 'Slight Delay', efficiencyPercent: 74, iconType: 'building' },
  { id: '4', name: 'Uttara Branch', rating: 4.2, avgWaitMinutes: 32, status: 'On Time', efficiencyPercent: 80, iconType: 'location' },
  { id: '5', name: 'Mirpur Branch', rating: 3.9, avgWaitMinutes: 45, status: 'Busy', efficiencyPercent: 65, iconType: 'store' }
];

export const RECENT_ACTIVITIES_DATA: RecentActivity[] = [
  { id: 'act-1', title: 'New booking received', subtitle: 'Patient: Ayesha Rahman', timeAgo: '2 min ago', type: 'booking' },
  { id: 'act-2', title: 'Walk-in customer', subtitle: 'Counter 3 - General Service', timeAgo: '8 min ago', type: 'walkin' },
  { id: 'act-3', title: 'Service completed', subtitle: 'Ticket #BK-1043', timeAgo: '12 min ago', type: 'service' },
  { id: 'act-4', title: 'New user added', subtitle: 'Dr. Nasrin Sultana', timeAgo: '18 min ago', type: 'user' },
  { id: 'act-5', title: 'Queue limit reached', subtitle: 'Mirpur Branch - General Service', timeAgo: '25 min ago', type: 'alert' }
];

export const POPULAR_SERVICES_DATA: PopularServiceData[] = [
  { id: 'srv-1', name: 'General Consultation', bookingsCount: 842, growthPercent: 12, iconType: 'consultation' },
  { id: 'srv-2', name: 'Lab Test', bookingsCount: 621, growthPercent: 9, iconType: 'lab' },
  { id: 'srv-3', name: 'Dental Checkup', bookingsCount: 468, growthPercent: 8, iconType: 'dental' },
  { id: 'srv-4', name: 'Physiotherapy', bookingsCount: 367, growthPercent: 11, iconType: 'physio' },
  { id: 'srv-5', name: 'Specialist Consultation', bookingsCount: 298, growthPercent: 6, iconType: 'specialist' }
];

export const RECENT_BOOKINGS_DATA: Booking[] = [
  { id: 'b1', ticketNumber: '#BK-1048', customerName: 'Anika Rahman', customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', serviceName: 'General Consultation', branchName: 'Main Branch', status: 'Waiting', timeSlot: '10:24 AM', date: '2025-04-23', customerPhone: '+880 1712 345678' },
  { id: 'b2', ticketNumber: '#BK-1047', customerName: 'Rafiqul Hasan', customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', serviceName: 'Lab Test', branchName: 'Gulshan Branch', status: 'Completed', timeSlot: '09:56 AM', date: '2025-04-23', customerPhone: '+880 1819 876543' },
  { id: 'b3', ticketNumber: '#BK-1046', customerName: 'Shanta Akter', customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', serviceName: 'Dental Checkup', branchName: 'Dhanmondi Branch', status: 'Waiting', timeSlot: '09:42 AM', date: '2025-04-23', customerPhone: '+880 1911 223344' },
  { id: 'b4', ticketNumber: '#BK-1045', customerName: 'Tariq Ahmed', customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', serviceName: 'Specialist Consultation', branchName: 'Uttara Branch', status: 'In Progress', timeSlot: '09:28 AM', date: '2025-04-23', customerPhone: '+880 1552 998877' },
  { id: 'b5', ticketNumber: '#BK-1044', customerName: 'Nusrat Jahan', customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', serviceName: 'Physiotherapy', branchName: 'Mirpur Branch', status: 'Completed', timeSlot: '09:12 AM', date: '2025-04-23', customerPhone: '+880 1673 445566' },
  { id: 'b6', ticketNumber: '#BK-1043', customerName: 'Mahmudul Hoque', customerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', serviceName: 'General Consultation', branchName: 'Main Branch', status: 'Completed', timeSlot: '08:50 AM', date: '2025-04-23', customerPhone: '+880 1711 001122' },
  { id: 'b7', ticketNumber: '#BK-1042', customerName: 'Farhana Yeasmin', customerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', serviceName: 'Lab Test', branchName: 'Gulshan Branch', status: 'Cancelled', timeSlot: '08:35 AM', date: '2025-04-23', customerPhone: '+880 1812 334455' },
  { id: 'b8', ticketNumber: '#BK-1041', customerName: 'Kamrul Islam', customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', serviceName: 'Eye Checkup', branchName: 'Dhanmondi Branch', status: 'Completed', timeSlot: '08:15 AM', date: '2025-04-23', customerPhone: '+880 1913 556677' },
  { id: 'b9', ticketNumber: '#BK-1040', customerName: 'Sabrina Khan', customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', serviceName: 'General Consultation', branchName: 'Main Branch', status: 'Waiting', timeSlot: '08:00 AM', date: '2025-04-23', customerPhone: '+880 1715 667788' },
  { id: 'b10', ticketNumber: '#BK-1039', customerName: 'Zubair Ahmed', customerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', serviceName: 'Lab Test', branchName: 'Gulshan Branch', status: 'Completed', timeSlot: '07:45 AM', date: '2025-04-23', customerPhone: '+880 1818 778899' },
  { id: 'b11', ticketNumber: '#BK-1038', customerName: 'Nadia Islam', customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', serviceName: 'Dental Checkup', branchName: 'Dhanmondi Branch', status: 'In Progress', timeSlot: '07:30 AM', date: '2025-04-23', customerPhone: '+880 1919 889900' },
  { id: 'b12', ticketNumber: '#BK-1037', customerName: 'Mehedi Hasan', customerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', serviceName: 'Specialist Consultation', branchName: 'Uttara Branch', status: 'Waiting', timeSlot: '07:15 AM', date: '2025-04-23', customerPhone: '+880 1555 990011' },
  { id: 'b13', ticketNumber: '#BK-1036', customerName: 'Sadia Chowdhury', customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', serviceName: 'Physiotherapy', branchName: 'Mirpur Branch', status: 'Completed', timeSlot: '07:00 AM', date: '2025-04-23', customerPhone: '+880 1677 001122' },
  { id: 'b14', ticketNumber: '#BK-1035', customerName: 'Tanvir Rahman', customerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', serviceName: 'General Consultation', branchName: 'Main Branch', status: 'Completed', timeSlot: '06:45 AM', date: '2025-04-23', customerPhone: '+880 1718 112233' },
  { id: 'b15', ticketNumber: '#BK-1034', customerName: 'Farhan Ali', customerAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80', serviceName: 'Lab Test', branchName: 'Gulshan Branch', status: 'Cancelled', timeSlot: '06:30 AM', date: '2025-04-23', customerPhone: '+880 1813 223344' },
  { id: 'b16', ticketNumber: '#BK-1033', customerName: 'Rumana Parveen', customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', serviceName: 'Dental Checkup', branchName: 'Dhanmondi Branch', status: 'Waiting', timeSlot: '06:15 AM', date: '2025-04-23', customerPhone: '+880 1914 334455' },
  { id: 'b17', ticketNumber: '#BK-1032', customerName: 'Asif Iqbal', customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', serviceName: 'Eye Checkup', branchName: 'Uttara Branch', status: 'In Progress', timeSlot: '06:00 AM', date: '2025-04-23', customerPhone: '+880 1556 445566' },
  { id: 'b18', ticketNumber: '#BK-1031', customerName: 'Kazi Nazrul', customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', serviceName: 'Physiotherapy', branchName: 'Mirpur Branch', status: 'Completed', timeSlot: '05:45 AM', date: '2025-04-23', customerPhone: '+880 1678 556677' },
  { id: 'b19', ticketNumber: '#BK-1030', customerName: 'Naima Siddique', customerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', serviceName: 'Specialist Consultation', branchName: 'Main Branch', status: 'Waiting', timeSlot: '05:30 AM', date: '2025-04-23', customerPhone: '+880 1719 667788' },
  { id: 'b20', ticketNumber: '#BK-1029', customerName: 'Syed Hasan', customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', serviceName: 'General Consultation', branchName: 'Gulshan Branch', status: 'Completed', timeSlot: '05:15 AM', date: '2025-04-23', customerPhone: '+880 1814 778899' },
  { id: 'b21', ticketNumber: '#BK-1028', customerName: 'Laila Arjumand', customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', serviceName: 'Lab Test', branchName: 'Dhanmondi Branch', status: 'In Progress', timeSlot: '05:00 AM', date: '2025-04-23', customerPhone: '+880 1915 889900' },
  { id: 'b22', ticketNumber: '#BK-1027', customerName: 'Imtiaz Mahmud', customerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', serviceName: 'Dental Checkup', branchName: 'Uttara Branch', status: 'Completed', timeSlot: '04:45 AM', date: '2025-04-23', customerPhone: '+880 1557 990011' },
  { id: 'b23', ticketNumber: '#BK-1026', customerName: 'Roksana Begum', customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', serviceName: 'Eye Checkup', branchName: 'Mirpur Branch', status: 'Waiting', timeSlot: '04:30 AM', date: '2025-04-23', customerPhone: '+880 1679 001122' },
  { id: 'b24', ticketNumber: '#BK-1025', customerName: 'Faisal Khan', customerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', serviceName: 'General Consultation', branchName: 'Main Branch', status: 'Completed', timeSlot: '04:15 AM', date: '2025-04-23', customerPhone: '+880 1720 112233' },
  { id: 'b25', ticketNumber: '#BK-1024', customerName: 'Jannatul Ferdous', customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', serviceName: 'Physiotherapy', branchName: 'Gulshan Branch', status: 'In Progress', timeSlot: '04:00 AM', date: '2025-04-23', customerPhone: '+880 1815 223344' },
  { id: 'b26', ticketNumber: '#BK-1023', customerName: 'Mahir Shahriar', customerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', serviceName: 'Lab Test', branchName: 'Dhanmondi Branch', status: 'Completed', timeSlot: '03:45 AM', date: '2025-04-23', customerPhone: '+880 1916 334455' },
  { id: 'b27', ticketNumber: '#BK-1022', customerName: 'Tamanna Yasmin', customerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', serviceName: 'Specialist Consultation', branchName: 'Uttara Branch', status: 'Waiting', timeSlot: '03:30 AM', date: '2025-04-23', customerPhone: '+880 1558 445566' },
  { id: 'b28', ticketNumber: '#BK-1021', customerName: 'Zahid Hossain', customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', serviceName: 'Dental Checkup', branchName: 'Mirpur Branch', status: 'Completed', timeSlot: '03:15 AM', date: '2025-04-23', customerPhone: '+880 1680 556677' }
];

export const BRANCHES_LIST: Branch[] = [
  { id: 'br-1', name: 'Main Branch', location: 'Dhaka City Center', manager: 'Rahul Amin', contactNumber: '+880 2 9876543', activeCounters: 8, rating: 4.8, avgWaitTime: '12 min', status: 'On Time', todayTotalBookings: 340 },
  { id: 'br-2', name: 'Gulshan Branch', location: 'Road 11, Gulshan 1', manager: 'Dr. Nasrin Sultana', contactNumber: '+880 2 8765432', activeCounters: 6, rating: 4.6, avgWaitTime: '18 min', status: 'On Time', todayTotalBookings: 210 },
  { id: 'br-3', name: 'Dhanmondi Branch', location: 'Satmasjid Road', manager: 'Tanvir Hossain', contactNumber: '+880 2 7654321', activeCounters: 5, rating: 4.4, avgWaitTime: '28 min', status: 'Slight Delay', todayTotalBookings: 180 },
  { id: 'br-4', name: 'Uttara Branch', location: 'Sector 3, Uttara', manager: 'Farzana Karim', contactNumber: '+880 2 6543210', activeCounters: 4, rating: 4.2, avgWaitTime: '32 min', status: 'On Time', todayTotalBookings: 145 },
  { id: 'br-5', name: 'Mirpur Branch', location: 'Mirpur 10 Circle', manager: 'Shahadat Hossain', contactNumber: '+880 2 5432109', activeCounters: 4, rating: 3.9, avgWaitTime: '45 min', status: 'Busy', todayTotalBookings: 195 }
];

export const SERVICES_LIST: Service[] = [
  { id: 's1', name: 'General Consultation', category: 'Medical', durationMinutes: 20, price: '$30', totalBookingsThisMonth: 842, growthRate: 12, status: 'Active' },
  { id: 's2', name: 'Lab Test & Blood Work', category: 'Diagnostics', durationMinutes: 15, price: '$45', totalBookingsThisMonth: 621, growthRate: 9, status: 'Active' },
  { id: 's3', name: 'Dental Checkup', category: 'Dental', durationMinutes: 30, price: '$60', totalBookingsThisMonth: 468, growthRate: 8, status: 'Active' },
  { id: 's4', name: 'Physiotherapy Session', category: 'Therapy', durationMinutes: 45, price: '$75', totalBookingsThisMonth: 367, growthRate: 11, status: 'Active' },
  { id: 's5', name: 'Specialist Consultation', category: 'Specialist', durationMinutes: 30, price: '$100', totalBookingsThisMonth: 298, growthRate: 6, status: 'Active' }
];

export const USERS_LIST: UserItem[] = [
  {
    id: 'u1',
    name: 'Darrell Steward',
    email: 'darrell@example.com',
    role: 'Customer',
    branch: 'Main Branch',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    phone: '(+337) 55 55 87 24',
    country: 'USA',
    countryFlag: '🇺🇸',
    balance: '$167.77',
    totalInvoices: 0,
    createdOn: 'May 8, 2014',
    status: 'Active',
    joinedDate: '2014-05-08'
  },
  {
    id: 'u2',
    name: 'Ralph Edwards',
    email: 'ralph@example.com',
    role: 'Customer',
    branch: 'Gulshan Branch',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    phone: '(+336) 55 51 05 09',
    country: 'Canada',
    countryFlag: '🇨🇦',
    balance: '$5,872.78',
    totalInvoices: 5,
    createdOn: 'April 28, 2016',
    status: 'Failed',
    joinedDate: '2016-04-28'
  },
  {
    id: 'u3',
    name: 'Leslie Alexander',
    email: 'leslie@example.com',
    role: 'Customer',
    branch: 'Dhanmondi Branch',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    phone: '(+336) 55 53 19 16',
    country: 'UK',
    countryFlag: '🇬🇧',
    balance: '-$2,782.78',
    totalInvoices: 4,
    createdOn: 'December 19, 2013',
    status: 'Active',
    joinedDate: '2013-12-19'
  },
  {
    id: 'u4',
    name: 'Courtney Henry',
    email: 'courtney@example.com',
    role: 'Customer',
    branch: 'Uttara Branch',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    phone: '(+337) 45 55 87 71',
    country: 'Germany',
    countryFlag: '🇩🇪',
    balance: '$329.78',
    totalInvoices: 5,
    createdOn: 'August 2, 2017',
    status: 'Failed',
    joinedDate: '2017-08-02'
  },
  {
    id: 'u5',
    name: 'Floyd Miles',
    email: 'floyd@example.com',
    role: 'Customer',
    branch: 'Mirpur Branch',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    phone: '(+336) 55 59 32 88',
    country: 'France',
    countryFlag: '🇫🇷',
    balance: '$12.98',
    totalInvoices: 1,
    createdOn: 'December 2, 2018',
    status: 'Active',
    joinedDate: '2018-12-02'
  },
  {
    id: 'u6',
    name: 'Devon Lane',
    email: 'devon@example.com',
    role: 'Customer',
    branch: 'Main Branch',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    phone: '(+337) 55 55 65 33',
    country: 'Argentina',
    countryFlag: '🇦🇷',
    balance: '$32,788.89',
    totalInvoices: 1,
    createdOn: 'September 24, 2017',
    status: 'Failed',
    joinedDate: '2017-09-24'
  },
  {
    id: 'u7',
    name: 'Guy Hawkins',
    email: 'guy@example.com',
    role: 'Customer',
    branch: 'Gulshan Branch',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    phone: '(+337) 00 55 59 27',
    country: 'India',
    countryFlag: '🇮🇳',
    balance: '$1,782.22',
    totalInvoices: 3,
    createdOn: 'May 20, 2015',
    status: 'Active',
    joinedDate: '2015-05-20'
  }
];

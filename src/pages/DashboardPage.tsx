import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { PageSkeleton } from '../components/ui/PageSkeleton';
import { MetricCard } from '../components/dashboard/MetricCard';
import { BookingTrendChart } from '../components/dashboard/BookingTrendChart';
import { BranchPerformance } from '../components/dashboard/BranchPerformance';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { PopularServices } from '../components/dashboard/PopularServices';
import { ManageBanner } from '../components/dashboard/ManageBanner';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { CustomerCell } from '../components/ui/CustomerCell';
import type { TableColumn } from '../types/table';
import type { Booking } from '../types/booking';
import type { MetricCardData } from '../types/dashboard';
import type { NavPageId } from '../types/navigation';
import { useBookings } from '../api/hooks/bookingHooks';
import {
  BOOKING_TREND_DATA,
  BRANCH_PERFORMANCE_DATA,
  RECENT_ACTIVITIES_DATA,
  POPULAR_SERVICES_DATA
} from '../data/mockData';

export interface DashboardPageProps {
  onNavigate: (pageId: NavPageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { data: bookingsList = [], isLoading } = useBookings();

  const dynamicMetrics = useMemo<MetricCardData[]>(() => {
    const total = bookingsList.length;
    const waiting = bookingsList.filter((b) => b.status === 'Waiting').length;
    const completed = bookingsList.filter((b) => b.status === 'Completed').length;
    const inProgress = bookingsList.filter((b) => b.status === 'In Progress').length;

    return [
      {
        id: 'total-bookings',
        title: 'Total Bookings',
        value: total.toString(),
        change: total > 0 ? '+100%' : '0%',
        changePeriod: 'all time',
        trend: 'up',
        iconName: 'users',
        sparklineData: [0, 0, 0, 0, 0, 0, total],
        colorTheme: 'blue'
      },
      {
        id: 'todays-tickets',
        title: "Active In Queue",
        value: (waiting + inProgress).toString(),
        change: '0%',
        changePeriod: 'today',
        trend: 'up',
        iconName: 'calendar',
        sparklineData: [0, 0, 0, 0, 0, 0, waiting + inProgress],
        colorTheme: 'emerald'
      },
      {
        id: 'avg-waiting-time',
        title: 'Completed Services',
        value: completed.toString(),
        change: '0%',
        changePeriod: 'today',
        trend: 'up',
        iconName: 'check',
        sparklineData: [0, 0, 0, 0, 0, 0, completed],
        colorTheme: 'purple'
      },
      {
        id: 'service-accuracy',
        title: 'Waiting Customers',
        value: waiting.toString(),
        change: '0%',
        changePeriod: 'today',
        trend: 'up',
        iconName: 'clock',
        sparklineData: [0, 0, 0, 0, 0, 0, waiting],
        colorTheme: 'amber'
      },
      {
        id: 'total-customers',
        title: 'Total Customers',
        value: total.toString(),
        change: '0%',
        changePeriod: 'all time',
        trend: 'up',
        iconName: 'userCheck',
        sparklineData: [0, 0, 0, 0, 0, 0, total],
        colorTheme: 'pink'
      }
    ];
  }, [bookingsList]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Columns definition for Recent Bookings Global Table
  const bookingColumns: TableColumn<Booking>[] = [
    {
      key: 'ticketNumber',
      header: '#',
      sortable: true,
      width: '90px',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: '#334155' }}>{row.ticketNumber}</span>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      width: '220px',
      accessor: (row) => (
        <CustomerCell
          name={row.customerName}
          avatarUrl={row.customerAvatar}
          phone={row.customerPhone}
        />
      )
    },
    {
      key: 'serviceName',
      header: 'Service',
      sortable: true,
      accessor: (row) => <span style={{ color: '#475569' }}>{row.serviceName}</span>
    },
    {
      key: 'branchName',
      header: 'Branch',
      sortable: true,
      accessor: (row) => <span style={{ color: '#64748b' }}>{row.branchName}</span>
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (row) => <Badge label={row.status} />
    },
    {
      key: 'timeSlot',
      header: 'Time',
      sortable: true,
      accessor: (row) => <span style={{ color: '#64748b', fontSize: 11 }}>{row.timeSlot}</span>
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      width: '70px',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <button
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Viewing ticket ${row.ticketNumber} for ${row.customerName}`);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: 3
            }}
          >
            <MapPin size={13} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      {/* Top 5 Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {dynamicMetrics.map((card) => (
          <MetricCard key={card.id} data={card} />
        ))}
      </div>

      {/* Main Dashboard Grid with Aligned Card Corners & Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Left Column: Trend Chart & Table (Expanded to 9 columns) */}
        <div className="lg:col-span-9 flex flex-col gap-3 sm:gap-4">
          <BookingTrendChart data={BOOKING_TREND_DATA} />

          {/* TanStack Table with 5 data rows per page and Pagination enabled */}
          <GlobalTable<Booking>
            data={bookingsList}
            columns={bookingColumns}
            keyExtractor={(row) => row.id}
            title="Recent Bookings"
            enableSearch={true}
            enablePagination={true}
            defaultItemsPerPage={10}
            itemsPerPageOptions={[5, 10, 20]}
          />
                    <ManageBanner onGoToSettings={() => onNavigate('settings')} />

        </div>

        {/* Right Column: Branch Performance, Services, Activities, Banner (Decreased to 3 columns) */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <BranchPerformance
            branches={BRANCH_PERFORMANCE_DATA}
            onViewAll={() => onNavigate('branches')}
          />

          <PopularServices
            services={POPULAR_SERVICES_DATA}
            onViewAll={() => onNavigate('services')}
          />

          <RecentActivities
            activities={RECENT_ACTIVITIES_DATA}
            onViewAll={() => onNavigate('queue')}
          />

        </div>
      </div>
    </div>
  );
};

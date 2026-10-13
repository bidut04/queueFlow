import React from 'react';
import { Clock, Users, CheckCircle2 } from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { CustomerCell } from '../components/ui/CustomerCell';
import type { TableColumn } from '../types/table';
import type { Booking } from '../types/booking';
import { RECENT_BOOKINGS_DATA } from '../data/mockData';

export const QueuePage: React.FC = () => {
  const columns: TableColumn<Booking>[] = [
    {
      key: 'ticketNumber',
      header: 'Queue No.',
      sortable: true,
      accessor: (row) => <span style={{ fontWeight: 800, color: '#2563eb' }}>{row.ticketNumber}</span>
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
      header: 'Service Requested',
      sortable: true,
      accessor: (row) => <span style={{ color: '#334155' }}>{row.serviceName}</span>
    },
    {
      key: 'branchName',
      header: 'Assigned Branch',
      sortable: true,
      accessor: (row) => <span style={{ color: '#64748b' }}>{row.branchName}</span>
    },
    {
      key: 'status',
      header: 'Queue Status',
      sortable: true,
      accessor: (row) => <Badge label={row.status} />
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Real-Time Queue Monitor</h1>

      </div>

      {/* Queue Stat Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        <div className="qf-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="#3b82f6" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Currently Waiting</p>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>18 Customers</h3>
          </div>
        </div>

        <div className="qf-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#10b981" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Served Today</p>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>142 Served</h3>
          </div>
        </div>

        <div className="qf-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} color="#8b5cf6" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Average Service Speed</p>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>4.2 mins / customer</h3>
          </div>
        </div>
      </div>

      <GlobalTable<Booking>
        data={RECENT_BOOKINGS_DATA}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="Live Queue Feed"
        searchPlaceholder="Search active queue..."
        enableSearch={true}
        enablePagination={true}
      />
    </div>
  );
};

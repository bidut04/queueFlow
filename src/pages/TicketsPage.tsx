import React, { useState } from 'react';
import { Play, CheckCircle } from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CustomerCell } from '../components/ui/CustomerCell';
import type { TableColumn } from '../types/table';
import type { Booking } from '../types/booking';
import { RECENT_BOOKINGS_DATA } from '../data/mockData';

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Booking[]>(RECENT_BOOKINGS_DATA);

  const handleCallNextTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'In Progress' } : t))
    );
  };

  const handleCompleteTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Completed' } : t))
    );
  };

  const columns: TableColumn<Booking>[] = [
    {
      key: 'ticketNumber',
      header: 'Ticket #',
      sortable: true,
      accessor: (row) => <span style={{ fontWeight: 700, fontSize: 11.5, color: '#2563eb' }}>{row.ticketNumber}</span>
    },
    {
      key: 'customerName',
      header: 'Patient / Customer',
      sortable: true,
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
      accessor: (row) => <span style={{ color: '#334155' }}>{row.serviceName}</span>
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
      key: 'actions',
      header: 'Counter Actions',
      align: 'center',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {row.status === 'Waiting' && (
            <Button size="sm" variant="primary" icon={<Play size={12} />} onClick={() => handleCallNextTicket(row.id)}>
              Call Counter
            </Button>
          )}
          {row.status === 'In Progress' && (
            <Button size="sm" variant="outline" icon={<CheckCircle size={12} />} onClick={() => handleCompleteTicket(row.id)}>
              Mark Done
            </Button>
          )}
          {row.status === 'Completed' && (
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>Completed</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Ticket Dispenser & Counters</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Live queue ticket status, counter calling, and service completion logs.
          </p>
        </div>
      </div>

      <GlobalTable<Booking>
        data={tickets}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="Live Counter Queue Tickets"
        searchPlaceholder="Search ticket number or customer..."
        enableSearch={true}
        enablePagination={true}
      />
    </div>
  );
};

import React from 'react';
import { Layers3, Users as UsersIcon } from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import type { TableColumn } from '../types/table';
import type { UserItem } from '../types/user';
import { useUsers } from '../api/hooks/userHooks';

export const UsersPage: React.FC = () => {
  const { data: users = [], isLoading } = useUsers();

  const columns: TableColumn<UserItem>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={row.avatarUrl}
            alt={row.name}
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</span>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: true,
      accessor: (row) => <span style={{ color: '#64748b', fontSize: 11.5 }}>{row.phone}</span>
    },
    {
      key: 'country',
      header: 'Country',
      sortable: true,
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13 }}>{row.countryFlag}</span>
          <span style={{ color: '#334155', fontWeight: 500 }}>{row.country}</span>
        </div>
      )
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      accessor: (row) => (
        <span style={{
          fontWeight: 600,
          color: row.balance.startsWith('-') ? '#e11d48' : '#334155'
        }}>
          {row.balance}
        </span>
      )
    },
    {
      key: 'totalInvoices',
      header: 'Total Invoice',
      sortable: true,
      align: 'center',
      accessor: (row) => <span style={{ color: '#475569' }}>{row.totalInvoices}</span>
    },
    {
      key: 'createdOn',
      header: 'Created On',
      sortable: true,
      accessor: (row) => <span style={{ color: '#64748b', fontSize: 11.5 }}>{row.createdOn}</span>
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (row) => {
        const isActive = row.status === 'Active';
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 9px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: isActive ? '#ecfdf5' : '#ffe4e6',
              color: isActive ? '#059669' : '#e11d48'
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'currentColor' }} />
            {row.status}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      width: '60px',
      accessor: (row) => (
        <button
          title="View Customer"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Customer details for ${row.name}`);
          }}
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            backgroundColor: '#eff6ff',
            border: 'none',
            color: '#2563eb',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Layers3 size={13} />
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Page Title Header matching screenshot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UsersIcon size={12} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>Customers</span>
        </div>
        <h1 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Customer Management
        </h1>
        <p style={{ fontSize: 12, color: '#64748b' }}>
          View and manage all your customers in one place.
        </p>
      </div>

      {/* Main Table Matching Screenshot */}
      <GlobalTable<UserItem>
        data={users}
        columns={columns}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        title="Total Customers (1,240)"
        searchPlaceholder="Search customer..."
        enableSearch={true}
        enablePagination={true}
        defaultItemsPerPage={7}
      />
    </div>
  );
};

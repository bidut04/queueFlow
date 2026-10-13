import React, { useState, useMemo } from 'react';
import { Plus, Eye, Trash2, X, ChevronUp } from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Combobox } from '../components/ui/Combobox';
import { CustomerCell } from '../components/ui/CustomerCell';
import type { TableColumn } from '../types/table';
import type { Booking } from '../types/booking';
import { RECENT_BOOKINGS_DATA } from '../data/mockData';

const SERVICE_OPTIONS = [
  'General Consultation',
  'KYC Verification',
  'Lab Test',
  'Dental Checkup',
  'Physiotherapy',
  'Specialist Consultation',
  'Cash Deposit',
  'Loan Consultation'
];

export const BookingsPage: React.FC = () => {
  const [bookingsList, setBookingsList] = useState<Booking[]>(RECENT_BOOKINGS_DATA);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Form Fields
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newService, setNewService] = useState<string>('General Consultation');
  const [newGender, setNewGender] = useState<string>('Male');

  const filteredBookings = useMemo(() => {
    if (selectedStatusFilter === 'All') return bookingsList;
    return bookingsList.filter((b) => b.status === selectedStatusFilter);
  }, [bookingsList, selectedStatusFilter]);

  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    const newTicketNum = `#BK-${1050 + bookingsList.length}`;
    const newBookingItem: Booking = {
      id: `booking-${Date.now()}`,
      ticketNumber: newTicketNum,
      customerName: newCustomerName,
      serviceName: newService,
      branchName: 'Main Branch',
      status: 'Waiting',
      timeSlot: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      customerPhone: newPhone || '+880 1700 000000'
    };

    setBookingsList([newBookingItem, ...bookingsList]);
    setNewCustomerName('');
    setNewPhone('');
    setShowForm(false);
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookingsList((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const columns: TableColumn<Booking>[] = [
    {
      key: 'ticketNumber',
      header: 'Ticket #',
      sortable: true,
      accessor: (row) => <span style={{ fontWeight: 700, color: '#2563eb' }}>{row.ticketNumber}</span>
    },
    {
      key: 'customerName',
      header: 'Customer Name',
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
      header: 'Service Type',
      sortable: true,
      accessor: (row) => <span style={{ fontWeight: 500, color: '#334155' }}>{row.serviceName}</span>
    },
    {
      key: 'branchName',
      header: 'Branch Location',
      sortable: true,
      accessor: (row) => <span style={{ color: '#64748b' }}>{row.branchName}</span>
    },
    {
      key: 'status',
      header: 'Current Status',
      sortable: true,
      accessor: (row) => <Badge label={row.status} />
    },
    {
      key: 'timeSlot',
      header: 'Booked Time',
      sortable: true,
      accessor: (row) => <span style={{ fontSize: 12, color: '#64748b' }}>{row.timeSlot}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button
            title="View Details"
            onClick={() => setSelectedBooking(row)}
            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 4 }}
          >
            <Eye size={16} />
          </button>
          <button
            title="Delete"
            onClick={() => handleDeleteBooking(row.id)}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Top Page Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Bookings Directory</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Manage patient and customer appointments across all branches.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            icon={showForm ? <ChevronUp size={15} /> : <Plus size={15} />}
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? 'Hide Form' : 'New Booking'}
          </Button>
        </div>
      </div>

      {/* Horizontal Flex Quick Booking Entry Form (One Line Layout) */}
      {showForm && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '14px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Create New Booking Entry</h3>
            <button
              onClick={() => setShowForm(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 2 }}
              title="Hide Form"
            >
              <X size={16} />
            </button>
          </div>

          {/* Single Row Horizontal Flex Form */}
          <form onSubmit={handleManualBookingSubmit} style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
            {/* Customer Name */}
            <div style={{ flex: '1 1 180px', minWidth: 150 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Customer Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zahid Hasan"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>

            {/* Phone Number */}
            <div style={{ flex: '1 1 160px', minWidth: 140 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Phone Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="+880 1700 000000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>

            {/* Service Combobox */}
            <div style={{ flex: '1 1 180px', minWidth: 160 }}>
              <Combobox
                label="Select Service *"
                options={SERVICE_OPTIONS}
                value={newService}
                onChange={setNewService}
                placeholder="Select service..."
              />
            </div>

            {/* Gender Combobox */}
            <div style={{ flex: '1 1 140px', minWidth: 120 }}>
              <Combobox
                label="Gender *"
                options={['Male', 'Female', 'Other']}
                value={newGender}
                onChange={setNewGender}
                placeholder="Select gender..."
              />
            </div>

            {/* Submit & Cancel Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Global Table Component with filter toolbar */}
      <GlobalTable<Booking>
        data={filteredBookings}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="All Appointments"
        subtitle={`Showing ${filteredBookings.length} total bookings`}
        searchPlaceholder="Search by customer name, ticket # or service..."
        enableSearch={true}
        enablePagination={true}
        defaultItemsPerPage={10}
        headerActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Filter Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                fontSize: 12,
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        }
      />

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="qf-modal-overlay">
          <div className="qf-modal-content" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                Booking Details ({selectedBooking.ticketNumber})
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              <p><strong>Customer:</strong> {selectedBooking.customerName}</p>
              <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
              <p><strong>Service:</strong> {selectedBooking.serviceName}</p>
              <p><strong>Branch:</strong> {selectedBooking.branchName}</p>
              <p><strong>Status:</strong> <Badge label={selectedBooking.status} /></p>
              <p><strong>Time Slot:</strong> {selectedBooking.timeSlot}</p>
              <p><strong>Date:</strong> {selectedBooking.date}</p>
            </div>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

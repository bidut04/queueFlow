import React from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Building2,
  MapPin,
  Calendar,
  Ticket
} from 'lucide-react';
import type {
  OrganizationProfile,
  BranchProfile,
  BookingViewMode,
  PortalDisplayMode
} from '../types/portalBooking';

interface BookingFiltersBarProps {
  organizations: OrganizationProfile[];
  selectedOrgId: string;
  onSelectOrg: (orgId: string) => void;

  branches: BranchProfile[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;

  selectedDate: string;
  onDateChange: (date: string) => void;

  viewMode: BookingViewMode;
  onViewModeChange: (mode: BookingViewMode) => void;

  displayMode: PortalDisplayMode;
  onDisplayModeChange: (mode: PortalDisplayMode) => void;

  searchQuery: string;
  onSearchChange: (query: string) => void;

  statusFilter: string;
  onStatusFilterChange: (status: string) => void;

  onOpenNewAppointment: () => void;
  onOpenWalkInModal: () => void;
}

export const BookingFiltersBar: React.FC<BookingFiltersBarProps> = ({
  organizations,
  selectedOrgId,
  onSelectOrg,
  branches,
  selectedBranchId,
  onSelectBranch,
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  displayMode,
  onDisplayModeChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenNewAppointment,
  onOpenWalkInModal,
}) => {
  const currentBranch = branches.find((b) => b.id === selectedBranchId);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    onDateChange('2026-08-29'); // match mock date or current date
  };

  // Format date display like screenshot e.g. "Aug 29, 2026"
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        marginBottom: 20,
      }}
    >
      {/* Top Row: Organization & Branch Selectors + Mode Switcher + Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left: Organization & Branch pickers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Organization Select */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Building2
              size={15}
              style={{ position: 'absolute', left: 12, color: '#2563eb', pointerEvents: 'none' }}
            />
            <select
              value={selectedOrgId}
              onChange={(e) => onSelectOrg(e.target.value)}
              aria-label="Select Organization"
              style={{
                height: 38,
                paddingLeft: 34,
                paddingRight: 28,
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.type})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Select */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin
              size={15}
              style={{ position: 'absolute', left: 12, color: '#059669', pointerEvents: 'none' }}
            />
            <select
              value={selectedBranchId}
              onChange={(e) => onSelectBranch(e.target.value)}
              aria-label="Select Branch"
              style={{
                height: 38,
                paddingLeft: 34,
                paddingRight: 28,
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {branches.map((br) => (
                <option key={br.id} value={br.id}>
                  {br.name} {br.isOpenNow ? '• Open' : '• Closed'}
                </option>
              ))}
            </select>
          </div>

          {/* Active Queue pill indicator */}
          {currentBranch && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                backgroundColor: currentBranch.isOpenNow ? '#ecfdf5' : '#f1f5f9',
                color: currentBranch.isOpenNow ? '#047857' : '#64748b',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: currentBranch.isOpenNow ? '#10b981' : '#94a3b8',
                }}
              />
              <span>
                {currentBranch.activeQueueCount} in live queue (~{currentBranch.avgWaitMinutes}m wait)
              </span>
            </div>
          )}
        </div>

        {/* Right: Display Mode switcher (Calendar Operations vs Public Customer Flow) + Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* View Mode Toggle: Operations Calendar vs Customer Booking Pass */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              borderRadius: 8,
              padding: 3,
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={() => onDisplayModeChange('calendar')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: displayMode === 'calendar' ? '#ffffff' : 'transparent',
                color: displayMode === 'calendar' ? '#0f172a' : '#64748b',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: displayMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Calendar size={14} />
              <span>Staff Timetable</span>
            </button>
            <button
              onClick={() => onDisplayModeChange('customer-portal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: displayMode === 'customer-portal' ? '#ffffff' : 'transparent',
                color: displayMode === 'customer-portal' ? '#2563eb' : '#64748b',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: displayMode === 'customer-portal' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Ticket size={14} />
              <span>Customer Booking Pass</span>
            </button>
          </div>

          {/* "+ Walk-in" Button */}
          <button
            onClick={onOpenWalkInModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 38,
              padding: '0 14px',
              borderRadius: 8,
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <Plus size={15} />
            <span>Walk-in</span>
          </button>

          {/* "+ Add appointment" Primary Button (matching bright pink/magenta accent from screenshot 2) */}
          <button
            onClick={onOpenNewAppointment}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 38,
              padding: '0 16px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.25)';
            }}
          >
            <Plus size={16} />
            <span>Add Appointment</span>
          </button>
        </div>
      </div>

      {/* Middle Row (Matching Screenshot 1 & 2): Date Nav + View Switcher + Search + Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingTop: 8,
          borderTop: '1px solid #f1f5f9',
        }}
      >
        {/* Date Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleToday}
            style={{
              height: 34,
              padding: '0 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'pointer',
            }}
          >
            Today
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              padding: '2px 8px',
              backgroundColor: '#ffffff',
            }}
          >
            <button
              onClick={handlePrevDay}
              aria-label="Previous Day"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', minWidth: 100, textAlign: 'center' }}>
              {formattedDate}
            </span>
            <button
              onClick={handleNextDay}
              aria-label="Next Day"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* View Mode Buttons (Day, Week, Month, Staff) */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              borderRadius: 6,
              padding: 2,
              border: '1px solid #e2e8f0',
            }}
          >
            {(['day', 'week', 'month', 'staff'] as BookingViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                style={{
                  border: 'none',
                  backgroundColor: viewMode === mode ? '#ffffff' : 'transparent',
                  color: viewMode === mode ? '#0f172a' : '#64748b',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  padding: '5px 10px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  boxShadow: viewMode === mode ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Right Search & Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: 10, color: '#94a3b8', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search customer, ticket #, service..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: 240,
                height: 34,
                paddingLeft: 32,
                paddingRight: 10,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 12,
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#0f172a',
              }}
            />
          </div>

          {/* Status Filter Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Filter
              size={14}
              style={{ position: 'absolute', left: 10, color: '#64748b', pointerEvents: 'none' }}
            />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              aria-label="Filter by Status"
              style={{
                height: 34,
                paddingLeft: 30,
                paddingRight: 24,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 12,
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="On-going">On-going / In Service</option>
              <option value="Done">Done / Completed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="No-show">No-show</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

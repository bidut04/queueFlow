import React, { useState } from 'react';
import {
  X,
  Search,
  UserPlus,
  Ticket
} from 'lucide-react';
import type {
  OrganizationProfile,
  BranchProfile,
  ServiceOffering,
  StaffResource,
  PortalAppointment
} from '../types/portalBooking';
import { QUICK_CUSTOMERS_LIST } from '../data/portalMockData';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations: OrganizationProfile[];
  branches: BranchProfile[];
  services: ServiceOffering[];
  staffList: StaffResource[];
  selectedOrgId: string;
  selectedBranchId: string;
  preselectedStaff?: StaffResource | null;
  preselectedHour?: number | null;
  initialWalkIn?: boolean;
  onSaveAppointment: (appointment: Omit<PortalAppointment, 'id' | 'ticketNumber' | 'createdAt'>) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  organizations,
  branches,
  services,
  staffList,
  selectedOrgId,
  selectedBranchId,
  preselectedStaff,
  preselectedHour,
  initialWalkIn = false,
  onSaveAppointment,
}) => {
  if (!isOpen) return null;

  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<{ name: string; phone?: string; email?: string } | null>(null);
  const [isWalkIn, setIsWalkIn] = useState<boolean>(initialWalkIn);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState<boolean>(false);

  // Form Fields
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  const [orgId, setOrgId] = useState(selectedOrgId);
  const [branchId, setBranchId] = useState(selectedBranchId);
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [staffId, setStaffId] = useState(preselectedStaff?.id || staffList[0]?.id || '');
  const [timeHour, setTimeHour] = useState<number>(preselectedHour || 11);
  const [date, setDate] = useState('2026-08-29');
  const [notes, setNotes] = useState('');

  // Filtered branches for current org
  const availableBranches = branches.filter((b) => b.orgId === orgId);
  const availableServices = services.filter((s) => s.orgId === orgId);

  const filteredCustomers = QUICK_CUSTOMERS_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customerName = isWalkIn
      ? (selectedCustomer?.name || 'Walk-in Guest')
      : isAddingNewCustomer
      ? newCustName.trim()
      : (selectedCustomer?.name || newCustName.trim());

    if (!customerName) {
      alert('Please select or enter customer details.');
      return;
    }

    const currentOrg = organizations.find((o) => o.id === orgId);
    const currentBranch = branches.find((b) => b.id === branchId);
    const currentService = services.find((s) => s.id === serviceId);
    const currentStaff = staffList.find((s) => s.id === staffId);

    const startHStr = timeHour < 10 ? `0${timeHour}` : `${timeHour}`;
    const endHour = timeHour + 1;
    const endHStr = endHour < 10 ? `0${endHour}` : `${endHour}`;

    const ampmStart = timeHour >= 12 ? 'PM' : 'AM';
    const displayStartH = timeHour > 12 ? timeHour - 12 : timeHour === 0 ? 12 : timeHour;
    const ampmEnd = endHour >= 12 ? 'PM' : 'AM';
    const displayEndH = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour;

    const timeSlotFormatted = `${displayStartH}:00${ampmStart} - ${displayEndH}:00${ampmEnd}`;

    onSaveAppointment({
      orgId,
      orgName: currentOrg?.name || 'Apex Care',
      branchId,
      branchName: currentBranch?.name || 'Downtown Central',
      serviceId,
      serviceName: currentService?.name || "Men's Cut",
      staffId,
      staffName: currentStaff?.name || 'Marcus Reid',
      customerName,
      customerPhone: selectedCustomer?.phone || newCustPhone || '+1 (555) 234-5678',
      customerEmail: selectedCustomer?.email || newCustEmail,
      date,
      startTime: `${startHStr}:00`,
      endTime: `${endHStr}:00`,
      timeSlotFormatted,
      status: isWalkIn ? 'On-going' : 'Waiting',
      isWalkIn,
      notes,
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 540,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Bright Gradient Pill styling matching Screenshot 2) */}
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ticket size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                {isWalkIn ? 'Instant Walk-in Ticket' : 'New Appointment & Queue Booking'}
              </h2>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.9 }}>
                Direct service assignment with automated ticket dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            style={{
              border: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderRadius: 6,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Customer Selection Box (Matching Screenshot 2 popup menu) */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: 12,
              padding: 14,
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Customer</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isWalkIn}
                    onChange={(e) => {
                      setIsWalkIn(e.target.checked);
                      if (e.target.checked) setSelectedCustomer({ name: 'Walk In Guest' });
                    }}
                  />
                  <span>Walk In</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCustomer(!isAddingNewCustomer)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#2563eb',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <UserPlus size={13} />
                  <span>{isAddingNewCustomer ? 'Cancel' : '+ Add New Customer'}</span>
                </button>
              </div>
            </div>

            {isAddingNewCustomer ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  required
                  style={{
                    height: 36,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                  }}
                />
                <input
                  type="text"
                  placeholder="Phone Number *"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  style={{
                    height: 36,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                  }}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  style={{
                    height: 36,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                  }}
                />
              </div>
            ) : selectedCustomer ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {selectedCustomer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{selectedCustomer.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div>
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Type to search customer..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: 36,
                      paddingLeft: 32,
                      paddingRight: 10,
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      fontSize: 12,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Quick Customer Results */}
                <div style={{ maxHeight: 120, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {filteredCustomers.map((c) => (
                    <div
                      key={c.name}
                      onClick={() => setSelectedCustomer(c)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '6px 8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: c.color,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {c.initials}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>{c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Org & Branch Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                Organization
              </label>
              <select
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                }}
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                Branch Location
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                }}
              >
                {availableBranches.map((br) => (
                  <option key={br.id} value={br.id}>
                    {br.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service & Staff Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                Service
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                }}
              >
                {availableServices.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} ({srv.durationMinutes}m • {srv.priceFormatted})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                Assigned Specialist
              </label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                }}
              >
                {staffList.map((stf) => (
                  <option key={stf.id} value={stf.id}>
                    {stf.name} ({stf.roleTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Slot Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                Time Slot
              </label>
              <select
                value={timeHour}
                onChange={(e) => setTimeHour(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                }}
              >
                {[9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => {
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const displayH = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                  return (
                    <option key={hour} value={hour}>
                      {displayH}:00 {ampm}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Visit Notes & Special Requests (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Needs wheelchair access or priority consultation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                height: 36,
                padding: '0 10px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 12,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 38,
                padding: '0 16px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                height: 38,
                padding: '0 20px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              }}
            >
              {isWalkIn ? 'Issue Walk-in Ticket' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

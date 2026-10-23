import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Clock,
  Ticket,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  QrCode
} from 'lucide-react';
import type {
  OrganizationProfile,
  BranchProfile,
  ServiceOffering,
  StaffResource,
  PortalAppointment
} from '../types/portalBooking';

interface CustomerBookingWizardProps {
  organizations: OrganizationProfile[];
  branches: BranchProfile[];
  services: ServiceOffering[];
  staffList: StaffResource[];
  onBooked: (appointment: Omit<PortalAppointment, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  onSwitchToCalendar: () => void;
}

export const CustomerBookingWizard: React.FC<CustomerBookingWizardProps> = ({
  organizations,
  branches,
  services,
  staffList,
  onBooked,
  onSwitchToCalendar,
}) => {
  const [step, setStep] = useState<number>(1);

  // Selections
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0]?.id || '');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-29');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM - 12:00 PM');

  // Client info
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');

  // Confirmed Ticket state
  const [issuedTicket, setIssuedTicket] = useState<{
    ticketNumber: string;
    orgName: string;
    branchName: string;
    serviceName: string;
    staffName: string;
    timeSlot: string;
    date: string;
    customerName: string;
  } | null>(null);

  // Derived filtered items
  const currentOrg = organizations.find((o) => o.id === selectedOrgId);
  const availableBranches = branches.filter((b) => b.orgId === selectedOrgId);
  const currentBranch = branches.find((b) => b.id === selectedBranchId);
  const availableServices = services.filter((s) => s.orgId === selectedOrgId);
  const currentService = services.find((s) => s.id === selectedServiceId);
  const availableStaff = staffList.filter((s) => s.orgId === selectedOrgId);
  const currentStaff = staffList.find((s) => s.id === selectedStaffId);

  // Auto-select first branch when org changes
  const handleSelectOrg = (orgId: string) => {
    setSelectedOrgId(orgId);
    const orgBranches = branches.filter((b) => b.orgId === orgId);
    if (orgBranches.length > 0) {
      setSelectedBranchId(orgBranches[0].id);
    }
  };

  const handleConfirmBooking = () => {
    if (!clientName.trim()) {
      alert('Please enter your full name to generate your queue ticket.');
      return;
    }

    const ticketNo = `T-${Math.floor(100 + Math.random() * 900)}`;

    const newAppt = {
      orgId: selectedOrgId,
      orgName: currentOrg?.name || 'Apex Care',
      branchId: selectedBranchId || availableBranches[0]?.id || '',
      branchName: currentBranch?.name || availableBranches[0]?.name || 'Downtown Branch',
      serviceId: selectedServiceId || availableServices[0]?.id || '',
      serviceName: currentService?.name || 'Consultation Service',
      staffId: selectedStaffId === 'any' ? (availableStaff[0]?.id || '') : selectedStaffId,
      staffName: selectedStaffId === 'any' ? 'First Available Specialist' : (currentStaff?.name || 'Marcus Reid'),
      customerName: clientName,
      customerPhone: clientPhone || '+1 (555) 234-5678',
      customerEmail: clientEmail,
      date: selectedDate,
      startTime: '11:00',
      endTime: '12:00',
      timeSlotFormatted: selectedTimeSlot,
      status: 'Waiting' as const,
      isWalkIn: false,
    };

    onBooked(newAppt);

    setIssuedTicket({
      ticketNumber: ticketNo,
      orgName: newAppt.orgName,
      branchName: newAppt.branchName,
      serviceName: newAppt.serviceName,
      staffName: newAppt.staffName,
      timeSlot: newAppt.timeSlotFormatted,
      date: newAppt.date,
      customerName: newAppt.customerName,
    });

    setStep(6);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Wizard Progress Top Bar */}
      <div
        style={{
          padding: '20px 28px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#fafbfc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#2563eb',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Digital Queue & Appointment Pass
          </span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
            Book Your Next Service
          </h2>
        </div>

        {/* Step Indicator Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { num: 1, label: 'Org' },
            { num: 2, label: 'Branch' },
            { num: 3, label: 'Service' },
            { num: 4, label: 'Time' },
            { num: 5, label: 'Details' },
          ].map((s) => (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 20,
                backgroundColor: step === s.num ? '#2563eb' : step > s.num ? '#ecfdf5' : '#f1f5f9',
                color: step === s.num ? '#ffffff' : step > s.num ? '#059669' : '#64748b',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <span>{step > s.num ? '✓' : s.num}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Contents */}
      <div style={{ padding: 28, minHeight: 440 }}>
        {/* STEP 1: Select Organization */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                1. Select an Organization
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                Choose the institution or clinic you wish to visit
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {organizations.map((org) => {
                const isSelected = org.id === selectedOrgId;
                return (
                  <div
                    key={org.id}
                    onClick={() => handleSelectOrg(org.id)}
                    style={{
                      padding: 18,
                      borderRadius: 12,
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          backgroundColor: '#dbeafe',
                          color: '#1d4ed8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Building2 size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{org.name}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' }}>
                          {org.type} • ★ {org.rating}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                      {org.description}
                    </p>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                      {org.activeBranchesCount} active branches with live queuing
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Select Branch Location */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                2. Choose a Branch Location
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                Showing branches for <strong>{currentOrg?.name}</strong>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {availableBranches.map((branch) => {
                const isSelected = branch.id === selectedBranchId;
                return (
                  <div
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    style={{
                      padding: 18,
                      borderRadius: 12,
                      border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{branch.name}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 12,
                          backgroundColor: branch.isOpenNow ? '#dcfce7' : '#fee2e2',
                          color: branch.isOpenNow ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {branch.isOpenNow ? 'Open Now' : 'Closed'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                      <MapPin size={14} style={{ color: '#059669' }} />
                      <span>{branch.address}, {branch.city}</span>
                    </div>

                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
                      🕒 Hours: {branch.openHours}
                    </div>

                    {/* Live queue metrics */}
                    <div
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#ffffff',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ color: '#0369a1' }}>Queue: {branch.activeQueueCount} Waiting</span>
                      <span style={{ color: '#059669' }}>Est. Wait: ~{branch.avgWaitMinutes} mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Select Service Offering */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                3. Choose Service
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                Select the service you wish to schedule
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {availableServices.map((service) => {
                const isSelected = service.id === selectedServiceId;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{service.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#2563eb' }}>{service.priceFormatted}</span>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#475569',
                          backgroundColor: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: 4,
                          display: 'inline-block',
                          marginBottom: 8,
                        }}
                      >
                        {service.category}
                      </span>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                        {service.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 11, fontWeight: 600, color: '#64748b' }}>
                      <Clock size={12} />
                      <span>Estimated duration: {service.durationMinutes} minutes</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Choose Date, Time Slot & Specialist */}
        {step === 4 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                4. Select Date & Time Slot
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                Pick an available time window and specialist
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    padding: '0 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />

                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', margin: '16px 0 6px 0' }}>
                  Assigned Specialist
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    padding: '0 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                  }}
                >
                  <option value="any">First Available Specialist / Counter</option>
                  {availableStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} — {staff.roleTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                  Available Time Slots
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    '9:00 AM - 10:00 AM',
                    '10:00 AM - 11:00 AM',
                    '11:00 AM - 12:00 PM',
                    '12:00 PM - 1:00 PM',
                    '1:00 PM - 2:00 PM',
                    '2:00 PM - 3:00 PM',
                    '3:00 PM - 4:00 PM',
                    '4:00 PM - 5:00 PM',
                  ].map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: 8,
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#2563eb' : '#334155',
                          fontSize: 12,
                          fontWeight: isSelected ? 800 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Customer Details */}
        {step === 5 && (
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                5. Enter Your Contact Details
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                We will issue your digital queue pass and notify you when called
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kristin Watson"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: 42,
                    padding: '0 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Mobile Phone (for SMS Live Queue updates) *
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 234-5678"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  style={{
                    width: '100%',
                    height: 42,
                    padding: '0 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: 42,
                    padding: '0 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Order summary box */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 10,
                  padding: 14,
                  border: '1px solid #e2e8f0',
                  marginTop: 10,
                  fontSize: 12,
                }}
              >
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Summary</div>
                <div style={{ color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Service:</span>
                  <span style={{ fontWeight: 700 }}>{currentService?.name}</span>
                </div>
                <div style={{ color: '#475569', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span>Location:</span>
                  <span style={{ fontWeight: 700 }}>{currentBranch?.name}</span>
                </div>
                <div style={{ color: '#475569', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span>Time:</span>
                  <span style={{ fontWeight: 700 }}>{selectedDate} @ {selectedTimeSlot}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmed Digital Ticket Pass */}
        {step === 6 && issuedTicket && (
          <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Booking Confirmed!
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px 0' }}>
              Your digital queue pass has been generated. Show this upon arrival.
            </p>

            {/* Ticket Card Pass */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#ffffff',
                borderRadius: 16,
                padding: 24,
                textAlign: 'left',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 24,
              }}
            >
              {/* Decorative ticket notch */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
                  paddingBottom: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    {issuedTicket.orgName}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{issuedTicket.branchName}</div>
                </div>
                <div
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: 20,
                    fontWeight: 900,
                    padding: '6px 14px',
                    borderRadius: 10,
                    letterSpacing: '0.05em',
                  }}
                >
                  #{issuedTicket.ticketNumber}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Guest:</span>
                  <div style={{ fontWeight: 700 }}>{issuedTicket.customerName}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Service:</span>
                  <div style={{ fontWeight: 700 }}>{issuedTicket.serviceName}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Specialist:</span>
                  <div style={{ fontWeight: 700 }}>{issuedTicket.staffName}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Time Window:</span>
                  <div style={{ fontWeight: 700 }}>{issuedTicket.timeSlot}</div>
                </div>
              </div>

              {/* QR Code Graphic Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <QrCode size={30} />
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    Scan upon kiosk arrival for instant check-in
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <button
                onClick={onSwitchToCalendar}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                View in Staff Timetable
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setIssuedTicket(null);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: 13,
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
              >
                Book Another Service
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Bottom Navigation Buttons */}
      {step < 6 && (
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#fafbfc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 22px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleConfirmBooking}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <span>Generate Ticket & Book</span>
              <Ticket size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

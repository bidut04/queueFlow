export type BookingViewMode = 'day' | 'week' | 'month' | 'staff';
export type PortalDisplayMode = 'calendar' | 'customer-portal';
export type AppointmentStatus = 'Done' | 'On-going' | 'Waiting' | 'Confirmed' | 'Cancelled' | 'No-show';

export interface OrganizationProfile {
  id: string;
  name: string;
  legalName: string;
  slug: string;
  type: string;
  logoUrl?: string;
  rating: number;
  description: string;
  activeBranchesCount: number;
}

export interface BranchProfile {
  id: string;
  orgId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  openHours: string;
  isOpenNow: boolean;
  activeQueueCount: number;
  avgWaitMinutes: number;
}

export interface ServiceOffering {
  id: string;
  orgId: string;
  branchIds?: string[];
  name: string;
  category: string;
  durationMinutes: number;
  priceFormatted: string;
  isFree: boolean;
  description: string;
  iconName?: string;
}

export interface StaffResource {
  id: string;
  orgId: string;
  branchId: string;
  name: string;
  roleTitle: string;
  avatarUrl?: string;
  isOnline: boolean;
  colorTag?: string;
  servicesHandled: string[];
}

export interface PortalAppointment {
  id: string;
  ticketNumber: string;
  orgId: string;
  orgName: string;
  branchId: string;
  branchName: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAvatar?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:00"
  timeSlotFormatted: string; // e.g. "9:00 AM - 10:00 AM"
  status: AppointmentStatus;
  isWalkIn: boolean;
  notes?: string;
  createdAt: string;
}

export interface BookingKPIStats {
  totalAppointments: number;
  completedPercent: number;
  noShowPercent: number;
  avgWaitlistHours: number;
  waitingCount: number;
  onGoingCount: number;
}

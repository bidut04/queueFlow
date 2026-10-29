export type ServiceCategory =
  | 'all'
  | 'banks'
  | 'post-offices'
  | 'government'
  | 'clinics'
  | 'other';

export type ServiceIconType = 'bank' | 'mail' | 'government' | 'clinic' | 'other';

export type StepProgressStatus = 'served' | 'serving' | 'user' | 'upcoming';

export type BookingFlowStep =
  | 'home'
  | 'select-org'
  | 'select-service'
  | 'select-branch'
  | 'branch-details'
  | 'review-confirm'
  | 'choose-time'
  | 'confirmation'
  | 'track-queue';

export interface TenantItem {
  id: string;
  name: string;
  slug?: string;
  type: string;
  branchesCount?: number;
  distanceKm?: number;
  locality?: string;
  latitude?: number;
  longitude?: number;
  iconType?: ServiceIconType;
  imageUrl?: string;
  isPopular?: boolean;
  categoryLabel?: string;
}

export type OrganizationCategoryFilter = 'all' | 'bank' | 'government' | 'clinic' | 'mail' | 'other';
export type OrganizationDistanceFilter = 'all' | '5' | '10' | '15';

export interface NearbyStats {
  banksCount: number;
  governmentCount: number;
  serviceCentersCount: number;
}


export interface BranchItem {
  id: string;
  name: string;
  tenantId: string;
  tenantName: string;
  address: string;
  distanceKm: number;
  activeCounters: number;
  openingHours: string;
  isOpen: boolean;
  waitMinutes: number;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  availableServices?: string[];
}

export interface QueueServiceItem {
  id: string;
  name: string;
  description?: string;
  branchName: string;
  branchId?: string;
  tenantId?: string;
  tenantName?: string;
  category: ServiceCategory;
  categoryLabel: string;
  distanceKm: number;
  openingHours: string;
  estWaitMinutes: number;
  isOpen: boolean;
  iconType: ServiceIconType;
  latitude?: number;
  longitude?: number;
  activeCounters?: number;
}

export interface QueueTimelineStep {
  stepNumber: number;
  ticketNumber: string;
  label: string;
  status: StepProgressStatus;
}

export interface LiveQueuePreviewData {
  id: string;
  serviceName: string;
  branchName: string;
  isOpen: boolean;
  nowServingTicket: string;
  currentServingToken?: string;
  userTicket: string;
  positionInLine: string;
  estWaitRange: string;
  timeline: QueueTimelineStep[];
  hurryModeEnabled: boolean;
  lastUpdatedMs?: number;
}

export interface UpcomingAppointmentItem {
  id: string;
  serviceName: string;
  dateText: string;
  branchName?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface UserProfileInfo {
  name: string;
  avatarUrl: string;
  activeBookingsCount: number;
}

export interface LocationArea {
  id: string;
  label: string;
  latitude?: number;
  longitude?: number;
}

export interface CategoryTabItem {
  id: ServiceCategory;
  label: string;
  icon: string;
}

export interface UserGeoLocation {
  latitude: number;
  longitude: number;
  locality: string;
  city: string;
}

export interface BookedTokenInfo {
  tokenNumber: string;
  tenantId?: string;
  tenantName: string;
  serviceId?: string;
  serviceName: string;
  branchId?: string;
  branchName: string;
  branchAddress?: string;
  timeSlot: string;
  estWaitMinutes: number;
  peopleAhead: number;
  activeCounters: number;
  status: 'Waiting' | 'Called' | 'In Service' | 'Completed';
  bookedAt: string;
}

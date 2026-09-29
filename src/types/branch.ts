import type { BranchStatusType } from './dashboard';

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  contactNumber: string;
  activeCounters: number;
  rating: number;
  avgWaitTime: string;
  status: BranchStatusType;
  todayTotalBookings: number;
}

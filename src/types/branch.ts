import type { BranchStatusType } from './dashboard';

export type BranchStatus = BranchStatusType | 'Active' | 'Inactive';

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  contactNumber: string;
  activeCounters: number;
  rating: number;
  avgWaitTime: string;
  status: BranchStatus;
  todayTotalBookings: number;
}

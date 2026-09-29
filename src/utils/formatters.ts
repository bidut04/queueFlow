import type { BookingStatus } from '../types/booking';
import type { BranchStatusType } from '../types/dashboard';

export const getStatusBadgeClass = (status: BookingStatus | BranchStatusType | string): string => {
  switch (status) {
    case 'Waiting':
      return 'qf-badge qf-badge-waiting';
    case 'Completed':
    case 'On Time':
    case 'Active':
      return 'qf-badge qf-badge-completed';
    case 'In Progress':
      return 'qf-badge qf-badge-in-progress';
    case 'Cancelled':
    case 'Busy':
    case 'Inactive':
      return 'qf-badge qf-badge-cancelled';
    case 'Slight Delay':
      return 'qf-badge qf-badge-slight-delay';
    default:
      return 'qf-badge';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumberWithCommas = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

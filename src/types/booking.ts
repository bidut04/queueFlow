export type BookingStatus = 'Waiting' | 'Completed' | 'In Progress' | 'Cancelled';

export interface Booking {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerAvatar?: string;
  serviceName: string;
  branchName: string;
  status: BookingStatus;
  timeSlot: string;
  date: string;
  customerPhone?: string;
}

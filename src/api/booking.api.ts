import { api } from './client';
import type { Booking } from '../types/booking';
import { RECENT_BOOKINGS_DATA } from '../data/mockData';

export interface CreateBookingInput {
  customerName: string;
  serviceName: string;
  branchName: string;
  timeSlot?: string;
  date?: string;
  customerPhone?: string;
  customerAvatar?: string;
  notes?: string;
}

let localBookings: Booking[] = [...RECENT_BOOKINGS_DATA];

export const bookingApi = {
  getBookings: async (branchId?: string, statusFilter?: string): Promise<Booking[]> => {
    try {
      const endpoint = branchId ? `/bookings/branch/${branchId}` : '/bookings';
      const result = await api.get<Booking[]>(endpoint);
      if (Array.isArray(result) && result.length > 0) {
        return statusFilter && statusFilter !== 'All'
          ? result.filter((b) => b.status === statusFilter)
          : result;
      }
      return statusFilter && statusFilter !== 'All'
        ? localBookings.filter((b) => b.status === statusFilter)
        : localBookings;
    } catch {
      return statusFilter && statusFilter !== 'All'
        ? localBookings.filter((b) => b.status === statusFilter)
        : localBookings;
    }
  },

  getBookingById: async (id: string): Promise<Booking> => {
    try {
      return await api.get<Booking>(`/bookings/${id}`);
    } catch {
      const found = localBookings.find((b) => b.id === id);
      if (!found) throw new Error(`Booking ${id} not found`);
      return found;
    }
  },

  createBooking: async (input: CreateBookingInput): Promise<Booking> => {
    try {
      const created = await api.post<Booking>('/bookings', input);
      localBookings = [created, ...localBookings];
      return created;
    } catch {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        ticketNumber: `#BK-${1050 + localBookings.length + 1}`,
        customerName: input.customerName,
        serviceName: input.serviceName,
        branchName: input.branchName || 'Main Branch',
        status: 'Waiting',
        timeSlot: input.timeSlot || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: input.date || new Date().toISOString().split('T')[0],
        customerPhone: input.customerPhone || '+1 (555) 000-0000',
        customerAvatar: input.customerAvatar,
      };
      localBookings = [newBooking, ...localBookings];
      return newBooking;
    }
  },

  checkInBooking: async (id: string): Promise<{ booking: Booking; queueEntryId?: string }> => {
    try {
      const result = await api.post<{ booking: Booking; queueEntryId?: string }>(`/bookings/${id}/check-in`);
      localBookings = localBookings.map((b) => (b.id === id ? { ...b, status: 'In Progress' } : b));
      return result;
    } catch {
      localBookings = localBookings.map((b) => (b.id === id ? { ...b, status: 'In Progress' } : b));
      const found = localBookings.find((b) => b.id === id);
      if (!found) throw new Error(`Booking ${id} not found`);
      return { booking: found, queueEntryId: `qe-${id}` };
    }
  },

  cancelBooking: async (id: string, reason?: string): Promise<Booking> => {
    try {
      const updated = await api.post<Booking>(`/bookings/${id}/cancel`, { reason });
      localBookings = localBookings.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b));
      return updated;
    } catch {
      localBookings = localBookings.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b));
      const found = localBookings.find((b) => b.id === id);
      if (!found) throw new Error(`Booking ${id} not found`);
      return found;
    }
  },

  completeBooking: async (id: string): Promise<Booking> => {
    try {
      const updated = await api.post<Booking>(`/bookings/${id}/complete`);
      localBookings = localBookings.map((b) => (b.id === id ? { ...b, status: 'Completed' } : b));
      return updated;
    } catch {
      localBookings = localBookings.map((b) => (b.id === id ? { ...b, status: 'Completed' } : b));
      const found = localBookings.find((b) => b.id === id);
      if (!found) throw new Error(`Booking ${id} not found`);
      return found;
    }
  },
};

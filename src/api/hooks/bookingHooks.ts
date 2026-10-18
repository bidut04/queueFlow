import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi, type CreateBookingInput } from '../booking.api';
import { bookingKeys, queueKeys } from '../queryKeys';
import type { Booking } from '../../types/booking';

/**
 * Hook to fetch bookings.
 * Cached for 5 minutes (staleTime); navigating between pages will not trigger redundant refetches.
 */
export const useBookings = (branchId?: string, statusFilter?: string) => {
  return useQuery({
    queryKey: bookingKeys.list(branchId, statusFilter),
    queryFn: () => bookingApi.getBookings(branchId, statusFilter),
  });
};

/**
 * Hook to fetch single booking by id.
 */
export const useBooking = (id: string) => {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingApi.getBookingById(id),
    enabled: Boolean(id),
  });
};

/**
 * Hook to create a booking.
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBookingInput) => bookingApi.createBooking(input),
    onSuccess: (newBooking) => {
      queryClient.setQueryData<Booking[]>(bookingKeys.lists(), (old) => {
        return old ? [newBooking, ...old] : [newBooking];
      });
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};

/**
 * Hook to check in a booking (creates queue entry).
 */
export const useCheckInBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingApi.checkInBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};

/**
 * Hook to cancel a booking.
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingApi.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};

/**
 * Hook to complete a booking.
 */
export const useCompleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingApi.completeBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};

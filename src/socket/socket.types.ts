export const RealtimeEventType = {
  // Booking lifecycle
  BOOKING_CREATED: 'booking.created',
  BOOKING_CHECKED_IN: 'booking.checked_in',
  BOOKING_COMPLETED: 'booking.completed',
  BOOKING_CANCELLED: 'booking.cancelled',

  // Queue lifecycle
  QUEUE_ENTRY_CREATED: 'queue.entry.created',
  QUEUE_ENTRY_CALLED: 'queue.entry.called',
  QUEUE_ENTRY_STARTED: 'queue.entry.started',
  QUEUE_ENTRY_COMPLETED: 'queue.entry.completed',
  QUEUE_ENTRY_REQUEUED: 'queue.entry.requeued',
  QUEUE_ENTRY_NO_SHOW: 'queue.entry.no_show',
  QUEUE_ENTRY_CANCELLED: 'queue.entry.cancelled',
  QUEUE_ENTRY_TRANSFERRED: 'queue.entry.transferred',
  QUEUE_ENTRY_HOLD: 'queue.entry.hold',

  // Display screen announcements
  DISPLAY_CALL: 'display.call',
  DISPLAY_CLEAR: 'display.clear',
} as const;

export type RealtimeEventType = (typeof RealtimeEventType)[keyof typeof RealtimeEventType];

export interface RealtimeEnvelope<T = unknown> {
  eventId: string;
  eventType: RealtimeEventType | string;
  tenantId: string;
  branchId?: string;
  occurredAt: string;
  payload: T;
}

export interface DisplayCallPayload {
  queueEntryId: string;
  tokenNumber: number;
  tokenLabel: string;
  counterId: string;
  counterNumber?: string;
  serviceId?: string;
  serviceName?: string;
  customerName?: string;
  soundCue?: string;
  calledAt: string;
}

export interface DisplayClearPayload {
  counterId: string;
  queueEntryId?: string;
  clearedAt: string;
}

export interface DisplayInitialStatePayload {
  branchId: string;
  activeCalls: Record<string, DisplayCallPayload>;
}

export interface QueueEntryRealtimePayload {
  queueEntryId: string;
  queueId?: string;
  branchId: string;
  serviceId?: string;
  serviceName?: string;
  tokenNumber: number;
  tokenLabel: string;
  status: string;
  counterId?: string;
  bookingId?: string;
  requeueCount?: number;
  reason?: string;
  updatedAt: string;
}

export interface BookingRealtimePayload {
  bookingId: string;
  bookingNo: string;
  tenantId: string;
  branchId: string;
  serviceId?: string;
  customerId?: string;
  status: string;
  scheduledAt: string;
  updatedAt: string;
}

export type SocketStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

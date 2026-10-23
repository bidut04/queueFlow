import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketClient } from './socket.client';
import {
  RealtimeEventType,
  type RealtimeEnvelope,
  type SocketStatus,
  type DisplayCallPayload,
  type DisplayClearPayload,
  type DisplayInitialStatePayload,
  type QueueEntryRealtimePayload,
} from './socket.types';
import { queueKeys, bookingKeys } from '../api/queryKeys';
import { toast } from '../components/ui/Toast';
import { getAuthToken, getActiveTenantId } from '../api/client';

export interface SocketContextValue {
  status: SocketStatus;
  isConnected: boolean;
  error: Error | null;
  activeRooms: string[];
  lastEvent: RealtimeEnvelope | null;
  subscribe: (room: string) => void;
  unsubscribe: (room: string) => void;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export interface SocketProviderProps {
  children: ReactNode;
  enableToasts?: boolean;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  enableToasts = true,
}) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<SocketStatus>(socketClient.getStatus());
  const [error, setError] = useState<Error | null>(socketClient.getLastError());
  const [activeRooms, setActiveRooms] = useState<string[]>(socketClient.getActiveRooms());
  const [lastEvent, setLastEvent] = useState<RealtimeEnvelope | null>(null);

  const enableToastsRef = useRef(enableToasts);
  enableToastsRef.current = enableToasts;

  // Sync socket client connection with auth state
  const syncConnection = useCallback(() => {
    const token = getAuthToken();
    if (token) {
      socketClient.connect();
    } else {
      socketClient.disconnect();
    }
  }, []);

  useEffect(() => {
    // 1. Listen for socket client status changes
    const unsubStatus = socketClient.onStatusChange((newStatus, err) => {
      setStatus(newStatus);
      setError(err || null);
      setActiveRooms(socketClient.getActiveRooms());
    });

    // 2. Initial connection attempt if authenticated
    syncConnection();

    // 3. Listen to auth changes (login, logout, unauthorized)
    const handleAuthChange = () => {
      syncConnection();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth:unauthorized', handleAuthChange);

    // 4. Setup global realtime listeners for Query cache auto-invalidation
    const handleQueueLifecycle = (envelope: RealtimeEnvelope<QueueEntryRealtimePayload>) => {
      setLastEvent(envelope);
      queryClient.invalidateQueries({ queryKey: queueKeys.all });

      if (enableToastsRef.current && envelope.eventType === RealtimeEventType.QUEUE_ENTRY_CALLED) {
        const payload = envelope.payload;
        toast.info(
          `Token ${payload.tokenLabel || payload.tokenNumber} called to ${payload.counterId || 'Desk'}`,
          { title: 'Live Queue Alert' }
        );
      }
    };

    const handleBookingLifecycle = (envelope: RealtimeEnvelope) => {
      setLastEvent(envelope);
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });

      if (enableToastsRef.current && envelope.eventType === RealtimeEventType.BOOKING_CREATED) {
        toast.info('A new customer appointment was booked in real-time.', {
          title: 'Booking Created',
        });
      }
    };

    const handleDisplayCall = (envelope: RealtimeEnvelope<DisplayCallPayload>) => {
      setLastEvent(envelope);
      // Ensure queues update when display calls
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    };

    // Listen to queue lifecycle events
    const unsubQueueCreated = socketClient.on(RealtimeEventType.QUEUE_ENTRY_CREATED, handleQueueLifecycle);
    const unsubQueueCalled = socketClient.on(RealtimeEventType.QUEUE_ENTRY_CALLED, handleQueueLifecycle);
    const unsubQueueStarted = socketClient.on(RealtimeEventType.QUEUE_ENTRY_STARTED, handleQueueLifecycle);
    const unsubQueueCompleted = socketClient.on(RealtimeEventType.QUEUE_ENTRY_COMPLETED, handleQueueLifecycle);
    const unsubQueueRequeued = socketClient.on(RealtimeEventType.QUEUE_ENTRY_REQUEUED, handleQueueLifecycle);
    const unsubQueueNoShow = socketClient.on(RealtimeEventType.QUEUE_ENTRY_NO_SHOW, handleQueueLifecycle);
    const unsubQueueCancelled = socketClient.on(RealtimeEventType.QUEUE_ENTRY_CANCELLED, handleQueueLifecycle);

    // Listen to booking lifecycle events
    const unsubBookingCreated = socketClient.on(RealtimeEventType.BOOKING_CREATED, handleBookingLifecycle);
    const unsubBookingCompleted = socketClient.on(RealtimeEventType.BOOKING_COMPLETED, handleBookingLifecycle);
    const unsubBookingCancelled = socketClient.on(RealtimeEventType.BOOKING_CANCELLED, handleBookingLifecycle);

    // Listen to display screen calls
    const unsubDisplayCall = socketClient.on(RealtimeEventType.DISPLAY_CALL, handleDisplayCall);

    return () => {
      unsubStatus();
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth:unauthorized', handleAuthChange);

      unsubQueueCreated();
      unsubQueueCalled();
      unsubQueueStarted();
      unsubQueueCompleted();
      unsubQueueRequeued();
      unsubQueueNoShow();
      unsubQueueCancelled();
      unsubBookingCreated();
      unsubBookingCompleted();
      unsubBookingCancelled();
      unsubDisplayCall();
    };
  }, [syncConnection, queryClient]);

  const subscribe = useCallback((room: string) => {
    socketClient.subscribe(room);
    setActiveRooms(socketClient.getActiveRooms());
  }, []);

  const unsubscribe = useCallback((room: string) => {
    socketClient.unsubscribe(room);
    setActiveRooms(socketClient.getActiveRooms());
  }, []);

  const reconnect = useCallback(() => {
    socketClient.disconnect();
    socketClient.connect();
  }, []);

  const value: SocketContextValue = {
    status,
    isConnected: status === 'connected',
    error,
    activeRooms,
    lastEvent,
    subscribe,
    unsubscribe,
    reconnect,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

/**
 * Access main socket status and actions
 */
export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a <SocketProvider>');
  }
  return context;
};

/**
 * Hook to listen to a specific socket event with automatic cleanup
 */
export const useSocketEvent = <T = unknown>(
  event: string,
  handler: (data: T) => void,
  deps: React.DependencyList = []
): void => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!event) return;
    const unsub = socketClient.on<T>(event, (data) => {
      handlerRef.current(data);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
};

/**
 * Automatically joins a socket room for the lifetime of the component
 */
export const useRoomSubscription = (room?: string | null, enabled: boolean = true): void => {
  const { subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    if (!enabled || !room) return;

    subscribe(room);
    return () => {
      unsubscribe(room);
    };
  }, [room, enabled, subscribe, unsubscribe]);
};

/**
 * Realtime hook for queue operators and branch desks
 */
export const useRealtimeQueue = (branchId: string = 'branch_central') => {
  const tenantId = getActiveTenantId();
  const branchRoom = `tenant:${tenantId}:branch:${branchId}`;

  // Automatically subscribe to the branch room
  useRoomSubscription(branchRoom, Boolean(branchId));

  const [lastQueueEvent, setLastQueueEvent] = useState<RealtimeEnvelope<QueueEntryRealtimePayload> | null>(null);

  useSocketEvent<RealtimeEnvelope<QueueEntryRealtimePayload>>(
    RealtimeEventType.QUEUE_ENTRY_CALLED,
    (envelope) => {
      if (envelope.branchId === branchId || !envelope.branchId) {
        setLastQueueEvent(envelope);
      }
    },
    [branchId]
  );

  useSocketEvent<RealtimeEnvelope<QueueEntryRealtimePayload>>(
    RealtimeEventType.QUEUE_ENTRY_CREATED,
    (envelope) => {
      if (envelope.branchId === branchId || !envelope.branchId) {
        setLastQueueEvent(envelope);
      }
    },
    [branchId]
  );

  return {
    branchRoom,
    lastQueueEvent,
  };
};

/**
 * Realtime hook for TV Display screens / Counter displays
 */
export const useRealtimeDisplay = (branchId: string = 'branch_central') => {
  const tenantId = getActiveTenantId();
  const displayRoom = `tenant:${tenantId}:branch:${branchId}:display`;

  useRoomSubscription(displayRoom, Boolean(branchId));

  const [activeCalls, setActiveCalls] = useState<Record<string, DisplayCallPayload>>({});
  const [mostRecentCall, setMostRecentCall] = useState<DisplayCallPayload | null>(null);

  // Hydrate initial state when subscribed
  useSocketEvent<DisplayInitialStatePayload>('display.initial_state', (payload) => {
    if (payload.branchId === branchId && payload.activeCalls) {
      setActiveCalls(payload.activeCalls);
    }
  }, [branchId]);

  // Handle live token calls
  useSocketEvent<RealtimeEnvelope<DisplayCallPayload>>(RealtimeEventType.DISPLAY_CALL, (envelope) => {
    if (envelope.branchId === branchId || !envelope.branchId) {
      const call = envelope.payload;
      setMostRecentCall(call);
      setActiveCalls((prev) => ({
        ...prev,
        [call.counterId]: call,
      }));
    }
  }, [branchId]);

  // Handle counter clear
  useSocketEvent<RealtimeEnvelope<DisplayClearPayload>>(RealtimeEventType.DISPLAY_CLEAR, (envelope) => {
    if (envelope.branchId === branchId || !envelope.branchId) {
      const { counterId } = envelope.payload;
      setActiveCalls((prev) => {
        const next = { ...prev };
        delete next[counterId];
        return next;
      });
    }
  }, [branchId]);

  return {
    displayRoom,
    activeCalls,
    mostRecentCall,
  };
};

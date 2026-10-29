import { io, Socket } from 'socket.io-client';
import { getAuthToken, getActiveTenantId } from '../api/client';
import type { SocketStatus } from './socket.types';

export class SocketClient {
  private socket: Socket | null = null;
  private activeRooms = new Set<string>();
  private statusListeners = new Set<(status: SocketStatus, error?: Error) => void>();
  private currentStatus: SocketStatus = 'disconnected';
  private lastError: Error | null = null;

  private lastSeenTimestamp: string | null = null;
  private customListeners = new Map<string, Set<(data: any) => void>>();

  public getLastSeenTimestamp(): string | null {
    return this.lastSeenTimestamp;
  }

  public getStatus(): SocketStatus {
    return this.currentStatus;
  }

  public getLastError(): Error | null {
    return this.lastError;
  }

  public getActiveRooms(): string[] {
    return Array.from(this.activeRooms);
  }

  public getRawSocket(): Socket | null {
    return this.socket;
  }

  public onStatusChange(callback: (status: SocketStatus, error?: Error) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.currentStatus, this.lastError || undefined);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private setStatus(status: SocketStatus, error?: Error) {
    this.currentStatus = status;
    this.lastError = error || null;
    this.statusListeners.forEach((fn) => {
      try {
        fn(status, error);
      } catch (err) {
        console.error('Socket status listener error:', err);
      }
    });
  }

  /**
   * Initializes or refreshes the Socket.IO connection using current credentials.
   */
  public connect(): Socket | null {
    const token = getAuthToken() || 'guest';

    // If socket exists and is connected with the same token, reuse
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.setStatus('connecting');

    // Prefer explicit env URL, otherwise use current window origin (proxied via Vite dev server)
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8989');

    const socket = io(socketUrl, {
      path: '/socket.io',
      auth: {
        token,
        tenantId: getActiveTenantId(),
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      this.setStatus('connected');

      // Resubscribe to all tracked rooms with lastSeenAt for catch-up recovery
      this.activeRooms.forEach((room) => {
        socket.emit('subscribe', {
          room,
          lastSeenAt: this.lastSeenTimestamp || undefined,
        });
      });
    });

    // Automatically capture occurredAt on all incoming events to track heartbeat gap
    socket.onAny((event: string, ...args: any[]) => {
      const envelope = args[0];
      if (envelope && typeof envelope === 'object' && envelope.occurredAt) {
        this.lastSeenTimestamp = envelope.occurredAt;
      }
      // Notify registered local listeners
      const listeners = this.customListeners.get(event);
      if (listeners) {
        listeners.forEach((fn) => {
          try { fn(envelope); } catch (e) { console.error(e); }
        });
      }
    });

    // Replay missed events sent by server during disconnect
    socket.on('queue.sync_missed_events', (data: { room: string; events: Array<{ eventType: string; occurredAt?: string; [k: string]: any }> }) => {
      if (Array.isArray(data?.events)) {
        data.events.forEach((ev) => {
          if (ev.occurredAt) this.lastSeenTimestamp = ev.occurredAt;
          const listeners = this.customListeners.get(ev.eventType);
          if (listeners) {
            listeners.forEach((fn) => {
              try { fn(ev); } catch (e) { console.error(e); }
            });
          }
        });
      }
    });

    socket.on('disconnect', (reason) => {
      this.setStatus('disconnected');
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.warn('Socket connection error:', error.message);
      this.setStatus('error', error);
    });

    socket.on('error', (payload: unknown) => {
      console.warn('Socket realtime error:', payload);
    });

    this.socket = socket;
    return socket;
  }

  /**
   * Disconnects the socket and cleans up listeners
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.setStatus('disconnected');
  }

  /**
   * Subscribe to a specific room with optional lastSeenAt catch-up
   */
  public subscribe(room: string): void {
    if (!room) return;
    this.activeRooms.add(room);
    if (this.socket?.connected) {
      this.socket.emit(
        'subscribe',
        { room, lastSeenAt: this.lastSeenTimestamp || undefined },
        (res?: { success: boolean; error?: string }) => {
          if (res && !res.success) {
            console.warn(`Failed to subscribe to room "${room}":`, res.error);
          }
        }
      );
    }
  }

  /**
   * Unsubscribe from a room
   */
  public unsubscribe(room: string): void {
    if (!room) return;
    this.activeRooms.delete(room);
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe', { room });
    }
  }

  /**
   * Subscribe helper for tenant branch room
   */
  public subscribeBranch(branchId: string, tenantId?: string): string {
    const tId = tenantId || getActiveTenantId();
    const room = `tenant:${tId}:branch:${branchId}`;
    this.subscribe(room);
    return room;
  }

  /**
   * Subscribe helper for branch display TV room
   */
  public subscribeDisplay(branchId: string, tenantId?: string): string {
    const tId = tenantId || getActiveTenantId();
    const room = `tenant:${tId}:branch:${branchId}:display`;
    this.subscribe(room);
    return room;
  }

  /**
   * Register an event listener
   */
  public on<T = unknown>(event: string, handler: (data: T) => void): () => void {
    if (!this.customListeners.has(event)) {
      this.customListeners.set(event, new Set());
    }
    this.customListeners.get(event)!.add(handler as (data: any) => void);

    if (!this.socket) {
      this.connect();
    }
    const sock = this.socket;
    if (sock) {
      sock.on(event, handler as (...args: unknown[]) => void);
    }
    return () => {
      this.customListeners.get(event)?.delete(handler as (data: any) => void);
      if (sock) {
        sock.off(event, handler as (...args: unknown[]) => void);
      }
    };
  }

  /**
   * Remove an event listener
   */
  public off<T = unknown>(event: string, handler: (data: T) => void): void {
    this.customListeners.get(event)?.delete(handler as (data: any) => void);
    if (this.socket) {
      this.socket.off(event, handler as (...args: unknown[]) => void);
    }
  }
}

export const socketClient = new SocketClient();

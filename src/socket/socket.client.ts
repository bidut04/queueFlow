import { io, Socket } from 'socket.io-client';
import { getAuthToken, getActiveTenantId } from '../api/client';
import type { SocketStatus } from './socket.types';

export class SocketClient {
  private socket: Socket | null = null;
  private activeRooms = new Set<string>();
  private statusListeners = new Set<(status: SocketStatus, error?: Error) => void>();
  private currentStatus: SocketStatus = 'disconnected';
  private lastError: Error | null = null;

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
    const token = getAuthToken();
    if (!token) {
      if (this.socket) {
        this.disconnect();
      }
      this.setStatus('disconnected');
      return null;
    }

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

      // Resubscribe to all tracked rooms on reconnect
      this.activeRooms.forEach((room) => {
        socket.emit('subscribe', { room });
      });
    });

    socket.on('disconnect', (reason) => {
      this.setStatus('disconnected');
      if (reason === 'io server disconnect') {
        // Server forced disconnect, e.g. token expired
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
   * Subscribe to a specific room (e.g. `tenant:${tenantId}:branch:${branchId}`)
   */
  public subscribe(room: string): void {
    if (!room) return;
    this.activeRooms.add(room);
    if (this.socket?.connected) {
      this.socket.emit('subscribe', { room }, (res?: { success: boolean; error?: string }) => {
        if (res && !res.success) {
          console.warn(`Failed to subscribe to room "${room}":`, res.error);
        }
      });
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
    if (!this.socket) {
      this.connect();
    }
    const sock = this.socket;
    if (sock) {
      sock.on(event, handler as (...args: unknown[]) => void);
    }
    return () => {
      if (sock) {
        sock.off(event, handler as (...args: unknown[]) => void);
      }
    };
  }

  /**
   * Remove an event listener
   */
  public off<T = unknown>(event: string, handler: (data: T) => void): void {
    if (this.socket) {
      this.socket.off(event, handler as (...args: unknown[]) => void);
    }
  }
}

export const socketClient = new SocketClient();

import { api } from '../../../api/client';
import type {
  QueueServiceItem,
  TenantItem,
  BranchItem,
  LiveQueuePreviewData,
  UpcomingAppointmentItem,
  UserGeoLocation,
  BookedTokenInfo,
} from '../types/queuePortal.types';
import { MOCK_ORGANIZATION_SERVICES, MOCK_BRANCHES, MOCK_TENANTS } from '../data/queuePortalMockData';

// Haversine formula to calculate distance between two coordinates in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export interface BookSlotParams {
  tenantId: string;
  tenantName: string;
  serviceId: string;
  serviceName: string;
  branchId: string;
  branchName: string;
  branchAddress?: string;
  timeSlot: string;
  customerName?: string;
  customerPhone?: string;
}

interface BackendBranchAddress {
  street?: string;
  locality?: string;
  city?: string;
  state?: string;
  district?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

interface BackendLocationItem {
  id: string;
  name: string;
  code?: string;
  address?: BackendBranchAddress | string;
  phone?: string;
  locality?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  tenantId?: string;
  _count?: {
    counters?: number;
  };
}

interface BackendOrganizationItem {
  id: string;
  name: string;
  slug?: string;
  type?: string;
  locality?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  branchesCount?: number;
  locations?: BackendLocationItem[];
  primaryBranch?: BackendLocationItem | null;
  _count?: {
    locations?: number;
    services?: number;
  };
}

interface BackendServiceItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  estimatedDurationSec?: number;
  status?: string;
  tenantId?: string;
}

interface BackendBookTokenResult {
  tokenLabel?: string;
  tokenNumber?: string | number;
  id?: string;
  status?: string;
}

interface BackendQueueEntry {
  id?: string;
  status?: string;
  tokenLabel?: string;
  tokenNumber?: number | string;
}

interface BackendBookingItem {
  id: string;
  serviceName?: string;
  date?: string;
  timeSlot?: string;
  branchName?: string;
  status?: 'Confirmed' | 'Pending' | 'Cancelled';
}

const DEFAULT_ARCHITECTURAL_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80',
];

export const queuePortalApi = {
  detectCurrentLocation: async (): Promise<UserGeoLocation> => {
    return new Promise((resolve) => {
      const fallback: UserGeoLocation = { latitude: 22.5726, longitude: 88.3639, locality: 'Kolkata', city: 'West Bengal' };
      if (!navigator.geolocation) return resolve(fallback);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
              { headers: { 'User-Agent': 'QueueFlow-App/1.0' } }
            );
            if (res.ok) {
              const data = await res.json() as { address?: Record<string, string> };
              const addr = data.address || {};
              const locality = addr.suburb || addr.neighbourhood || addr.town || addr.village || 'Current Area';
              const city = addr.city || addr.state_district || addr.state || 'West Bengal';
              return resolve({ latitude, longitude, locality, city });
            }
          } catch {
            // fallback
          }
          resolve({ latitude, longitude, locality: 'Detected Area', city: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°` });
        },
        () => resolve(fallback),
        { timeout: 6000, enableHighAccuracy: true }
      );
    });
  },

  getTenants: async (userLocation?: UserGeoLocation): Promise<TenantItem[]> => {
    try {
      const res = await api.get<{ success: boolean; data: BackendOrganizationItem[] }>('/organizations');
      const list = Array.isArray(res) ? (res as unknown as BackendOrganizationItem[]) : res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((org: BackendOrganizationItem, idx: number): TenantItem => {
          const primaryBranch = org.primaryBranch || (Array.isArray(org.locations) && org.locations[0]) || null;
          const branchAddr: BackendBranchAddress =
            primaryBranch && typeof primaryBranch.address === 'object' && primaryBranch.address !== null
              ? primaryBranch.address
              : {};

          const lat =
            org.latitude ??
            primaryBranch?.latitude ??
            branchAddr.latitude ??
            (userLocation ? userLocation.latitude + (idx * 0.01) : 22.5726 + idx * 0.02);

          const lon =
            org.longitude ??
            primaryBranch?.longitude ??
            branchAddr.longitude ??
            (userLocation ? userLocation.longitude + (idx * 0.01) : 88.3639 + idx * 0.02);

          const dist = userLocation
            ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, lat, lon)
            : Math.round((0.8 + idx * 1.2) * 10) / 10;

          const isBank = org.type?.toLowerCase().includes('bank');
          const isPost = org.type?.toLowerCase().includes('post');
          const isHealth =
            org.type?.toLowerCase().includes('hospital') ||
            org.type?.toLowerCase().includes('clinic') ||
            org.type?.toLowerCase().includes('diagnostic');

          const localityName =
            org.locality ||
            primaryBranch?.locality ||
            branchAddr.locality ||
            branchAddr.city ||
            org.city ||
            (userLocation ? `${userLocation.locality}, ${userLocation.city}` : 'Kolkata, WB');

          return {
            id: org.id,
            name: org.name,
            slug: org.slug || org.id,
            type: org.type || 'BANK',
            branchesCount: org._count?.locations ?? org.locations?.length ?? org.branchesCount ?? 1,
            distanceKm: dist,
            locality: localityName,
            latitude: lat,
            longitude: lon,
            iconType: isBank ? 'bank' : isPost ? 'mail' : isHealth ? 'clinic' : 'government',
            imageUrl: DEFAULT_ARCHITECTURAL_IMAGES[idx % DEFAULT_ARCHITECTURAL_IMAGES.length],
            isPopular: idx === 0,
          };
        });
      }
    } catch (err) {
      console.warn('Could not fetch organizations from API, using curated mock:', err);
    }
    return MOCK_TENANTS;
  },

  getServicesForTenant: async (tenantId: string): Promise<QueueServiceItem[]> => {
    try {
      const res = await api.get<{ success: boolean; data: BackendServiceItem[] }>(`/organizations/${tenantId}/services`);
      const list = Array.isArray(res) ? (res as unknown as BackendServiceItem[]) : res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((s: BackendServiceItem, idx: number): QueueServiceItem => ({
          id: s.id,
          name: s.name,
          category: 'banks',
          categoryLabel: s.code || 'Banking',
          description: s.description || 'Counter service with priority queue ticket token.',
          branchName: 'Main Branch Counter',
          distanceKm: 0.8,
          openingHours: '9:30 AM – 4:00 PM',
          estWaitMinutes: s.estimatedDurationSec ? Math.round(s.estimatedDurationSec / 60) : 10,
          activeCounters: 2 + (idx % 3),
          isOpen: s.status === 'ACTIVE',
          tenantId: s.tenantId,
          iconType: s.name.toLowerCase().includes('deposit') || s.name.toLowerCase().includes('cash')
            ? 'bank'
            : s.name.toLowerCase().includes('post') ? 'mail' : 'government',
        }));
      }
    } catch (err) {
      console.warn(`Could not fetch services for tenant ${tenantId}:`, err);
    }
    return MOCK_ORGANIZATION_SERVICES[tenantId] || MOCK_ORGANIZATION_SERVICES['tenant-sbi'] || [];
  },

  getBranchesForTenant: async (tenantId: string, userLocation?: UserGeoLocation): Promise<BranchItem[]> => {
    try {
      const res = await api.get<{ success: boolean; data: BackendLocationItem[] }>(`/organizations/${tenantId}/branches`);
      const list = Array.isArray(res) ? (res as unknown as BackendLocationItem[]) : res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((b: BackendLocationItem, idx: number): BranchItem => {
          const addr: BackendBranchAddress = typeof b.address === 'object' && b.address !== null ? b.address : {};
          const lat =
            b.latitude ??
            addr.latitude ??
            (userLocation ? userLocation.latitude + (idx * 0.01) : 22.5726 + idx * 0.02);
          const lon =
            b.longitude ??
            addr.longitude ??
            (userLocation ? userLocation.longitude + (idx * 0.01) : 88.3639 + idx * 0.02);

          const dist = userLocation
            ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, lat, lon)
            : Math.round((1.2 + idx * 4.5) * 10) / 10;

          const addressText = addr.street
            ? `${addr.street}, ${addr.locality ? `${addr.locality}, ` : ''}${addr.city || ''} ${addr.postalCode ? `- ${addr.postalCode}` : ''}`.trim()
            : (typeof b.address === 'string' ? b.address : (b.name ? `${b.name}, Kolkata` : 'Main Branch Counter'));

          return {
            id: b.id,
            name: b.name,
            tenantId: b.tenantId || tenantId,
            tenantName: 'Organization Branch',
            address: addressText,
            distanceKm: dist,
            waitMinutes: 8 + idx * 5,
            activeCounters: b._count?.counters || 3,
            openingHours: '9:30 AM – 4:00 PM (Mon – Fri)',
            isOpen: b.status === 'ACTIVE',
            imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=400&q=80',
            latitude: lat,
            longitude: lon,
          };
        });
      }
    } catch (err) {
      console.warn(`Could not fetch branches for tenant ${tenantId}:`, err);
    }
    const filtered = MOCK_BRANCHES.filter((b) => b.tenantId === tenantId);
    if (filtered.length > 0) return filtered;
    return [
      {
        id: `branch-${tenantId}-1`,
        name: 'Main Branch Counter',
        tenantId,
        tenantName: 'Organization Branch',
        address: 'Kolkata City Central, West Bengal',
        distanceKm: 3.0,
        activeCounters: 2,
        openingHours: '9:30 AM – 4:00 PM (Mon – Fri)',
        isOpen: true,
        waitMinutes: 10,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=500&q=80',
      },
    ];
  },

  bookToken: async (params: BookSlotParams, customIdempotencyKey?: string): Promise<BookedTokenInfo> => {
    const idempotencyKey =
      customIdempotencyKey ||
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    try {
      const res = await api.post<{ success: boolean; data: BackendBookTokenResult }>(
        `/organizations/${params.tenantId}/book-token`,
        {
          branchId: params.branchId,
          serviceId: params.serviceId,
          timeSlot: params.timeSlot,
          customerName: params.customerName,
          customerPhone: params.customerPhone,
          idempotencyKey,
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
            'X-Idempotency-Key': idempotencyKey,
          },
        }
      );
      const entry: BackendBookTokenResult = res?.data || (res as unknown as BackendBookTokenResult) || {};
      const tokenNumber = entry.tokenLabel || (entry.tokenNumber ? String(entry.tokenNumber) : `TK-${Math.floor(100 + Math.random() * 900)}`);

      return {
        tokenNumber,
        tenantId: params.tenantId,
        tenantName: params.tenantName,
        serviceId: params.serviceId,
        serviceName: params.serviceName,
        branchId: params.branchId,
        branchName: params.branchName,
        branchAddress: params.branchAddress || 'Main Branch Counter',
        timeSlot: params.timeSlot,
        estWaitMinutes: 10,
        peopleAhead: 2,
        activeCounters: 3,
        status: 'Waiting',
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } catch (err) {
      console.error('Real booking API call failed:', err);
      const fallbackNum = `K0${Math.floor(10 + Math.random() * 89)}`;
      return {
        tokenNumber: fallbackNum,
        tenantId: params.tenantId,
        tenantName: params.tenantName,
        serviceId: params.serviceId,
        serviceName: params.serviceName,
        branchId: params.branchId,
        branchName: params.branchName,
        branchAddress: params.branchAddress || 'Branch Counter',
        timeSlot: params.timeSlot,
        estWaitMinutes: 8,
        peopleAhead: 2,
        activeCounters: 2,
        status: 'Waiting',
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }
  },

  getLiveQueue: async (branchId?: string, serviceId?: string): Promise<LiveQueuePreviewData> => {
    try {
      if (branchId) {
        const res = await api.get<{ success: boolean; data: BackendQueueEntry[] }>(`/queue/branch/${branchId}/active`);
        const entries = Array.isArray(res) ? (res as unknown as BackendQueueEntry[]) : res?.data || [];
        if (entries.length > 0) {
          const serving = entries.find((e: BackendQueueEntry) => e.status === 'CALLED' || e.status === 'IN_SERVICE') || entries[0];
          const servingTicket = serving.tokenLabel || (serving.tokenNumber ? `K0${serving.tokenNumber}` : 'K021');
          return {
            id: serviceId || 'live-queue',
            serviceName: 'Live Branch Counter Queue',
            branchName: 'Daspur Main Branch',
            isOpen: true,
            nowServingTicket: servingTicket,
            userTicket: 'K024',
            positionInLine: '2nd in line',
            estWaitRange: '8-12 min',
            timeline: [
              { stepNumber: 1, ticketNumber: servingTicket, label: 'Now Serving', status: 'serving' },
              { stepNumber: 2, ticketNumber: 'K022', label: 'Next in Line', status: 'served' },
              { stepNumber: 3, ticketNumber: 'K023', label: 'Ahead of You', status: 'upcoming' },
              { stepNumber: 4, ticketNumber: 'K024', label: 'Your Token', status: 'user' },
            ],
            hurryModeEnabled: false,
          };
        }
      }
    } catch {
      // Fall through
    }

    return {
      id: serviceId || 'live-queue',
      serviceName: 'Live Counter Queue',
      branchName: 'Daspur Main Branch',
      isOpen: true,
      nowServingTicket: 'K021',
      userTicket: 'K024',
      positionInLine: '2nd in line',
      estWaitRange: '8-12 min',
      timeline: [
        { stepNumber: 1, ticketNumber: 'K021', label: 'Now Serving', status: 'serving' },
        { stepNumber: 2, ticketNumber: 'K022', label: 'Next in Line', status: 'served' },
        { stepNumber: 3, ticketNumber: 'K023', label: 'Ahead of You', status: 'upcoming' },
        { stepNumber: 4, ticketNumber: 'K024', label: 'Your Token', status: 'user' },
      ],
      hurryModeEnabled: false,
    };
  },

  getUserAppointments: async (): Promise<UpcomingAppointmentItem | null> => {
    try {
      const res = await api.get<{ success: boolean; data: BackendBookingItem[] }>('/bookings');
      const list = Array.isArray(res) ? (res as unknown as BackendBookingItem[]) : res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        const latest = list[0];
        return {
          id: latest.id,
          serviceName: latest.serviceName || 'Token Booking',
          dateText: `${latest.date || 'Today'} • ${latest.timeSlot || 'Scheduled'}`,
          branchName: latest.branchName || 'Branch Counter',
          status: latest.status || 'Confirmed',
        };
      }
    } catch {
      // No active booking
    }
    return null;
  },
};

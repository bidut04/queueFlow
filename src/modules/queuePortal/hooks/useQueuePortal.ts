import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { queuePortalApi } from '../api/queuePortal.api';
import { socketClient } from '../../../socket/socket.client';
import { RealtimeEventType } from '../../../socket/socket.types';
import { counterChime } from '../../../utils/audioChime';
import type {
  ServiceCategory,
  QueueServiceItem,
  LiveQueuePreviewData,
  UpcomingAppointmentItem,
  TenantItem,
  UserGeoLocation,
} from '../types/queuePortal.types';

export function useQueuePortal() {
  // Location State (Food delivery style GPS detection)
  const [userLocation, setUserLocation] = useState<UserGeoLocation | null>(null);
  const [currentLocationText, setCurrentLocationText] = useState<string>('Detecting location...');
  const [isLocating, setIsLocating] = useState<boolean>(true);

  // Tenant & Branch State
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('all');
  const [branches, setBranches] = useState<any[]>([]);

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [branchSearchQuery, setBranchSearchQuery] = useState<string>('');

  // Services State
  const [services, setServices] = useState<QueueServiceItem[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(true);
  const [isLoadingTenants, setIsLoadingTenants] = useState<boolean>(true);

  // Queue & Appointment State
  const [liveQueueData, setLiveQueueData] = useState<LiveQueuePreviewData>({
    id: 'live-queue-preview',
    serviceName: 'Branch Live Counter',
    branchName: 'Daspur Main Branch',
    isOpen: true,
    nowServingTicket: 'K021',
    currentServingToken: 'K021',
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
  });
  const [upcomingAppointment, setUpcomingAppointment] = useState<UpcomingAppointmentItem | null>(null);

  // Realtime Socket listener for live queue calling events
  useEffect(() => {
    socketClient.connect();

    const unsubCalled = socketClient.on(RealtimeEventType.QUEUE_ENTRY_CALLED, (envelope: any) => {
      const payload = envelope?.payload || envelope;
      if (!payload) return;

      const calledToken = payload.tokenLabel || (payload.tokenNumber ? `T${payload.tokenNumber}` : null);
      if (!calledToken) return;

      // Play harmonic chime cue
      counterChime.playChime();

      setLiveQueueData((prev) => ({
        ...prev,
        nowServingTicket: calledToken,
        currentServingToken: calledToken,
        serviceName: payload.serviceName || prev.serviceName,
        lastUpdatedMs: Date.now(),
        timeline: [
          { stepNumber: 1, ticketNumber: calledToken, label: 'Now Serving', status: 'serving' },
          { stepNumber: 2, ticketNumber: prev.nowServingTicket || 'TK01', label: 'Served', status: 'served' },
          { stepNumber: 3, ticketNumber: 'TK03', label: 'Ahead of You', status: 'upcoming' },
          { stepNumber: 4, ticketNumber: prev.userTicket, label: 'Your Token', status: 'user' },
        ],
      }));
    });

    const unsubDisplay = socketClient.on(RealtimeEventType.DISPLAY_CALL, (envelope: any) => {
      const payload = envelope?.payload || envelope;
      if (!payload?.tokenLabel) return;

      // Play harmonic chime cue
      counterChime.playChime();

      setLiveQueueData((prev) => ({
        ...prev,
        nowServingTicket: payload.tokenLabel,
        currentServingToken: payload.tokenLabel,
        serviceName: payload.serviceName || prev.serviceName,
        lastUpdatedMs: Date.now(),
      }));
    });

    return () => {
      unsubCalled();
      unsubDisplay();
    };
  }, []);

  const hasInitiatedLocation = useRef(false);

  // 1. Live location detection
  const detectLocation = useCallback(async () => {
    setIsLocating(true);
    try {
      const geo = await queuePortalApi.detectCurrentLocation();
      setUserLocation(geo);
      setCurrentLocationText(`${geo.locality}, ${geo.city}`);
    } catch {
      setCurrentLocationText('Kolkata, West Bengal');
    } finally {
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    if (!hasInitiatedLocation.current) {
      hasInitiatedLocation.current = true;
      detectLocation();
    }
  }, [detectLocation]);

  // 2. Fetch Organizations & User Bookings
  useEffect(() => {
    async function fetchPlatformData() {
      setIsLoadingTenants(true);
      try {
        const [orgs, userApt] = await Promise.all([
          queuePortalApi.getTenants(userLocation || undefined),
          queuePortalApi.getUserAppointments(),
        ]);
        setTenants(orgs);
        if (userApt) setUpcomingAppointment(userApt);
      } catch (err) {
        console.warn('Failed loading platform organizations:', err);
      } finally {
        setIsLoadingTenants(false);
      }
    }
    fetchPlatformData();
  }, [userLocation]);

  // 3. Fetch Services dynamically for active tenants
  useEffect(() => {
    async function loadServices() {
      setIsLoadingServices(true);
      try {
        if (selectedTenantId && selectedTenantId !== 'all') {
          const tenantServices = await queuePortalApi.getServicesForTenant(selectedTenantId);
          setServices(tenantServices);
        } else if (tenants.length > 0) {
          // Fetch services for first 3 tenants and aggregate
          const results = await Promise.all(
            tenants.slice(0, 4).map((t) => queuePortalApi.getServicesForTenant(t.id))
          );
          setServices(results.flat());
        }
      } catch (err) {
        console.warn('Failed loading services:', err);
      } finally {
        setIsLoadingServices(false);
      }
    }
    loadServices();
  }, [selectedTenantId, tenants]);

  // 4. Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((svc) => {
      // Category filter
      if (selectedCategory !== 'all' && svc.category !== selectedCategory) {
        return false;
      }
      // Top search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = svc.name.toLowerCase().includes(q);
        const matchesBranch = svc.branchName?.toLowerCase().includes(q);
        const matchesCat = svc.categoryLabel?.toLowerCase().includes(q);
        if (!matchesName && !matchesBranch && !matchesCat) return false;
      }
      // Branch search filter
      if (branchSearchQuery.trim()) {
        const q = branchSearchQuery.toLowerCase().trim();
        const matchesName = svc.name.toLowerCase().includes(q);
        const matchesBranch = svc.branchName?.toLowerCase().includes(q);
        if (!matchesName && !matchesBranch) return false;
      }
      return true;
    });
  }, [services, selectedCategory, searchQuery, branchSearchQuery]);

  // 5. Select service to view live queue preview
  const onSelectViewQueue = useCallback(async (service: QueueServiceItem) => {
    try {
      const live = await queuePortalApi.getLiveQueue(service.id, service.id);
      setLiveQueueData({
        ...live,
        serviceName: service.name,
      });
    } catch {
      setLiveQueueData((prev) => ({
        ...prev,
        id: service.id,
        serviceName: service.name,
      }));
    }
  }, []);

  return {
    userLocation,
    currentLocationText,
    setCurrentLocationText,
    isLocating,
    detectLocation,
    tenants,
    isLoadingTenants,
    selectedTenantId,
    setSelectedTenantId,
    branches,
    setBranches,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
    services,
    filteredServices,
    isLoadingServices,
    liveQueueData,
    upcomingAppointment,
    onSelectViewQueue,
    handleViewQueue: onSelectViewQueue,
  };
}

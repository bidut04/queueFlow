import { useState, useCallback } from 'react';
import type {
  BookingFlowStep,
  TenantItem,
  QueueServiceItem,
  BranchItem,
  BookedTokenInfo,
  UserGeoLocation,
} from '../types/queuePortal.types';
import { queuePortalApi } from '../api/queuePortal.api';

export const useQueueBookingFlow = (userLocation?: UserGeoLocation) => {
  const [currentStep, setCurrentStep] = useState<BookingFlowStep>('home');

  // Selected state across steps (starts clean without hardcoded mockdata)
  const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null);
  const [selectedService, setSelectedService] = useState<QueueServiceItem | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Now (8 min)');
  const [bookedToken, setBookedToken] = useState<BookedTokenInfo | null>(() => {
    try {
      const saved = localStorage.getItem('queflow_active_token');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dynamic API state per tenant
  const [tenantServices, setTenantServices] = useState<QueueServiceItem[]>([]);
  const [tenantBranches, setTenantBranches] = useState<BranchItem[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Transitions
  const startBooking = useCallback(async (tenant?: TenantItem) => {
    if (tenant) {
      setSelectedTenant(tenant);
      setIsLoadingServices(true);
      try {
        const services = await queuePortalApi.getServicesForTenant(tenant.id);
        setTenantServices(services);
      } finally {
        setIsLoadingServices(false);
      }
      setCurrentStep('select-service');
    } else {
      setCurrentStep('select-org');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectTenant = useCallback(async (tenant: TenantItem) => {
    setSelectedTenant(tenant);
    setIsLoadingServices(true);
    setCurrentStep('select-service');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const services = await queuePortalApi.getServicesForTenant(tenant.id);
      setTenantServices(services);
      if (services.length > 0) {
        setSelectedService(services[0]);
      }
    } finally {
      setIsLoadingServices(false);
    }
  }, []);

  const handleSelectService = useCallback(async (service: QueueServiceItem) => {
    setSelectedService(service);
    setIsLoadingBranches(true);
    setCurrentStep('select-branch');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const tenantId = selectedTenant?.id || service.tenantId || 'tenant-sbi';
      const branches = await queuePortalApi.getBranchesForTenant(tenantId, userLocation);
      setTenantBranches(branches);
      if (branches.length > 0) {
        setSelectedBranch(branches[0]);
      }
    } finally {
      setIsLoadingBranches(false);
    }
  }, [selectedTenant, userLocation]);

  const handleSelectBranch = useCallback((branch: BranchItem) => {
    setSelectedBranch(branch);
    setCurrentStep('branch-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleProceedToReview = useCallback(() => {
    setCurrentStep('review-confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleProceedToChooseTime = useCallback(() => {
    setCurrentStep('choose-time');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleConfirmAndGetToken = useCallback(async (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setIsSubmittingBooking(true);

    try {
      const realToken = await queuePortalApi.bookToken({
        tenantId: selectedTenant?.id || 'tenant-sbi',
        tenantName: selectedTenant?.name || 'State Bank of India',
        serviceId: selectedService?.id || 'srv-kyc',
        serviceName: selectedService?.name || 'Service Counter',
        branchId: selectedBranch?.id || 'branch-1',
        branchName: selectedBranch?.name || 'Main Branch',
        branchAddress: selectedBranch?.address,
        timeSlot,
      });

      setBookedToken(realToken);
      try {
        localStorage.setItem('queflow_active_token', JSON.stringify(realToken));
      } catch {
        // LocalStorage fallback
      }

      setCurrentStep('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmittingBooking(false);
    }
  }, [selectedTenant, selectedService, selectedBranch]);

  const handleGoToTrackQueue = useCallback(() => {
    setCurrentStep('track-queue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGoBack = useCallback(() => {
    switch (currentStep) {
      case 'select-org':
        setCurrentStep('home');
        break;
      case 'select-service':
        setCurrentStep('select-org');
        break;
      case 'select-branch':
        setCurrentStep('select-service');
        break;
      case 'branch-details':
        setCurrentStep('select-branch');
        break;
      case 'review-confirm':
        setCurrentStep('branch-details');
        break;
      case 'choose-time':
        setCurrentStep('review-confirm');
        break;
      case 'confirmation':
        setCurrentStep('home');
        break;
      case 'track-queue':
        setCurrentStep('home');
        break;
      default:
        setCurrentStep('home');
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const resetToHome = useCallback(() => {
    setCurrentStep('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    currentStep,
    setCurrentStep,
    selectedTenant,
    selectedService,
    selectedBranch,
    selectedTimeSlot,
    bookedToken,
    tenantServices,
    tenantBranches,
    isLoadingServices,
    isLoadingBranches,
    isSubmittingBooking,
    startBooking,
    handleSelectTenant,
    handleSelectService,
    handleSelectBranch,
    handleProceedToReview,
    handleProceedToChooseTime,
    handleConfirmAndGetToken,
    handleGoToTrackQueue,
    handleGoBack,
    resetToHome,
  };
};

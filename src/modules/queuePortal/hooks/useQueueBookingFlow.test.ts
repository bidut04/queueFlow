import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQueueBookingFlow } from './useQueueBookingFlow';
import { queuePortalApi } from '../api/queuePortal.api';
import type { TenantItem, QueueServiceItem, BranchItem } from '../types/queuePortal.types';

vi.mock('../api/queuePortal.api', () => ({
  queuePortalApi: {
    getServicesForTenant: vi.fn(),
    getBranchesForTenant: vi.fn(),
    bookQueueToken: vi.fn(),
  },
}));

describe('useQueueBookingFlow State Machine Hook', () => {
  const mockTenant: TenantItem = {
    id: 'tenant-apollo',
    name: 'Apollo Clinic',
    category: 'Healthcare',
    rating: 4.8,
    reviewCount: 320,
    isOpen: true,
    logoUrl: 'https://images.unsplash.com/photo-1',
    bannerUrl: 'https://images.unsplash.com/photo-2',
    address: 'Salt Lake City',
    servicesCount: 6,
    avgWaitTimeMin: 12,
  };

  const mockService: QueueServiceItem = {
    id: 'srv-consult',
    name: 'General Consultation',
    tenantId: 'tenant-apollo',
    tenantName: 'Apollo Clinic',
    serviceName: 'General Consultation',
    category: 'Healthcare',
    categoryLabel: 'Healthcare',
    currentWaiting: 4,
    estWaitMinutes: 15,
    estWaitTimeMin: 15,
    avgServiceTimeMin: 10,
    isOpen: true,
    activeCounters: 2,
    branchName: 'Salt Lake Main',
    branchId: 'branch-01',
    distanceKm: 1.2,
    rating: 4.9,
    price: '$20',
  };

  const mockBranch: BranchItem = {
    id: 'branch-01',
    tenantId: 'tenant-apollo',
    name: 'Salt Lake Main Branch',
    address: 'Sector 5, Salt Lake',
    distanceKm: 1.2,
    activeCounters: 3,
    totalWaiting: 8,
    estWaitTimeMin: 18,
    isOpen: true,
    openHours: '9:00 AM - 6:00 PM',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (queuePortalApi.getServicesForTenant as any).mockResolvedValue([mockService]);
    (queuePortalApi.getBranchesForTenant as any).mockResolvedValue([mockBranch]);
  });

  it('starts with initial state at home step with null selections', () => {
    const { result } = renderHook(() => useQueueBookingFlow());

    expect(result.current.currentStep).toBe('home');
    expect(result.current.selectedTenant).toBeNull();
    expect(result.current.selectedService).toBeNull();
    expect(result.current.selectedBranch).toBeNull();
  });

  it('transitions from home to select-org when startBooking is called', () => {
    const { result } = renderHook(() => useQueueBookingFlow());

    act(() => {
      result.current.startBooking();
    });

    expect(result.current.currentStep).toBe('select-org');
  });

  it('progresses to select-service when tenant is selected', async () => {
    const { result } = renderHook(() => useQueueBookingFlow());

    await act(async () => {
      await result.current.handleSelectTenant(mockTenant);
    });

    expect(result.current.selectedTenant).toEqual(mockTenant);
    expect(result.current.currentStep).toBe('select-service');
  });

  it('progresses to select-branch when service is selected', async () => {
    const { result } = renderHook(() => useQueueBookingFlow());

    await act(async () => {
      await result.current.handleSelectTenant(mockTenant);
    });

    await act(async () => {
      await result.current.handleSelectService(mockService);
    });

    expect(result.current.selectedService).toEqual(mockService);
    expect(result.current.currentStep).toBe('select-branch');
  });

  it('progresses to branch-details when branch is selected', async () => {
    const { result } = renderHook(() => useQueueBookingFlow());

    await act(async () => {
      await result.current.handleSelectTenant(mockTenant);
      await result.current.handleSelectService(mockService);
      result.current.handleSelectBranch(mockBranch);
    });

    expect(result.current.selectedBranch).toEqual(mockBranch);
    expect(result.current.currentStep).toBe('branch-details');
  });

  it('handles backward navigation step-by-step', async () => {
    const { result } = renderHook(() => useQueueBookingFlow());

    await act(async () => {
      await result.current.handleSelectTenant(mockTenant);
      await result.current.handleSelectService(mockService);
      result.current.handleSelectBranch(mockBranch);
    });

    expect(result.current.currentStep).toBe('branch-details');

    act(() => {
      result.current.handleGoBack();
    });
    expect(result.current.currentStep).toBe('select-branch');

    act(() => {
      result.current.handleGoBack();
    });
    expect(result.current.currentStep).toBe('select-service');

    act(() => {
      result.current.handleGoBack();
    });
    expect(result.current.currentStep).toBe('select-org');

    act(() => {
      result.current.handleGoBack();
    });
    expect(result.current.currentStep).toBe('home');
  });

  it('resets step back to home cleanly when resetToHome is triggered', async () => {
    const { result } = renderHook(() => useQueueBookingFlow());

    await act(async () => {
      await result.current.handleSelectTenant(mockTenant);
    });

    expect(result.current.currentStep).toBe('select-service');

    act(() => {
      result.current.resetToHome();
    });

    expect(result.current.currentStep).toBe('home');
  });
});

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PopularServiceCard } from './PopularServiceCard';
import type { QueueServiceItem } from '../types/queuePortal.types';

describe('PopularServiceCard Component', () => {
  const mockService: QueueServiceItem = {
    id: 'srv-1',
    name: 'Cash Deposit & Withdrawal',
    categoryLabel: 'Banking',
    tenantId: 'tenant-sbi',
    tenantName: 'State Bank of India',
    serviceName: 'Cash Deposit & Withdrawal',
    category: 'Banking',
    currentWaiting: 6,
    estWaitMinutes: 14,
    estWaitTimeMin: 14,
    avgServiceTimeMin: 5,
    isOpen: true,
    activeCounters: 3,
    branchName: 'Main Branch',
    branchId: 'branch-1',
    distanceKm: 0.8,
    rating: 4.7,
    price: 'Free',
  };

  it('renders service details, wait time, and branch', () => {
    const onViewQueue = vi.fn();
    const onBookSlot = vi.fn();

    render(
      <PopularServiceCard
        service={mockService}
        isSelected={false}
        onViewQueue={onViewQueue}
        onBookSlot={onBookSlot}
      />
    );

    expect(screen.getByText('Cash Deposit & Withdrawal')).toBeDefined();
    expect(screen.getByText('Banking')).toBeDefined();
    expect(screen.getByText('Main Branch')).toBeDefined();
    expect(screen.getByText(/~14 min/i)).toBeDefined();
    expect(screen.getByText(/0.8 km/i)).toBeDefined();
  });

  it('calls onBookSlot when Book slot button is clicked', () => {
    const onViewQueue = vi.fn();
    const onBookSlot = vi.fn();

    render(
      <PopularServiceCard
        service={mockService}
        isSelected={false}
        onViewQueue={onViewQueue}
        onBookSlot={onBookSlot}
      />
    );

    const bookBtn = screen.getByRole('button', { name: /book slot/i });
    fireEvent.click(bookBtn);

    expect(onBookSlot).toHaveBeenCalledWith(mockService);
  });

  it('calls onViewQueue when View queue button is clicked', () => {
    const onViewQueue = vi.fn();
    const onBookSlot = vi.fn();

    render(
      <PopularServiceCard
        service={mockService}
        isSelected={false}
        onViewQueue={onViewQueue}
        onBookSlot={onBookSlot}
      />
    );

    const viewQueueBtn = screen.getByRole('button', { name: /view queue/i });
    fireEvent.click(viewQueueBtn);

    expect(onViewQueue).toHaveBeenCalledWith(mockService);
  });
});

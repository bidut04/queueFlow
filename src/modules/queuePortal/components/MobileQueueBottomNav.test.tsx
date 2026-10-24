import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileQueueBottomNav } from './MobileQueueBottomNav';

describe('MobileQueueBottomNav Component', () => {
  it('renders all 4 navigation items: Home, Services, Branches, Bookings', () => {
    const onChangeTab = vi.fn();
    render(<MobileQueueBottomNav activeTab="home" onChangeTab={onChangeTab} />);

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Services')).toBeDefined();
    expect(screen.getByText('Branches')).toBeDefined();
    expect(screen.getByText('Bookings')).toBeDefined();
  });

  it('applies active black pill styling to the active tab', () => {
    const onChangeTab = vi.fn();
    const { rerender } = render(
      <MobileQueueBottomNav activeTab="home" onChangeTab={onChangeTab} />
    );

    const homeButton = screen.getByTitle('Home');
    expect(homeButton.className).toContain('bg-slate-900');
    expect(homeButton.className).toContain('text-white');

    // Switch active tab to Services
    rerender(<MobileQueueBottomNav activeTab="services" onChangeTab={onChangeTab} />);
    const servicesButton = screen.getByTitle('Services');
    expect(servicesButton.className).toContain('bg-slate-900');
    expect(servicesButton.className).toContain('text-white');
  });

  it('triggers onChangeTab when a tab is clicked', () => {
    const onChangeTab = vi.fn();
    render(<MobileQueueBottomNav activeTab="home" onChangeTab={onChangeTab} />);

    fireEvent.click(screen.getByTitle('Branches'));
    expect(onChangeTab).toHaveBeenCalledWith('branches');

    fireEvent.click(screen.getByTitle('Bookings'));
    expect(onChangeTab).toHaveBeenCalledWith('bookings');
  });

  it('displays notification badge on Bookings when user has active live token', () => {
    const onChangeTab = vi.fn();
    const { container } = render(
      <MobileQueueBottomNav
        activeTab="home"
        onChangeTab={onChangeTab}
        hasActiveLiveToken={true}
      />
    );

    const badge = container.querySelector('.bg-blue-600.animate-pulse');
    expect(badge).not.toBeNull();
  });
});

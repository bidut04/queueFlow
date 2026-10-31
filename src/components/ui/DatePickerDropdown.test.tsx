import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePickerDropdown } from './DatePickerDropdown';

describe('DatePickerDropdown Component', () => {
  it('renders trigger pill with formatted date', () => {
    const fixedDate = new Date(2026, 9, 29); // Oct 29, 2026
    render(<DatePickerDropdown value={fixedDate} />);

    const trigger = screen.getByRole('button', { name: /select date/i });
    expect(trigger).toBeDefined();
    expect(screen.getByText(/Oct 29/i)).toBeDefined();
  });

  it('toggles calendar popover open and closed on click', () => {
    const fixedDate = new Date(2026, 9, 15); // Oct 15, 2026
    render(<DatePickerDropdown value={fixedDate} />);

    // Initially closed
    expect(screen.queryByRole('dialog')).toBeNull();

    // Click trigger pill
    const triggerBtn = screen.getByRole('button');
    fireEvent.click(triggerBtn);

    // Popover is open
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText(/October 2026/i)).toBeDefined();

    // Click trigger again to close
    fireEvent.click(triggerBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('allows month navigation and date selection', () => {
    const handleChange = vi.fn();
    const fixedDate = new Date(2026, 9, 15);
    render(<DatePickerDropdown value={fixedDate} onChange={handleChange} />);

    // Open popover
    fireEvent.click(screen.getByRole('button'));

    // Navigate to next month (November 2026)
    const nextBtn = screen.getByLabelText(/next month/i);
    fireEvent.click(nextBtn);
    expect(screen.getByText(/November 2026/i)).toBeDefined();

    // Click day 20 in November
    const day20Btn = screen.getAllByRole('button', { name: '20' })[0];
    fireEvent.click(day20Btn);

    // Should call onChange with November 20, 2026
    expect(handleChange).toHaveBeenCalledTimes(1);
    const selectedDate: Date = handleChange.mock.calls[0][0];
    expect(selectedDate.getFullYear()).toBe(2026);
    expect(selectedDate.getMonth()).toBe(10); // November
    expect(selectedDate.getDate()).toBe(20);

    // Popover automatically closes after selection
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('selects quick presets (Yesterday, Today, Tomorrow)', () => {
    const handleChange = vi.fn();
    render(<DatePickerDropdown onChange={handleChange} />);

    // Open popover
    fireEvent.click(screen.getByRole('button'));

    // Click Yesterday preset
    const yesterdayBtn = screen.getByText('Yesterday');
    fireEvent.click(yesterdayBtn);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const selected: Date = handleChange.mock.calls[0][0];
    const expected = new Date();
    expected.setDate(expected.getDate() - 1);
    expect(selected.getDate()).toBe(expected.getDate());
  });

  it('closes when pressing Escape key', () => {
    render(<DatePickerDropdown />);

    // Open popover
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeDefined();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

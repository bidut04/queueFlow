import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export interface DatePickerDropdownProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  align?: 'left' | 'right';
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Helpers for date comparisons
const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const formatPillDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = date.getDate();
  const year = date.getFullYear();

  if (isSameDay(date, today)) {
    return `Today, ${monthName} ${dayNum}`;
  }
  if (isSameDay(date, yesterday)) {
    return `Yesterday, ${monthName} ${dayNum}`;
  }
  if (isSameDay(date, tomorrow)) {
    return `Tomorrow, ${monthName} ${dayNum}`;
  }

  return `${dayName}, ${monthName} ${dayNum}, ${year}`;
};

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  value,
  onChange,
  className = '',
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [viewDate, setViewDate] = useState<Date>(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if external value changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setViewDate(value);
    }
  }, [value]);

  // Click outside and Escape key handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
    setIsOpen(false);

    if (onChange) {
      onChange(date);
    }

    // Broadcast globally so other pages (dashboard, bookings, analytics) can listen
    window.dispatchEvent(
      new CustomEvent('qf-date-change', {
        detail: {
          date,
          isoString: date.toISOString(),
          formatted: formatPillDate(date),
        },
      })
    );
  };

  const handlePrevMonth = () => {
    setViewDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() - 1);
      return next;
    });
  };

  const handleNextMonth = () => {
    setViewDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + 1);
      return next;
    });
  };

  const handleJumpToToday = () => {
    const today = new Date();
    handleSelectDate(today);
  };

  const handlePresetSelect = (offsetDays: number) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    handleSelectDate(target);
  };

  // Calendar Grid Calculation
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // First day of current month (0=Sun, 1=Mon, ..., 6=Sat)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Total days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Calendar cells
  const calendarDays: Array<{
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
  }> = [];

  const today = new Date();

  // Leading days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i);
    calendarDays.push({
      date: d,
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
      isSelected: isSameDay(d, selectedDate),
    });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    calendarDays.push({
      date: dateObj,
      isCurrentMonth: true,
      isToday: isSameDay(dateObj, today),
      isSelected: isSameDay(dateObj, selectedDate),
    });
  }

  // Trailing days to fill the final row (up to multiple of 7, max 42)
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextDate = new Date(year, month + 1, d);
    calendarDays.push({
      date: nextDate,
      isCurrentMonth: false,
      isToday: isSameDay(nextDate, today),
      isSelected: isSameDay(nextDate, selectedDate),
    });
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }} className={className}>
      {/* Date Selector Pill (Trigger) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select date"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '5px 11px',
          backgroundColor: isOpen ? '#f1f5f9' : '#ffffff',
          border: `1px solid ${isOpen ? '#3b82f6' : '#e2e8f0'}`,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          color: isOpen ? '#1e40af' : '#334155',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 2px rgba(59, 130, 246, 0.15)' : 'none',
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }
        }}
      >
        <CalendarIcon size={13} color={isOpen ? '#2563eb' : '#64748b'} />
        <span>{formatPillDate(selectedDate)}</span>
        <ChevronDown
          size={12}
          color={isOpen ? '#2563eb' : '#94a3b8'}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Calendar Dropdown Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Calendar date picker"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
            width: 290,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            padding: '12px',
            zIndex: 1000,
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Quick Presets Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <button
              type="button"
              onClick={() => handlePresetSelect(-1)}
              style={{
                flex: 1,
                padding: '4px 6px',
                fontSize: 11,
                fontWeight: 600,
                color: '#475569',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.color = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#475569';
              }}
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={handleJumpToToday}
              style={{
                flex: 1,
                padding: '4px 6px',
                fontSize: 11,
                fontWeight: 700,
                color: isSameDay(selectedDate, today) ? '#1d4ed8' : '#334155',
                backgroundColor: isSameDay(selectedDate, today) ? '#dbeafe' : '#f8fafc',
                border: `1px solid ${isSameDay(selectedDate, today) ? '#93c5fd' : '#e2e8f0'}`,
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.color = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isSameDay(selectedDate, today)
                  ? '#dbeafe'
                  : '#f8fafc';
                e.currentTarget.style.color = isSameDay(selectedDate, today)
                  ? '#1d4ed8'
                  : '#334155';
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect(1)}
              style={{
                flex: 1,
                padding: '4px 6px',
                fontSize: 11,
                fontWeight: 600,
                color: '#475569',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.color = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#475569';
              }}
            >
              Tomorrow
            </button>
          </div>

          {/* Month / Year Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
              padding: '0 4px',
            }}
          >
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              style={{
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <ChevronLeft size={14} />
            </button>

            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
              {MONTH_NAMES[month]} {year}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              style={{
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday Names Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 2,
              marginBottom: 4,
              textAlign: 'center',
            }}
          >
            {DAY_NAMES.map((d) => (
              <span
                key={d}
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#94a3b8',
                  padding: '3px 0',
                }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 3,
            }}
          >
            {calendarDays.map((cell, idx) => {
              const cellDay = cell.date.getDate();
              let cellBg = 'transparent';
              let cellColor = cell.isCurrentMonth ? '#1e293b' : '#cbd5e1';
              let cellBorder = '1px solid transparent';
              let cellFontWeight = cell.isCurrentMonth ? 500 : 400;

              if (cell.isSelected) {
                cellBg = '#2563eb';
                cellColor = '#ffffff';
                cellFontWeight = 700;
              } else if (cell.isToday) {
                cellBorder = '1px solid #3b82f6';
                cellColor = '#2563eb';
                cellFontWeight = 700;
                cellBg = '#eff6ff';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDate(cell.date)}
                  style={{
                    height: 30,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: cellBg,
                    color: cellColor,
                    border: cellBorder,
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: cellFontWeight,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!cell.isSelected) {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      if (!cell.isToday) e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!cell.isSelected) {
                      e.currentTarget.style.backgroundColor = cellBg;
                      e.currentTarget.style.color = cellColor;
                    }
                  }}
                >
                  {cellDay}
                </button>
              );
            })}
          </div>

          {/* Footer Jump to Today */}
          <div
            style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              type="button"
              onClick={handleJumpToToday}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              <RotateCcw size={11} />
              Reset to Today
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 4px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

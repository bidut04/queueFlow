import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X, Loader2 } from 'lucide-react';

export interface ComboBoxOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  badge?: string;
}

export interface ComboBoxProps<T = string> {
  label?: string;
  options: (T | ComboBoxOption<T>)[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: boolean;
  loading?: boolean;
  onOpen?: () => void;
  style?: React.CSSProperties;
}

export function ComboBox<T extends string = string>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Type to search...',
  disabled = false,
  error = false,
  loading = false,
  onOpen,
  style
}: ComboBoxProps<T>): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedOptions = useMemo<ComboBoxOption<T>[]>(() => {
    return options.map((opt) => {
      if (typeof opt === 'object' && opt !== null && 'value' in opt) {
        return opt as ComboBoxOption<T>;
      }
      return { value: opt as T, label: String(opt) };
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q)) ||
        (opt.badge && opt.badge.toLowerCase().includes(q)) ||
        String(opt.value).toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setSearchQuery('');
        onOpen?.();
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      return next;
    });
  };

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        ...style
      }}
    >
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 10.5,
            fontWeight: 600,
            color: '#334155',
            marginBottom: 3
          }}
        >
          {label}
        </label>
      )}

      {/* Control Box Trigger */}
      <div
        onClick={handleToggle}
        style={{
          width: '100%',
          padding: '5px 8px',
          backgroundColor: disabled ? '#f8fafc' : '#ffffff',
          border: `1px solid ${error ? '#ef4444' : isOpen ? '#4f46e5' : '#cbd5e1'}`,
          borderRadius: 5,
          fontSize: 11,
          color: selectedOption ? '#0f172a' : '#94a3b8',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          boxSizing: 'border-box',
          boxShadow: isOpen ? '0 0 0 2px rgba(79, 70, 229, 0.15)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <span style={{ fontWeight: selectedOption ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={13} color="#64748b" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </div>

      {/* Floating ComboBox Search Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Search Input Field inside Dropdown */}
          <div
            style={{
              padding: '6px 8px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#f8fafc'
            }}
          >
            <Search size={12} color="#94a3b8" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: 10.5,
                color: '#0f172a',
                padding: 0
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', display: 'flex' }}
              >
                <X size={12} color="#94a3b8" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div style={{ maxHeight: 180, overflowY: 'auto', padding: '2px 0' }}>
            {loading ? (
              <div style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 11, color: '#4f46e5' }}>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Loading real data from database...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div style={{ padding: '8px 12px', fontSize: 10.5, color: '#94a3b8', textAlign: 'center' }}>
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                      color: isSelected ? '#1d4ed8' : '#0f172a',
                      fontSize: 11,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p style={{ margin: 0, fontWeight: isSelected ? 700 : 500, fontSize: 11, color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                          {opt.label}
                        </p>
                        {opt.badge && (
                          <span style={{ fontSize: 9.5, padding: '1px 5px', borderRadius: 4, backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.sublabel && (
                        <p style={{ margin: '1px 0 0 0', fontSize: 9.5, color: '#64748b' }}>
                          {opt.sublabel}
                        </p>
                      )}
                    </div>

                    {isSelected && <Check size={13} color="#1d4ed8" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const Combobox = ComboBox;

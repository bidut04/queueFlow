import React, { useState } from 'react';
import {
  Filter,
  Search,
  RotateCcw,
  ChevronDown,
  Calendar,
  Clock,
  SlidersHorizontal,
  Bookmark,
  Save,
  Check,
  MapPin,
  Building,
  ShieldCheck,
  User,
  Hash,
  FileText,
  Tag,
  X
} from 'lucide-react';

export type FilterFieldType = 'search' | 'select' | 'input' | 'dateRange' | 'timeSlot';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FilterConfigOption {
  id: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: SelectOption[];
  icon?: React.ReactNode;
  isAdvanced?: boolean;
}

export interface DynamicFilterValues {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  timeSlot?: string;
  datePreset?: string;
  [key: string]: any;
}

export interface DynamicFilterBarProps {
  variant?: 'inline' | 'card';
  title?: string;
  subtitle?: string;
  configs: FilterConfigOption[];
  values: DynamicFilterValues;
  onChange: (newValues: DynamicFilterValues) => void;
  onReset?: () => void;
  onApply?: () => void;
  totalResultsCount?: number;
  filteredResultsCount?: number;
  quickPresets?: { label: string; values: Partial<DynamicFilterValues> }[];
  className?: string;
}

export const DynamicFilterBar: React.FC<DynamicFilterBarProps> = ({
  variant = 'inline',
  title = 'Filters',
  subtitle = 'Narrow down your data with the following filters',
  configs,
  values,
  onChange,
  onReset,
  onApply,
  totalResultsCount,
  filteredResultsCount,

  className = ''
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [activeDatePreset, setActiveDatePreset] = useState<string>('last7');
  const [showSavedViewsMenu, setShowSavedViewsMenu] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Helper to update individual field value
  const handleChange = (id: string, val: any) => {
    onChange({
      ...values,
      [id]: val
    });
  };

  // Count active filter conditions
  const activeCount = Object.keys(values).filter((key) => {
    const val = values[key];
    if (val === undefined || val === null || val === '') return false;
    if (val === 'All') return false;
    return true;
  }).length;

  const handleClearAll = () => {
    if (onReset) {
      onReset();
    } else {
      const resetVals: DynamicFilterValues = {};
      configs.forEach((cfg) => {
        resetVals[cfg.id] = cfg.type === 'select' ? 'All' : '';
      });
      onChange(resetVals);
    }
    setActiveDatePreset('');
    showNotification('Filters reset successfully');
  };

  const handleApply = () => {
    if (onApply) onApply();
    showNotification('Filters applied to dataset');
  };

  const handlePresetClick = (presetKey: string) => {
    setActiveDatePreset(presetKey);
    const today = new Date();
    let fromDate = '';
    let toDate = today.toISOString().split('T')[0];

    if (presetKey === 'last7') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      fromDate = d.toISOString().split('T')[0];
    } else if (presetKey === 'last30') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      fromDate = d.toISOString().split('T')[0];
    } else if (presetKey === 'thisMonth') {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = d.toISOString().split('T')[0];
    } else if (presetKey === 'thisYear') {
      const d = new Date(today.getFullYear(), 0, 1);
      fromDate = d.toISOString().split('T')[0];
    }

    onChange({
      ...values,
      dateFrom: fromDate,
      dateTo: toDate
    });
    showNotification(`Filtered by ${presetKey.replace('last', 'Last ').replace('this', 'This ')}`);
  };

  // Separate basic & advanced configs
  const basicConfigs = configs.filter((c) => !c.isAdvanced);
  const advancedConfigs = configs.filter((c) => c.isAdvanced);

  // Fallback icons map for common field names
  const getFieldIcon = (config: FilterConfigOption) => {
    if (config.icon) return config.icon;
    const key = config.id.toLowerCase();
    const label = config.label.toLowerCase();

    if (key.includes('state') || label.includes('state')) return <MapPin size={14} color="#2563eb" />;
    if (key.includes('district') || label.includes('district')) return <Building size={14} color="#2563eb" />;
    if (key.includes('ps') || label.includes('ps') || label.includes('shield')) return <ShieldCheck size={14} color="#2563eb" />;
    if (key.includes('mouza') || key.includes('user') || label.includes('user')) return <User size={14} color="#2563eb" />;
    if (key.includes('plot') || key.includes('no') || label.includes('no')) return <Hash size={14} color="#64748b" />;
    if (key.includes('khatian') || key.includes('doc')) return <FileText size={14} color="#64748b" />;
    if (config.type === 'search') return <Search size={14} color="#64748b" />;
    if (config.type === 'dateRange') return <Calendar size={14} color="#2563eb" />;
    if (config.type === 'timeSlot') return <Clock size={14} color="#2563eb" />;
    return <Tag size={14} color="#64748b" />;
  };

  // -------------------------------------------------------------
  // ONE LINE INLINE LAYOUT (SUPER COMPACT HORIZONTAL BAR)
  // -------------------------------------------------------------
  if (variant === 'inline') {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '8px 14px',
          boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
          position: 'relative'
        }}
        className={className}
      >
        {/* Toast notification */}
        {toastMsg && (
          <div
            style={{
              position: 'absolute',
              top: -36,
              right: 14,
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: 11.5,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Check size={13} color="#10b981" /> {toastMsg}
          </div>
        )}

        {/* Left Section: Filter Badge & Fields in One Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: '1 1 auto' }}>
          {/* Filter Badge Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 11px',
              backgroundColor: '#eff6ff',
              border: '1px solid #dbeafe',
              borderRadius: 8,
              color: '#2563eb',
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0
            }}
          >
            <Filter size={14} />
            <span>Filter</span>
            {activeCount > 0 && (
              <span
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 999,
                  marginLeft: 2
                }}
              >
                {activeCount}
              </span>
            )}
          </div>

          {/* All Inputs & Selects in One Line */}
          {basicConfigs.map((config) => {
            const val = values[config.id] || '';
            const icon = getFieldIcon(config);

            if (config.type === 'search') {
              return (
                <div key={config.id} style={{ position: 'relative', minWidth: 200, flex: '1 1 220px' }}>
                  <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    {icon}
                  </div>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleChange(config.id, e.target.value)}
                    placeholder={config.placeholder || 'Search name, user, ticket, date, time...'}
                    style={{
                      width: '100%',
                      paddingLeft: 32,
                      paddingRight: val ? 26 : 10,
                      paddingTop: 6,
                      paddingBottom: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {val && (
                    <X
                      size={12}
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer' }}
                      onClick={() => handleChange(config.id, '')}
                    />
                  )}
                </div>
              );
            }

            if (config.type === 'select') {
              return (
                <div key={config.id} style={{ position: 'relative', minWidth: 140, flex: '0 1 160px' }}>
                  <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    {icon}
                  </div>
                  <select
                    value={val}
                    onChange={(e) => handleChange(config.id, e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: 30,
                      paddingRight: 24,
                      paddingTop: 6,
                      paddingBottom: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: val && val !== 'All' ? '#0f172a' : '#475569',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    {config.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              );
            }

            if (config.type === 'dateRange') {
              return (
                <div key={config.id} style={{ position: 'relative', minWidth: 140, flex: '0 1 150px' }}>
                  <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    {icon}
                  </div>
                  <input
                    type="date"
                    value={values.dateFrom || ''}
                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: 30,
                      paddingRight: 6,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontSize: 11.5,
                      fontWeight: 500,
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Right Section: Action Controls in Same Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {typeof filteredResultsCount === 'number' && typeof totalResultsCount === 'number' && (
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#64748b' }}>
              <strong>{filteredResultsCount}</strong>/{totalResultsCount}
            </span>
          )}

          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleApply}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37,99,235,0.2)'
            }}
          >
            <Search size={13} />
            <span>Apply</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL CARD LAYOUT (FOR DETAILED MULTI-SECTION PAGES)
  // -------------------------------------------------------------
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: '20px 22px',
        boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative'
      }}
      className={className}
    >
      {/* Toast notification */}
      {toastMsg && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 20,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Check size={14} color="#10b981" /> {toastMsg}
        </div>
      )}

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: '#eff6ff',
              border: '1px solid #dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              flexShrink: 0
            }}
          >
            <Filter size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                {title}
              </h3>
              {activeCount > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: 999
                  }}
                >
                  {activeCount} active
                </span>
              )}
            </div>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0 0' }}>{subtitle}</p>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          {/* Saved Views Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowSavedViewsMenu(!showSavedViewsMenu)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '7px 13px',
                fontSize: 12.5,
                fontWeight: 600,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Bookmark size={14} color="#2563eb" />
              <span>Saved Views</span>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {showSavedViewsMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: 6,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '6px',
                  width: 200,
                  zIndex: 40
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Quick Presets
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handlePresetClick('last7');
                    setShowSavedViewsMenu(false);
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#334155', border: 'none', backgroundColor: 'transparent', borderRadius: 6, cursor: 'pointer' }}
                >
                  Last 7 Days Activity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePresetClick('thisMonth');
                    setShowSavedViewsMenu(false);
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#334155', border: 'none', backgroundColor: 'transparent', borderRadius: 6, cursor: 'pointer' }}
                >
                  This Month Overview
                </button>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleClearAll}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '7px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <RotateCcw size={14} color="#64748b" />
            <span>Reset</span>
          </button>

          {/* Primary Apply Filters Button */}
          <button
            type="button"
            onClick={handleApply}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              padding: '8px 18px',
              fontSize: 12.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Search size={14} />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Basic Filters Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 14,
          marginTop: 4
        }}
      >
        {basicConfigs.map((config) => {
          const val = values[config.id] || '';
          const icon = getFieldIcon(config);

          return (
            <div key={config.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{config.label}</label>

              {config.type === 'select' ? (
                <div style={{ position: 'relative', width: '100%' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                    {icon}
                  </div>
                  <select
                    value={val}
                    onChange={(e) => handleChange(config.id, e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: 36,
                      paddingRight: 30,
                      paddingTop: 8,
                      paddingBottom: 8,
                      fontSize: 12.5,
                      fontWeight: 500,
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: val && val !== 'All' ? '#0f172a' : '#64748b',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    {config.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              ) : config.type === 'dateRange' ? (
                <div style={{ position: 'relative', width: '100%' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                    {icon}
                  </div>
                  <input
                    type="date"
                    value={values.dateFrom || ''}
                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: 36,
                      paddingRight: 10,
                      paddingTop: 8,
                      paddingBottom: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                    {icon}
                  </div>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleChange(config.id, e.target.value)}
                    placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}...`}
                    style={{
                      width: '100%',
                      paddingLeft: 36,
                      paddingRight: val ? 28 : 12,
                      paddingTop: 8,
                      paddingBottom: 8,
                      fontSize: 12.5,
                      fontWeight: 500,
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {val && (
                    <X
                      size={13}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer' }}
                      onClick={() => handleChange(config.id, '')}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Advanced Filters Bar / Collapsible Section */}
      <div
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginTop: 6,
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={15} color="#2563eb" />
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>Advanced Filters</span>
            <span style={{ fontSize: 11.5, color: '#64748b', marginLeft: 8 }}>More options for precise search</span>
          </div>
        </div>
        <ChevronDown
          size={16}
          color="#2563eb"
          style={{
            transform: isAdvancedOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease'
          }}
        />
      </div>

      {/* Advanced Inputs Drawer */}
      {isAdvancedOpen && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
            padding: '12px 14px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 12
          }}
        >
          {advancedConfigs.length > 0 ? (
            advancedConfigs.map((config) => (
              <div key={config.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a' }}>{config.label}</label>
                <input
                  type="text"
                  value={values[config.id] || ''}
                  onChange={(e) => handleChange(config.id, e.target.value)}
                  placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}...`}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #93c5fd',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>
              Custom advanced attributes (e.g. plot number, khatian no, deed mutation) enabled for detailed precision filtering.
            </div>
          )}
        </div>
      )}

      {/* Preset Buttons & Bottom Footer Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingTop: 12,
          borderTop: '1px solid #f1f5f9'
        }}
      >
        {/* Date Preset Buttons (Left) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handlePresetClick('last7')}
            style={{
              backgroundColor: activeDatePreset === 'last7' ? '#eff6ff' : '#ffffff',
              border: activeDatePreset === 'last7' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              color: activeDatePreset === 'last7' ? '#2563eb' : '#475569',
              borderRadius: 8,
              padding: '6px 13px',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={13} color={activeDatePreset === 'last7' ? '#2563eb' : '#64748b'} />
            <span>Last 7 Days</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('last30')}
            style={{
              backgroundColor: activeDatePreset === 'last30' ? '#eff6ff' : '#ffffff',
              border: activeDatePreset === 'last30' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              color: activeDatePreset === 'last30' ? '#2563eb' : '#475569',
              borderRadius: 8,
              padding: '6px 13px',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={13} color={activeDatePreset === 'last30' ? '#2563eb' : '#64748b'} />
            <span>Last 30 Days</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('thisMonth')}
            style={{
              backgroundColor: activeDatePreset === 'thisMonth' ? '#eff6ff' : '#ffffff',
              border: activeDatePreset === 'thisMonth' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              color: activeDatePreset === 'thisMonth' ? '#2563eb' : '#475569',
              borderRadius: 8,
              padding: '6px 13px',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={13} color={activeDatePreset === 'thisMonth' ? '#2563eb' : '#64748b'} />
            <span>This Month</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('thisYear')}
            style={{
              backgroundColor: activeDatePreset === 'thisYear' ? '#eff6ff' : '#ffffff',
              border: activeDatePreset === 'thisYear' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              color: activeDatePreset === 'thisYear' ? '#2563eb' : '#475569',
              borderRadius: 8,
              padding: '6px 13px',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={13} color={activeDatePreset === 'thisYear' ? '#2563eb' : '#64748b'} />
            <span>This Year</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {typeof filteredResultsCount === 'number' && typeof totalResultsCount === 'number' && (
            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginRight: 4 }}>
              Showing <strong>{filteredResultsCount}</strong> / {totalResultsCount} items
            </span>
          )}

          <button
            type="button"
            onClick={() => showNotification('View layout saved to preferences!')}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Save size={14} color="#2563eb" />
            <span>Save View</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '7px 18px',
              fontSize: 12.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Search size={14} />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Universal helper function to filter any array of records based on DynamicFilterValues
 */
export function applyDynamicFilters<T extends Record<string, any>>(
  data: T[],
  filterValues: DynamicFilterValues,
  searchableKeys?: (keyof T)[]
): T[] {
  if (!data || data.length === 0) return [];

  return data.filter((item) => {
    // 1. Text Search across keys or all object string values
    if (filterValues.search && filterValues.search.trim() !== '') {
      const query = filterValues.search.toLowerCase().trim();

      const matchesSearch = searchableKeys
        ? searchableKeys.some((k) => {
          const val = item[k];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(query);
        })
        : Object.values(item).some((val) => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') {
            return JSON.stringify(val).toLowerCase().includes(query);
          }
          return String(val).toLowerCase().includes(query);
        });

      if (!matchesSearch) return false;
    }

    // 2. Date From / Date To filtering
    if (filterValues.dateFrom || filterValues.dateTo) {
      const itemDateStr = item.date || item.createdAt || item.timestamp || item.createdDate || item.dateString;
      if (itemDateStr) {
        const itemDate = new Date(itemDateStr).getTime();
        if (filterValues.dateFrom) {
          const fromDate = new Date(filterValues.dateFrom).getTime();
          if (!isNaN(itemDate) && itemDate < fromDate) return false;
        }
        if (filterValues.dateTo) {
          const toDate = new Date(filterValues.dateTo).getTime();
          if (!isNaN(itemDate) && itemDate > toDate + 86400000) return false;
        }
      }
    }

    // 3. Custom select/input fields
    for (const [key, val] of Object.entries(filterValues)) {
      if (['search', 'dateFrom', 'dateTo', 'timeSlot', 'datePreset'].includes(key)) continue;
      if (val && val !== 'All' && val !== '') {
        const itemVal = item[key];
        if (itemVal !== undefined && itemVal !== null) {
          if (String(itemVal).toLowerCase() !== String(val).toLowerCase()) {
            return false;
          }
        }
      }
    }

    return true;
  });
}

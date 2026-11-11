import React, { useState } from 'react';
import {
  Table as TableIcon,
  Palette,
  RotateCcw,
  Check,
  Eye,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Layers,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { useThemeCustomization } from '../context/ThemeCustomizationContext';
import { Button } from '../components/ui/Button';
import { ComboBox } from '../components/ui/Combobox';
import type { ComboboxSizeMode } from '../types/theme';

export const CustomizeTablePage: React.FC = () => {
  const {
    customizations,
    updateCustomization,
    updateMultiple,
    resetToDefaults,
    isDark
  } = useThemeCustomization();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewSearch, setPreviewSearch] = useState('');
  const [selectedPreviewRows, setSelectedPreviewRows] = useState<Record<string, boolean>>({
    '1': true
  });
  const [sampleComboboxVal, setSampleComboboxVal] = useState('Option A - General Inquiry');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    resetToDefaults();
    showToast('Reset all styles to default values');
  };

  const handleSave = () => {
    showToast('Customizations saved and active across all tenant pages!');
  };

  // Preset Palettes for Table Header Color
  const HEADER_COLOR_PRESETS = [
    { label: 'Classic Slate', hex: '#f8fafc', text: '#475569' },
    { label: 'Soft Sky', hex: '#f0f9ff', text: '#0369a1' },
    { label: 'Indigo Mist', hex: '#eef2ff', text: '#4338ca' },
    { label: 'Emerald Mint', hex: '#ecfdf5', text: '#047857' },
    { label: 'Deep Slate', hex: '#0f172a', text: '#f8fafc' },
    { label: 'Midnight Navy', hex: '#1e293b', text: '#f1f5f9' },
    { label: 'Royal Blue', hex: '#1e40af', text: '#ffffff' },
    { label: 'Forest Green', hex: '#064e3b', text: '#ffffff' },
    { label: 'Plum Purple', hex: '#581c87', text: '#ffffff' },
    { label: 'Crimson Wine', hex: '#881337', text: '#ffffff' }
  ];

  // Preset Palettes for Sidebar Color
  const SIDEBAR_COLOR_PRESETS = [
    { label: 'Slate Dark', hex: '#0f172a' },
    { label: 'Obsidian Navy', hex: '#0b1329' },
    { label: 'Deep Charcoal', hex: '#18181b' },
    { label: 'Royal Midnight', hex: '#1e1b4b' },
    { label: 'Emerald Forest', hex: '#064e3b' },
    { label: 'Espresso Stone', hex: '#292524' },
    { label: 'Crisp White', hex: '#ffffff' }
  ];

  // Sample Mock Data for Preview
  const sampleTableData = [
    { id: '1', ticket: 'A-102', customer: 'Sarah Jenkins', service: 'VIP Account Consultation', counter: 'Desk 04', status: 'In Progress', waitTime: '3m' },
    { id: '2', ticket: 'B-205', customer: 'Ahmed Al-Mansoor', service: 'Commercial Loan Review', counter: 'Desk 02', status: 'Waiting', waitTime: '12m' },
    { id: '3', ticket: 'C-318', customer: 'Maria Rodriguez', service: 'Foreign Currency Exchange', counter: 'Desk 01', status: 'Completed', waitTime: '7m' },
    { id: '4', ticket: 'A-103', customer: 'David Kim', service: 'Card Renewal & PIN Issue', counter: 'Desk 03', status: 'Waiting', waitTime: '15m' }
  ];

  const getEyeComfortLabel = (val: number) => {
    if (val === 0) return 'Off (0%)';
    if (val <= 25) return `Subtle Daylight (${val}%)`;
    if (val <= 50) return `Balanced Warmth (${val}%)`;
    if (val <= 75) return `Cozy Evening (${val}%)`;
    return `Deep Night Shift (${val}%)`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 24,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            zIndex: 99999,
            border: '1px solid #334155',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Check size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Palette size={16} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main, #0f172a)', margin: 0 }}>
              Customize Table & UI Theme
            </h1>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '4px 0 0 36px' }}>
            Adjust table border radius, table header colors, input field and combobox dimensions, sidebar colors, dark mode, and eye comfort warmth.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RotateCcw size={13} />
            Reset Defaults
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Check size={14} />
            Save Customizations
          </Button>
        </div>
      </div>

      {/* Two-Column Studio Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 440px) minmax(420px, 1fr)',
          gap: 20,
          alignItems: 'start'
        }}
      >
        {/* ==================================================== */}
        {/* LEFT COLUMN: Controls & Sliders                      */}
        {/* ==================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* 1. TABLE CUSTOMIZATION CARD */}
          <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle, #f1f5f9)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TableIcon size={16} color="#2563eb" />
                <h2 style={{ fontSize: 13.5, fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  Table Radius & Header Color
                </h2>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, backgroundColor: '#eff6ff', color: '#2563eb' }}>
                TABLE DESIGN
              </span>
            </div>

            {/* Table Radius Slider */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-main, #334155)' }}>
                  Table Corner Radius
                </label>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a'
                  }}
                >
                  {customizations.tableRadius}px
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={customizations.tableRadius}
                onChange={(e) => updateCustomization('tableRadius', parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
              />

              {/* Quick Preset Pills */}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {[
                  { label: 'Sharp 0px', val: 0 },
                  { label: 'Subtle 6px', val: 6 },
                  { label: 'Standard 8px', val: 8 },
                  { label: 'Smooth 14px', val: 14 },
                  { label: 'Extra 20px', val: 20 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateCustomization('tableRadius', preset.val)}
                    style={{
                      flex: 1,
                      padding: '4px 2px',
                      fontSize: 10,
                      fontWeight: customizations.tableRadius === preset.val ? 800 : 600,
                      borderRadius: 6,
                      border: customizations.tableRadius === preset.val ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: customizations.tableRadius === preset.val ? '#eff6ff' : '#ffffff',
                      color: customizations.tableRadius === preset.val ? '#1d4ed8' : '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Header Color Picker */}
            <div style={{ borderTop: '1px solid var(--border-subtle, #f1f5f9)', paddingTop: 14 }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--text-main, #334155)', marginBottom: 8 }}>
                Table Header Color
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                {/* Visual Native Color Picker input */}
                <div style={{ position: 'relative', width: 40, height: 34, borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1', cursor: 'pointer', flexShrink: 0 }}>
                  <input
                    type="color"
                    value={customizations.tableHeaderBg.startsWith('#') ? customizations.tableHeaderBg : '#f8fafc'}
                    onChange={(e) => updateCustomization('tableHeaderBg', e.target.value)}
                    style={{
                      position: 'absolute',
                      top: -6,
                      left: -6,
                      width: 52,
                      height: 46,
                      border: 'none',
                      cursor: 'pointer',
                      background: 'none'
                    }}
                  />
                </div>

                {/* Hex Code Input */}
                <input
                  type="text"
                  value={customizations.tableHeaderBg}
                  onChange={(e) => updateCustomization('tableHeaderBg', e.target.value)}
                  placeholder="#f8fafc"
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    fontSize: 11.5,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    backgroundColor: '#ffffff'
                  }}
                />

                {/* Text Color Switcher for Contrast */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    type="button"
                    title="Dark header text"
                    onClick={() => updateCustomization('tableHeaderText', '#475569')}
                    style={{
                      padding: '5px 8px',
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 5,
                      border: customizations.tableHeaderText === '#475569' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    Dark Text
                  </button>
                  <button
                    type="button"
                    title="Light/White header text"
                    onClick={() => updateCustomization('tableHeaderText', '#ffffff')}
                    style={{
                      padding: '5px 8px',
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 5,
                      border: customizations.tableHeaderText === '#ffffff' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    White Text
                  </button>
                </div>
              </div>

              {/* Swatch Presets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {HEADER_COLOR_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => updateMultiple({ tableHeaderBg: p.hex, tableHeaderText: p.text })}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 4px',
                      borderRadius: 6,
                      border: customizations.tableHeaderBg === p.hex ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: 20,
                        borderRadius: 4,
                        backgroundColor: p.hex,
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. FIELD RADIUS & COMBOBOX SIZING CARD */}
          <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle, #f1f5f9)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sliders size={16} color="#7c3aed" />
                <h2 style={{ fontSize: 13.5, fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  Field Radius & Combobox Sizing
                </h2>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                CONTROLS
              </span>
            </div>

            {/* Field Radius Slider */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-main, #334155)' }}>
                  Input Field Border Radius
                </label>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a'
                  }}
                >
                  {customizations.fieldRadius}px
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={customizations.fieldRadius}
                onChange={(e) => updateCustomization('fieldRadius', parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
              />

              {/* Field Radius Presets */}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {[
                  { label: 'Square 0px', val: 0 },
                  { label: 'Soft 6px', val: 6 },
                  { label: 'Standard 8px', val: 8 },
                  { label: 'Curved 14px', val: 14 },
                  { label: 'Pill 22px', val: 22 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateCustomization('fieldRadius', preset.val)}
                    style={{
                      flex: 1,
                      padding: '4px 2px',
                      fontSize: 10,
                      fontWeight: customizations.fieldRadius === preset.val ? 800 : 600,
                      borderRadius: 6,
                      border: customizations.fieldRadius === preset.val ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                      backgroundColor: customizations.fieldRadius === preset.val ? '#f5f3ff' : '#ffffff',
                      color: customizations.fieldRadius === preset.val ? '#6d28d9' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Combobox Size & Radius */}
            <div style={{ borderTop: '1px solid var(--border-subtle, #f1f5f9)', paddingTop: 14 }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--text-main, #334155)', marginBottom: 8 }}>
                Combobox Size & Density
              </label>

              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                  { id: 'compact', label: 'Compact (28px)', desc: 'High density counters' },
                  { id: 'standard', label: 'Standard (34px)', desc: 'Balanced operational' },
                  { id: 'comfortable', label: 'Roomy (40px)', desc: 'Touch and accessible' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateCustomization('comboboxSize', s.id as ComboboxSizeMode)}
                    style={{
                      flex: 1,
                      padding: '8px 6px',
                      borderRadius: 8,
                      border: customizations.comboboxSize === s.id ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                      backgroundColor: customizations.comboboxSize === s.id ? '#f5f3ff' : '#ffffff',
                      color: customizations.comboboxSize === s.id ? '#6d28d9' : '#475569',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800 }}>{s.label}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{s.desc}</div>
                  </button>
                ))}
              </div>

              {/* Combobox Radius Slider */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-main, #334155)' }}>
                  Combobox Corner Radius
                </label>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a'
                  }}
                >
                  {customizations.comboboxRadius}px
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={customizations.comboboxRadius}
                onChange={(e) => updateCustomization('comboboxRadius', parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* 3. SIDEBAR BRAND COLOR */}
          <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle, #f1f5f9)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={16} color="#0284c7" />
                <h2 style={{ fontSize: 13.5, fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  Sidebar Color Theme
                </h2>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                NAVIGATION
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: 40, height: 34, borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1', cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="color"
                  value={customizations.sidebarColor.startsWith('#') ? customizations.sidebarColor : '#0f172a'}
                  onChange={(e) => updateCustomization('sidebarColor', e.target.value)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    width: 52,
                    height: 46,
                    border: 'none',
                    cursor: 'pointer',
                    background: 'none'
                  }}
                />
              </div>

              <input
                type="text"
                value={customizations.sidebarColor}
                onChange={(e) => updateCustomization('sidebarColor', e.target.value)}
                placeholder="#0f172a"
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: 11.5,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            {/* Sidebar Presets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {SIDEBAR_COLOR_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => updateCustomization('sidebarColor', p.hex)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: customizations.sidebarColor === p.hex ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      backgroundColor: p.hex,
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  />
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. DARK THEME & EYE COMFORT MODE */}
          <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle, #f1f5f9)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Eye size={16} color="#d97706" />
                <h2 style={{ fontSize: 13.5, fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  Dark Theme & Eye Comfort Mode
                </h2>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, backgroundColor: '#fef3c7', color: '#b45309' }}>
                ERGONOMICS
              </span>
            </div>

            {/* Dark Mode Switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, backgroundColor: 'var(--bg-app, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)' }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                  Dark Theme Mode
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 10.5, color: 'var(--text-muted, #64748b)' }}>
                  Transforms surfaces to comfortable dark slate tones.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => updateCustomization('themeMode', 'light')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 9px',
                    borderRadius: 6,
                    border: !isDark ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: !isDark ? '#eff6ff' : '#ffffff',
                    color: !isDark ? '#1d4ed8' : '#64748b',
                    fontSize: 10.5,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Sun size={13} /> Light
                </button>
                <button
                  type="button"
                  onClick={() => updateCustomization('themeMode', 'dark')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 9px',
                    borderRadius: 6,
                    border: isDark ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#60a5fa' : '#64748b',
                    fontSize: 10.5,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Moon size={13} /> Dark
                </button>
              </div>
            </div>

            {/* Eye Comfort Mode with Live Warmth Slider */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Eye size={14} color="#d97706" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                      Eye Comfort Mode (Blue-Light Filter)
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: 10.5, color: 'var(--text-muted, #64748b)' }}>
                    {getEyeComfortLabel(customizations.eyeComfortEnabled ? customizations.eyeComfortLevel : 0)}
                  </p>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={customizations.eyeComfortEnabled}
                    onChange={(e) => updateCustomization('eyeComfortEnabled', e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#d97706' }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 800, color: customizations.eyeComfortEnabled ? '#d97706' : '#94a3b8' }}>
                    {customizations.eyeComfortEnabled ? 'ACTIVE' : 'OFF'}
                  </span>
                </label>
              </div>

              {/* Slider for Warmth adjustment */}
              <div style={{ opacity: customizations.eyeComfortEnabled ? 1 : 0.45, transition: 'opacity 0.15s ease' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  disabled={!customizations.eyeComfortEnabled}
                  value={customizations.eyeComfortLevel}
                  onChange={(e) => updateCustomization('eyeComfortLevel', parseInt(e.target.value, 10))}
                  style={{
                    width: '100%',
                    accentColor: '#d97706',
                    cursor: customizations.eyeComfortEnabled ? 'pointer' : 'not-allowed'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginTop: 8 }}>
                  {[
                    { label: 'Mild', val: 20 },
                    { label: 'Balanced', val: 40 },
                    { label: 'Warm', val: 65 },
                    { label: 'Max Night', val: 95 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      disabled={!customizations.eyeComfortEnabled}
                      onClick={() => updateCustomization('eyeComfortLevel', p.val)}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 5,
                        border: '1px solid #fde68a',
                        backgroundColor: customizations.eyeComfortLevel === p.val ? '#fef3c7' : '#fffbeb',
                        color: '#b45309',
                        cursor: customizations.eyeComfortEnabled ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {p.label} ({p.val}%)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: Real-Time Live Preview Studio          */}
        {/* ==================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Preview Banner */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              backgroundColor: isDark ? '#192237' : '#eff6ff',
              border: `1px solid ${isDark ? '#1e293b' : '#bfdbfe'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} color="#3b82f6" />
              <span style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#93c5fd' : '#1d4ed8' }}>
                Real-Time Component Preview
              </span>
            </div>
            <span style={{ fontSize: 10.5, color: isDark ? '#cbd5e1' : '#3b82f6', fontWeight: 600 }}>
              Live updates as you slide & pick colors
            </span>
          </div>

          {/* LIVE TABLE PREVIEW CONTAINER */}
          <div
            className="bg-white border border-slate-200 shadow-sm overflow-hidden"
            style={{
              borderRadius: `${customizations.tableRadius}px`,
              transition: 'border-radius 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              backgroundColor: 'var(--bg-card, #ffffff)'
            }}
          >
            {/* Table Top Toolbar */}
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
                backgroundColor: isDark ? '#111827' : '#fafafa'
              }}
            >
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  Active Queue & Bookings
                </h3>
                <span style={{ fontSize: 10, color: 'var(--text-muted, #64748b)' }}>
                  Demonstrating Table Radius ({customizations.tableRadius}px) and Header Styling
                </span>
              </div>

              {/* Search with dynamic field radius */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', width: 170 }}>
                  <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    placeholder="Search preview..."
                    style={{
                      width: '100%',
                      paddingLeft: 26,
                      paddingRight: 8,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontSize: 10.5,
                      border: '1px solid #cbd5e1',
                      borderRadius: `${customizations.fieldRadius}px`,
                      outline: 'none',
                      backgroundColor: 'var(--bg-card, #ffffff)',
                      color: 'var(--text-main, #0f172a)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* The Actual Table Element */}
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        backgroundColor: customizations.tableHeaderBg,
                        color: customizations.tableHeaderText,
                        padding: '9px 12px',
                        fontSize: 11,
                        fontWeight: 700,
                        textAlign: 'center',
                        width: 38,
                        borderBottom: '1.5px solid var(--border-color, #e2e8f0)',
                        transition: 'background-color 0.2s ease, color 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Object.keys(selectedPreviewRows).length === sampleTableData.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPreviewRows({ '1': true, '2': true, '3': true, '4': true });
                          } else {
                            setSelectedPreviewRows({});
                          }
                        }}
                        style={{ cursor: 'pointer', accentColor: '#2563eb' }}
                      />
                    </th>

                    {['Ticket', 'Customer', 'Service Details', 'Counter', 'Status', 'Wait Time'].map((col) => (
                      <th
                        key={col}
                        style={{
                          backgroundColor: customizations.tableHeaderBg,
                          color: customizations.tableHeaderText,
                          padding: '9px 12px',
                          fontSize: 11,
                          fontWeight: 700,
                          textAlign: col === 'Wait Time' ? 'right' : 'left',
                          borderBottom: '1.5px solid var(--border-color, #e2e8f0)',
                          userSelect: 'none',
                          whiteSpace: 'nowrap',
                          transition: 'background-color 0.2s ease, color 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: col === 'Wait Time' ? 'flex-end' : 'flex-start' }}>
                          <span>{col}</span>
                          <ArrowUpDown size={10} style={{ opacity: 0.6 }} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {sampleTableData.map((row) => {
                    const isSelected = Boolean(selectedPreviewRows[row.id]);
                    return (
                      <tr
                        key={row.id}
                        style={{
                          backgroundColor: isSelected
                            ? isDark ? 'rgba(37,99,235,0.2)' : '#eff6ff'
                            : 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ textAlign: 'center', padding: '9px 12px', borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              setSelectedPreviewRows((prev) => ({
                                ...prev,
                                [row.id]: e.target.checked
                              }));
                            }}
                            style={{ cursor: 'pointer', accentColor: '#2563eb' }}
                          />
                        </td>

                        <td style={{ padding: '9px 12px', fontSize: 11.5, fontWeight: 800, color: '#2563eb', borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                          {row.ticket}
                        </td>

                        <td style={{ padding: '9px 12px', fontSize: 11.5, fontWeight: 700, color: 'var(--text-main, #0f172a)', borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                          {row.customer}
                        </td>

                        <td style={{ padding: '9px 12px', fontSize: 11, color: 'var(--text-muted, #475569)', borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                          {row.service}
                        </td>

                        <td style={{ padding: '9px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-main, #0f172a)', borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                          {row.counter}
                        </td>

                        <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 7px',
                              borderRadius: 999,
                              fontSize: 9.5,
                              fontWeight: 700,
                              backgroundColor:
                                row.status === 'Completed'
                                  ? '#ecfdf5'
                                  : row.status === 'In Progress'
                                  ? '#eff6ff'
                                  : '#fffbeb',
                              color:
                                row.status === 'Completed'
                                  ? '#059669'
                                  : row.status === 'In Progress'
                                  ? '#2563eb'
                                  : '#d97706',
                              border: `1px solid ${
                                row.status === 'Completed'
                                  ? '#a7f3d0'
                                  : row.status === 'In Progress'
                                  ? '#bfdbfe'
                                  : '#fde68a'
                              }`
                            }}
                          >
                            {row.status}
                          </span>
                        </td>

                        <td style={{ padding: '9px 12px', fontSize: 11, textAlign: 'right', fontWeight: 700, color: 'var(--text-muted, #64748b)', borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                          {row.waitTime}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border-subtle, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10.5, color: '#64748b', backgroundColor: isDark ? '#111827' : '#fafafa' }}>
              <span>Showing 4 of 4 sample preview entries</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" disabled style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'not-allowed', fontSize: 10 }}>Prev</button>
                <button type="button" style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid #2563eb', backgroundColor: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700 }}>1</button>
                <button type="button" disabled style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'not-allowed', fontSize: 10 }}>Next</button>
              </div>
            </div>
          </div>

          {/* LIVE FORM CONTROLS PREVIEW */}
          <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0, color: 'var(--text-main, #0f172a)' }}>
              Interactive Input Field & Combobox Preview
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Field Radius demonstration input */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-main, #475569)', marginBottom: 4 }}>
                  Text Field (Radius: {customizations.fieldRadius}px)
                </label>
                <input
                  type="text"
                  defaultValue="Customer Full Name"
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    fontSize: 11.5,
                    border: '1px solid #cbd5e1',
                    borderRadius: `${customizations.fieldRadius}px`,
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    color: 'var(--text-main, #0f172a)',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Combobox demonstration */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-main, #475569)', marginBottom: 4 }}>
                  Combobox ({customizations.comboboxSize}, {customizations.comboboxRadius}px)
                </label>
                <ComboBox
                  options={[
                    'Option A - General Inquiry',
                    'Option B - Business Account',
                    'Option C - Card Services'
                  ]}
                  value={sampleComboboxVal}
                  onChange={(v) => setSampleComboboxVal(v)}
                />
              </div>
            </div>
          </div>

          {/* LIVE MINIATURE SIDEBAR PREVIEW */}
          <div className="qf-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                Sidebar Mockup ({customizations.sidebarColor})
              </h3>
              <span style={{ fontSize: 10, color: '#64748b' }}>Applies instantly to main left sidebar</span>
            </div>

            <div
              style={{
                height: 72,
                borderRadius: 10,
                backgroundColor: customizations.sidebarColor,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12 }}>
                  QF
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800 }}>QueueFlow Tenant</div>
                  <div style={{ fontSize: 9.5, opacity: 0.7 }}>Theme: {customizations.sidebarColor}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {['Dashboard', 'Bookings', 'Master'].map((item, idx) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: 6,
                      backgroundColor: idx === 0 ? '#2563eb' : 'rgba(255,255,255,0.1)',
                      color: '#ffffff'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

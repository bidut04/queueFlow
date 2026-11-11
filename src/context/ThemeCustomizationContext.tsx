import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { TableCustomizations, ThemeCustomizationContextType } from '../types/theme';

const STORAGE_KEY = 'queflow_theme_customizations';

export const DEFAULT_CUSTOMIZATIONS: TableCustomizations = {
  tableRadius: 8,
  tableHeaderBg: '#f8fafc',
  tableHeaderText: '#475569',
  fieldRadius: 8,
  comboboxSize: 'standard',
  comboboxRadius: 6,
  sidebarColor: '#0f172a',
  themeMode: 'light',
  eyeComfortEnabled: false,
  eyeComfortLevel: 35,
};

const ThemeCustomizationContext = createContext<ThemeCustomizationContextType | undefined>(undefined);

export const ThemeCustomizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customizations, setCustomizations] = useState<TableCustomizations>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CUSTOMIZATIONS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse saved customizations:', e);
    }
    return DEFAULT_CUSTOMIZATIONS;
  });

  // Calculate whether dark mode is currently effective
  const isDark = useMemo(() => {
    if (customizations.themeMode === 'dark') return true;
    if (customizations.themeMode === 'light') return false;
    // System preference fallback
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, [customizations.themeMode]);

  // Apply customizations to CSS root variables & DOM attributes
  useEffect(() => {
    const root = document.documentElement;

    // 1. Table Radius
    root.style.setProperty('--qf-table-radius', `${customizations.tableRadius}px`);

    // 2. Table Header Color & Text Color
    const effectiveHeaderBg = isDark && customizations.tableHeaderBg === DEFAULT_CUSTOMIZATIONS.tableHeaderBg
      ? '#192237'
      : customizations.tableHeaderBg;
    root.style.setProperty('--qf-table-header-bg', effectiveHeaderBg);
    root.style.setProperty('--qf-table-header-text', customizations.tableHeaderText);

    // 3. Field Radius
    root.style.setProperty('--qf-field-radius', `${customizations.fieldRadius}px`);

    // 4. Combobox Sizing & Radius
    root.style.setProperty('--qf-combobox-radius', `${customizations.comboboxRadius}px`);
    let cbHeight = '34px';
    let cbPadding = '5px 9px';
    let cbFontSize = '11.5px';
    if (customizations.comboboxSize === 'compact') {
      cbHeight = '28px';
      cbPadding = '3px 7px';
      cbFontSize = '10.5px';
    } else if (customizations.comboboxSize === 'comfortable') {
      cbHeight = '40px';
      cbPadding = '8px 12px';
      cbFontSize = '12.5px';
    }
    root.style.setProperty('--qf-combobox-height', cbHeight);
    root.style.setProperty('--qf-combobox-padding', cbPadding);
    root.style.setProperty('--qf-combobox-font-size', cbFontSize);

    // 5. Sidebar Background Color
    root.style.setProperty('--bg-sidebar', customizations.sidebarColor);

    // 6. Eye Comfort Warmth
    const effectiveWarmth = customizations.eyeComfortEnabled ? customizations.eyeComfortLevel : 0;
    root.style.setProperty('--qf-eye-comfort-warmth', `${effectiveWarmth}%`);

    // 7. Dark Mode class on <html>
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customizations));
    } catch (e) {
      console.warn('Failed to persist customizations to localStorage:', e);
    }
  }, [customizations, isDark]);

  const updateCustomization = useCallback(<K extends keyof TableCustomizations>(
    key: K,
    value: TableCustomizations[K]
  ) => {
    setCustomizations((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateMultiple = useCallback((partial: Partial<TableCustomizations>) => {
    setCustomizations((prev) => ({
      ...prev,
      ...partial,
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setCustomizations(DEFAULT_CUSTOMIZATIONS);
  }, []);

  const value = useMemo(
    () => ({
      customizations,
      updateCustomization,
      updateMultiple,
      resetToDefaults,
      isDark,
    }),
    [customizations, updateCustomization, updateMultiple, resetToDefaults, isDark]
  );

  return (
    <ThemeCustomizationContext.Provider value={value}>
      {children}
    </ThemeCustomizationContext.Provider>
  );
};

export const useThemeCustomization = (): ThemeCustomizationContextType => {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error('useThemeCustomization must be used within a ThemeCustomizationProvider');
  }
  return context;
};

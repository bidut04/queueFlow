export type ThemeMode = 'light' | 'dark' | 'system';
export type ComboboxSizeMode = 'compact' | 'standard' | 'comfortable';

export interface TableCustomizations {
  // Table Styling
  tableRadius: number; // 0 to 24px
  tableHeaderBg: string; // Hex color
  tableHeaderText: string; // Hex color or 'auto'
  
  // Field & Combobox Styling
  fieldRadius: number; // 0 to 24px
  comboboxSize: ComboboxSizeMode; // compact, standard, comfortable
  comboboxRadius: number; // 0 to 20px

  // Sidebar & Navigation Styling
  sidebarColor: string; // Hex color

  // Global Theme & Comfort
  themeMode: ThemeMode; // light, dark, system
  eyeComfortEnabled: boolean;
  eyeComfortLevel: number; // 0 to 100%
}

export interface ThemeCustomizationContextType {
  customizations: TableCustomizations;
  updateCustomization: <K extends keyof TableCustomizations>(
    key: K,
    value: TableCustomizations[K]
  ) => void;
  updateMultiple: (partial: Partial<TableCustomizations>) => void;
  resetToDefaults: () => void;
  isDark: boolean;
}


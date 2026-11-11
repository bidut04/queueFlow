import React from 'react';
import { useThemeCustomization } from '../../context/ThemeCustomizationContext';

export const EyeComfortOverlay: React.FC = () => {
  const { customizations } = useThemeCustomization();

  if (!customizations.eyeComfortEnabled || customizations.eyeComfortLevel <= 0) {
    return null;
  }

  // Calculate warm amber/orange tint opacity based on slider (0 to 100)
  // 35% gives ~0.11 opacity (gentle evening warmth)
  // 100% gives ~0.28 opacity (deep night shift warmth)
  const opacity = (customizations.eyeComfortLevel / 100) * 0.28;

  return (
    <div
      id="qf-eye-comfort-overlay"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
        backgroundColor: `rgba(255, 175, 45, ${opacity})`,
        mixBlendMode: 'multiply',
        transition: 'background-color 0.15s ease',
      }}
    />
  );
};


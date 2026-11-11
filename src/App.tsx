import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/ui/Toast';
import { SocketProvider } from './socket';
import { ThemeCustomizationProvider } from './context/ThemeCustomizationContext';
import { EyeComfortOverlay } from './components/ui/EyeComfortOverlay';

export const App: React.FC = () => {
  return (
    <ThemeCustomizationProvider>
      <SocketProvider>
        <AppLayout />
        <ToastContainer position="top-right" />
        <EyeComfortOverlay />
      </SocketProvider>
    </ThemeCustomizationProvider>
  );
};

export default App;

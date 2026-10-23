import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/ui/Toast';
import { SocketProvider } from './socket';

export const App: React.FC = () => {
  return (
    <SocketProvider>
      <AppLayout />
      <ToastContainer position="top-right" />
    </SocketProvider>
  );
};

export default App;

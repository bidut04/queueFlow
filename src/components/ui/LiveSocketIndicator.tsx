import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Radio } from 'lucide-react';
import { useSocket } from '../../socket';

export const LiveSocketIndicator: React.FC = () => {
  const { status, isConnected, activeRooms, lastEvent, reconnect } = useSocket();
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return '#10b981'; // emerald-500
      case 'connecting':
        return '#f59e0b'; // amber-500
      case 'error':
        return '#ef4444'; // red-500
      case 'disconnected':
      default:
        return '#94a3b8'; // slate-400
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connected':
        return 'Live Realtime';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Socket Error';
      case 'disconnected':
      default:
        return 'Offline';
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 9px',
          borderRadius: 999,
          backgroundColor: isConnected ? '#f0fdf4' : status === 'connecting' ? '#fffbeb' : '#f8fafc',
          border: `1px solid ${
            isConnected ? '#bbf7d0' : status === 'connecting' ? '#fde68a' : '#e2e8f0'
          }`,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}
        onClick={() => {
          if (!isConnected) {
            reconnect();
          }
        }}
      >
        {/* Pulsing indicator dot */}
        <span style={{ position: 'relative', display: 'flex', width: 7, height: 7 }}>
          {isConnected && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                opacity: 0.75,
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
          )}
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              borderRadius: '50%',
              width: 7,
              height: 7,
              backgroundColor: getStatusColor(),
            }}
          />
        </span>

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: isConnected ? '#15803d' : status === 'connecting' ? '#b45309' : '#64748b',
            letterSpacing: '0.2px',
          }}
        >
          {getStatusLabel()}
        </span>

        {!isConnected && (
          <RefreshCw
            size={10}
            color="#64748b"
            style={{
              marginLeft: 2,
              animation: status === 'connecting' ? 'spin 1s linear infinite' : 'none',
            }}
          />
        )}
      </div>

      {/* Floating Hover Info Card */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 250,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
            padding: '10px 12px',
            zIndex: 1000,
            fontSize: 11,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isConnected ? <Wifi size={13} color="#10b981" /> : <WifiOff size={13} color="#ef4444" />}
              <span style={{ fontWeight: 800, color: '#0f172a' }}>WebSocket Engine</span>
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 5px',
                borderRadius: 4,
                backgroundColor: isConnected ? '#dcfce7' : '#fee2e2',
                color: isConnected ? '#15803d' : '#b91c1c',
              }}
            >
              {status}
            </span>
          </div>

          <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: 10.5, lineHeight: 1.4 }}>
            {isConnected
              ? 'Real-time WebSocket connection is active. Queue tokens, displays, and bookings update instantly.'
              : 'Socket is offline or waiting for token authentication.'}
          </p>

          {activeRooms.length > 0 && (
            <div style={{ marginBottom: 6, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: 700, color: '#334155', fontSize: 10 }}>Subscribed Rooms:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                {activeRooms.map((room) => (
                  <span
                    key={room}
                    style={{
                      fontSize: 9.5,
                      fontFamily: 'monospace',
                      backgroundColor: '#f1f5f9',
                      padding: '1px 5px',
                      borderRadius: 4,
                      color: '#475569',
                    }}
                  >
                    {room}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lastEvent && (
            <div style={{ marginBottom: 6, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <Radio size={10} color="#3b82f6" />
                <span style={{ fontWeight: 700, color: '#334155', fontSize: 10 }}>Last Event:</span>
              </div>
              <span style={{ fontSize: 9.5, color: '#2563eb', fontFamily: 'monospace' }}>
                {lastEvent.eventType}
              </span>
            </div>
          )}

          {!isConnected && (
            <button
              type="button"
              onClick={reconnect}
              style={{
                width: '100%',
                marginTop: 6,
                padding: '5px 8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              <RefreshCw size={11} />
              <span>Reconnect Now</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

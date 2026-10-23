import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { platformStore } from '../services/platformState';
import { usePlatformHealth } from '../hooks';
import type { SystemComponentHealth } from '../types/platform';

export const SystemHealthPage: React.FC = () => {
  const { data: liveHealth, refetch } = usePlatformHealth();
  const [components, setComponents] = useState<SystemComponentHealth[]>(

    liveHealth || platformStore.systemHealth
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (liveHealth && liveHealth.length > 0) {
      setComponents(liveHealth);
    }
  }, [liveHealth]);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setComponents([...platformStore.systemHealth]);
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      refetch(),
      platformStore.loadFromBackend()
    ]);
    setIsRefreshing(false);
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return { color: '#047857', bg: '#d1fae5', border: '#a7f3d0', icon: CheckCircle2 };
      case 'DEGRADED':
        return { color: '#b45309', bg: '#fef3c7', border: '#fde68a', icon: AlertTriangle };
      case 'DOWN':
        return { color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5', icon: AlertTriangle };
      default:
        return { color: '#4b5563', bg: '#f3f4f6', border: '#e5e7eb', icon: Server };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Technical Platform Health Dashboard
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, margin: 0 }}>
            Realtime heartbeat monitor for ingress API, DB shards, Redis cache, Kafka event stream, Socket.IO, outbox processor & background workers.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: '8px 16px',
            fontSize: 12.5,
            fontWeight: 700,
            color: '#334155',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh Heartbeats
        </button>
      </div>

      {/* Health Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {components.map((item) => {
          const badge = getStatusBadge(item.status);
          const Icon = badge.icon;
          return (
            <div
              key={item.id}
              className="qf-card"
              style={{
                padding: 18,
                borderLeft: `4px solid ${badge.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={badge.color} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{item.name}</h3>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{item.type}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 4,
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`
                    }}
                  >
                    ● {item.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '14px 0 10px 0', padding: 10, backgroundColor: '#f8fafc', borderRadius: 6, fontSize: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Latency</span>
                    <strong style={{ color: '#0f172a' }}>{item.latencyMs} ms</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Last Heartbeat</span>
                    <strong style={{ color: '#0f172a' }}>{item.lastHeartbeatSec}s ago</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Error Rate</span>
                    <strong style={{ color: item.errorRatePercent > 1 ? '#ef4444' : '#10b981' }}>
                      {item.errorRatePercent}%
                    </strong>
                  </div>
                </div>

                {item.details && (
                  <p style={{ margin: 0, fontSize: 11.5, color: '#475569', lineHeight: 1.4 }}>
                    {item.details}
                  </p>
                )}
              </div>

              {item.lastFailureTime && (
                <div style={{ marginTop: 10, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
                  Last failure recorded: {item.lastFailureTime}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

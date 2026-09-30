import React, { useMemo } from 'react';
import { Server, ShieldCheck, Cpu } from 'lucide-react';
import { platformStore } from '../../services/platformState';
import { ComboBox, type ComboBoxOption } from '../../../../components/ui/Combobox';

export interface Step3Data {
  preferredShardId: string;
  autoFailover: boolean;
  isolationLevel: 'SHARED_SHARD' | 'DEDICATED_SHARD';
}

interface Step3InfrastructureProps {
  data: Step3Data;
  onChange: (fields: Partial<Step3Data>) => void;
}

export const Step3Infrastructure: React.FC<Step3InfrastructureProps> = ({
  data,
  onChange
}) => {
  const shards = platformStore.shards;
  const selectedShard = shards.find((s) => s.id === data.preferredShardId) || shards[0];

  const shardOptions = useMemo<ComboBoxOption[]>(() => {
    return shards.map((s) => ({
      value: s.id,
      label: `${s.id} (${s.region})`,
      sublabel: `${s.tenantCount} Orgs enrolled • ${s.utilizationPercent}% Capacity • Health: ${s.dbHealth}`
    }));
  }, [shards]);

  return (
    <div className="qf-card" style={{ padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Step 3: Database Shard Ring & Infrastructure Topology
        </h3>
        <p style={{ fontSize: 10.5, color: '#64748b', margin: '2px 0 0 0' }}>
          Assign the tenant organization to a low-latency database shard ring and configure high-availability failover policies.
        </p>
      </div>

      <div className="qf-form-grid-2">
        {/* Preferred Shard ComboBox */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Assigned Database Shard <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <ComboBox
            options={shardOptions}
            value={data.preferredShardId}
            onChange={(val) => onChange({ preferredShardId: val })}
            searchPlaceholder="Search database shard or region..."
          />

          {/* Shard Spec Detail Box */}
          <div
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: '#f8fafc',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              fontSize: 11,
              color: '#475569'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              <Server size={14} color="#4f46e5" />
              <span>Shard Ring Specs: {selectedShard.id}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 10.5 }}>
              <div><strong>Region:</strong> {selectedShard.region}</div>
              <div><strong>DB Health:</strong> {selectedShard.dbHealth}</div>
              <div><strong>Utilization:</strong> {selectedShard.utilizationPercent}%</div>
              <div><strong>Capacity:</strong> {selectedShard.tenantCount}/{selectedShard.capacityTenants} Orgs</div>
            </div>
          </div>
        </div>

        {/* Isolation & HA Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Isolation Mode Card */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: 10, backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Cpu size={14} color="#0284c7" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Data Isolation Topology</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                type="button"
                onClick={() => onChange({ isolationLevel: 'SHARED_SHARD' })}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: data.isolationLevel === 'SHARED_SHARD' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: data.isolationLevel === 'SHARED_SHARD' ? '#f0f9ff' : '#ffffff',
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                Shared Shard (Standard)
              </button>
              <button
                type="button"
                onClick={() => onChange({ isolationLevel: 'DEDICATED_SHARD' })}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: data.isolationLevel === 'DEDICATED_SHARD' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: data.isolationLevel === 'DEDICATED_SHARD' ? '#f0f9ff' : '#ffffff',
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                Dedicated Shard (Enterprise)
              </button>
            </div>
          </div>

          {/* HA Auto-failover Toggle Card */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: 10, backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} color="#10b981" />
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#0f172a' }}>High Availability & Failover</p>
                  <p style={{ margin: 0, fontSize: 9.5, color: '#64748b' }}>Multi-AZ database replication & outbox sync</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={data.autoFailover}
                onChange={(e) => onChange({ autoFailover: e.target.checked })}
                style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#10b981' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

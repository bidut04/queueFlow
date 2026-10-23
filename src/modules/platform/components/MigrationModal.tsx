import React, { useState } from 'react';
import { X, ArrowLeftRight } from 'lucide-react';
import { platformStore } from '../services/platformState';
import { useStartMigration } from '../hooks';
import type { Organization, ShardInfo } from '../types/platform';

interface MigrationModalProps {
  organizations: Organization[];
  shards: ShardInfo[];
  defaultOrgId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({
  organizations,
  shards,
  defaultOrgId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const startMigrationMutation = useStartMigration();
  const [orgId, setOrgId] = useState(defaultOrgId || organizations[0]?.id || '');
  const [destinationShard, setDestinationShard] = useState(shards[0]?.id || '');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const targetOrg = organizations.find((o) => o.id === orgId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !destinationShard) {
      alert('Please select organization and destination shard.');
      return;
    }

    if (targetOrg && targetOrg.currentShard === destinationShard) {
      alert('Destination shard must be different from current shard.');
      return;
    }

    try {
      await startMigrationMutation.mutateAsync({
        tenantId: orgId,
        targetShardId: destinationShard,
        notes
      });
    } catch {
      // Fallback
    }

    await platformStore.startMigration(orgId, destinationShard, notes);
    onSuccess();
    onClose();
  };



  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 540,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ArrowLeftRight size={20} color="#818cf8" />
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Start Tenant Shard Migration</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 12, backgroundColor: '#f5f3ff', borderRadius: 6, border: '1px solid #ddd6fe' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#5b21b6', lineHeight: 1.4 }}>
              <strong>QueueFlow Migration Pipeline:</strong> Copy → Verify → Cutover → Complete. Rollback capability is enabled throughout cutover verification.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Organization to Migrate *
            </label>
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} (Current Shard: {org.currentShard})
                </option>
              ))}
            </select>
          </div>

          {targetOrg && (
            <div style={{ padding: 10, backgroundColor: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 11, color: '#475569' }}>
              <div><strong>Source Shard:</strong> {targetOrg.currentShard} ({targetOrg.region})</div>
              <div><strong>Total Branches:</strong> {targetOrg.branchesCount} | <strong>Monthly Bookings:</strong> {targetOrg.monthlyBookingsCount.toLocaleString()}</div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Destination Database Shard *
            </label>
            <select
              value={destinationShard}
              onChange={(e) => setDestinationShard(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace' }}
            >
              {shards.map((s) => (
                <option key={s.id} value={s.id} disabled={targetOrg?.currentShard === s.id}>
                  {s.id} — {s.region} ({s.utilizationPercent}% capacity, {s.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Migration Reason / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Load rebalancing, regional latency optimization..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Initiate Shard Migration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

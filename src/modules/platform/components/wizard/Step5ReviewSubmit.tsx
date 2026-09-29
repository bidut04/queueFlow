import React from 'react';
import { Building2, CreditCard, Server, ShieldCheck } from 'lucide-react';
import type { Step1Data } from './Step1GeneralInfo';
import type { Step2Data } from './Step2SubscriptionPlan';
import type { Step3Data } from './Step3Infrastructure';
import type { Step4Data } from './Step4AdminAccount';

interface Step5ReviewSubmitProps {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

export const Step5ReviewSubmit: React.FC<Step5ReviewSubmitProps> = ({
  step1,
  step2,
  step3,
  step4
}) => {
  return (
    <div className="qf-card" style={{ padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Step 5: Review & Provision Organization
        </h3>
        <p style={{ fontSize: 10.5, color: '#64748b', margin: '2px 0 0 0' }}>
          Verify all configuration details before executing full platform provisioning.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {/* General Info Summary Card */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4f46e5', fontWeight: 800, fontSize: 11.5, marginBottom: 8 }}>
            <Building2 size={15} />
            <span>Organization Profile</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10.5, color: '#334155' }}>
            <div><strong>Name:</strong> {step1.name}</div>
            <div><strong>Legal Entity:</strong> {step1.legalName || 'N/A'}</div>
            <div><strong>Slug:</strong> <code>{step1.slug}</code></div>
            <div><strong>Type:</strong> {step1.type}</div>
            <div><strong>Contact Email:</strong> {step1.contactEmail}</div>
            <div><strong>Region / Country:</strong> {step1.country} ({step1.timezone})</div>
          </div>
        </div>

        {/* Subscription Plan Summary Card */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 800, fontSize: 11.5, marginBottom: 8 }}>
            <CreditCard size={15} />
            <span>Subscription Tier</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10.5, color: '#334155' }}>
            <div><strong>Selected Plan:</strong> {step2.planName}</div>
            <div><strong>Billing Cycle:</strong> {step2.billingCycle.toUpperCase()}</div>
            <div><strong>Status:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>ACTIVE</span></div>
          </div>
        </div>

        {/* Infrastructure & Shard Card */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 800, fontSize: 11.5, marginBottom: 8 }}>
            <Server size={15} />
            <span>Shard Ring Infrastructure</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10.5, color: '#334155' }}>
            <div><strong>Database Shard:</strong> <code>{step3.preferredShardId}</code></div>
            <div><strong>Isolation Mode:</strong> {step3.isolationLevel}</div>
            <div><strong>Auto Failover:</strong> {step3.autoFailover ? 'ENABLED' : 'DISABLED'}</div>
          </div>
        </div>

        {/* Tenant Admin Account Summary Card */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8b5cf6', fontWeight: 800, fontSize: 11.5, marginBottom: 8 }}>
            <ShieldCheck size={15} />
            <span>Primary Administrator</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10.5, color: '#334155' }}>
            <div><strong>Admin Name:</strong> {step4.primaryAdminName}</div>
            <div><strong>Admin Email:</strong> {step4.primaryAdminEmail}</div>
            <div><strong>Role:</strong> {step4.adminRole}</div>
            <div><strong>Enforce MFA:</strong> {step4.enforceMfa ? 'YES' : 'NO'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

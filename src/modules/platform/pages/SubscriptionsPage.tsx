import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { PlatformSubscriptionPlan } from '../types/platform';

export const SubscriptionsPage: React.FC = () => {
  const [plans] = useState<PlatformSubscriptionPlan[]>(platformStore.subscriptionPlans);
  const organizations = platformStore.organizations;

  const subscriptionStatusCounts = {
    ACTIVE: organizations.filter((o) => o.subscriptionState === 'ACTIVE').length,
    TRIAL: organizations.filter((o) => o.subscriptionState === 'TRIAL').length,
    PAST_DUE: organizations.filter((o) => o.subscriptionState === 'PAST_DUE').length,
    SUSPENDED: organizations.filter((o) => o.subscriptionState === 'SUSPENDED').length,
    CANCELLED: organizations.filter((o) => o.subscriptionState === 'CANCELLED').length
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Subscriptions & Tiered Plans
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, margin: 0 }}>
          Manage platform pricing tiers, tenant subscription limits, and billing states. (Stripe integration ready)
        </p>
      </div>

      {/* Subscription Lifecycle States Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'ACTIVE', count: subscriptionStatusCounts.ACTIVE, color: '#10b981', bg: '#ecfdf5' },
          { label: 'TRIAL', count: subscriptionStatusCounts.TRIAL, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'PAST_DUE', count: subscriptionStatusCounts.PAST_DUE, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'SUSPENDED', count: subscriptionStatusCounts.SUSPENDED, color: '#ef4444', bg: '#fef2f2' },
          { label: 'CANCELLED', count: subscriptionStatusCounts.CANCELLED, color: '#6b7280', bg: '#f3f4f6' }
        ].map((item) => (
          <div key={item.label} className="qf-card" style={{ padding: 14, textAlign: 'center', backgroundColor: item.bg }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: item.color }}>{item.label}</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{item.count} Orgs</h3>
          </div>
        ))}
      </div>

      {/* Plans Tier Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {plans.map((plan) => {
          const orgsOnPlan = organizations.filter((o) => o.plan === plan.name).length;
          return (
            <div
              key={plan.id}
              className="qf-card"
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: plan.name === 'Enterprise' ? '4px solid #4f46e5' : '4px solid #cbd5e1'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{plan.name}</h3>
                  <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: 4 }}>
                    {orgsOnPlan} Active Orgs
                  </span>
                </div>

                <div style={{ margin: '14px 0 16px 0' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>${plan.priceMonthly}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}> / month per organization</span>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: '#475569' }}>
                  <div><strong>Max Branches:</strong> {plan.maxBranches}</div>
                  <div><strong>Max Users:</strong> {plan.maxUsers}</div>
                  <div><strong>Monthly Bookings:</strong> {typeof plan.maxBookingsMonthly === 'number' ? plan.maxBookingsMonthly.toLocaleString() : plan.maxBookingsMonthly}</div>
                </div>

                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Included Features:</p>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155' }}>
                      <Check size={14} color="#10b981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => alert(`Stripe Integration Endpoint for ${plan.name} plan configuration.`)}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '8px 0',
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Edit Plan Tiers & Limits
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

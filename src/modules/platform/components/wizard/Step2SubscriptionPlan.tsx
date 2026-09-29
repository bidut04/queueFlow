import React from 'react';
import { Check } from 'lucide-react';
import { platformStore } from '../../services/platformState';

export interface Step2Data {
  planName: string;
  billingCycle: 'monthly' | 'annual';
}

interface Step2SubscriptionPlanProps {
  data: Step2Data;
  onChange: (fields: Partial<Step2Data>) => void;
}

export const Step2SubscriptionPlan: React.FC<Step2SubscriptionPlanProps> = ({
  data,
  onChange
}) => {
  const plans = platformStore.subscriptionPlans;

  return (
    <div className="qf-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Step 2: Select Subscription Plan Tiers & Billing Cycle
          </h3>
          <p style={{ fontSize: 10.5, color: '#64748b', margin: '2px 0 0 0' }}>
            Choose the operational plan tier and billing cycle for this organization.
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#f1f5f9', padding: 3, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => onChange({ billingCycle: 'monthly' })}
            style={{
              border: 'none',
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 10.5,
              fontWeight: 700,
              backgroundColor: data.billingCycle === 'monthly' ? '#ffffff' : 'transparent',
              color: data.billingCycle === 'monthly' ? '#4f46e5' : '#64748b',
              boxShadow: data.billingCycle === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer'
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => onChange({ billingCycle: 'annual' })}
            style={{
              border: 'none',
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 10.5,
              fontWeight: 700,
              backgroundColor: data.billingCycle === 'annual' ? '#ffffff' : 'transparent',
              color: data.billingCycle === 'annual' ? '#4f46e5' : '#64748b',
              boxShadow: data.billingCycle === 'annual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer'
            }}
          >
            Annual (20% Off)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {plans.map((plan) => {
          const isSelected = data.planName === plan.name;
          const monthlyPrice = data.billingCycle === 'annual' ? Math.round(plan.priceMonthly * 0.8) : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              onClick={() => onChange({ planName: plan.name })}
              style={{
                border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                borderRadius: 8,
                padding: 14,
                backgroundColor: isSelected ? '#f5f3ff' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              {plan.name === 'Professional' && (
                <span
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 12,
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 10,
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase'
                  }}
                >
                  Most Popular
                </span>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{plan.name}</h4>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: isSelected ? '5px solid #4f46e5' : '2px solid #cbd5e1',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                <div style={{ margin: '10px 0 12px 0' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>${monthlyPrice}</span>
                  <span style={{ fontSize: 10.5, color: '#64748b' }}> / mo</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10.5, color: '#475569', marginBottom: 12 }}>
                  <div><strong>Max Branches:</strong> {plan.maxBranches}</div>
                  <div><strong>Max Users:</strong> {plan.maxUsers}</div>
                  <div><strong>Monthly Bookings:</strong> {typeof plan.maxBookingsMonthly === 'number' ? plan.maxBookingsMonthly.toLocaleString() : plan.maxBookingsMonthly}</div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#334155' }}>
                      <Check size={12} color="#10b981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

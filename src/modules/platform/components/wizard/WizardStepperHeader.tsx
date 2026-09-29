import React from 'react';
import { Check } from 'lucide-react';

export interface WizardStep {
  number: number;
  title: string;
  description: string;
}

interface WizardStepperHeaderProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
}

export const WizardStepperHeader: React.FC<WizardStepperHeaderProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  return (
    <div className="qf-card" style={{ padding: '12px 16px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = isCompleted || isCurrent;

          return (
            <React.Fragment key={step.number}>
              {/* Step Pill Button */}
              <div
                onClick={() => isClickable && onStepClick(step.number)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                  opacity: isCurrent || isCompleted ? 1 : 0.5,
                  zIndex: 2
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#4f46e5' : '#e2e8f0',
                    color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                    fontSize: 12.5,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: isCurrent ? '0 0 0 3px rgba(79,70,229,0.2)' : 'none'
                  }}
                >
                  {isCompleted ? <Check size={16} color="#ffffff" /> : step.number}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: isCurrent ? 800 : 600,
                      color: isCurrent ? '#0f172a' : isCompleted ? '#047857' : '#475569'
                    }}
                  >
                    {step.title}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting line between steps */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: isCompleted ? '#10b981' : '#e2e8f0',
                    margin: '0 12px',
                    transition: 'background-color 0.2s ease'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

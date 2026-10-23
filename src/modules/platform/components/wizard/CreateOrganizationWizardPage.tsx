import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import type { PlatformPageId, OrgType, Organization } from '../../types/platform';
import { platformStore } from '../../services/platformState';
import { useCreateOrganization } from '../../hooks';
import { WizardStepperHeader, type WizardStep } from './WizardStepperHeader';
import { Step1GeneralInfo, type Step1Data } from './Step1GeneralInfo';
import { Step2SubscriptionPlan, type Step2Data } from './Step2SubscriptionPlan';
import { Step3Infrastructure, type Step3Data } from './Step3Infrastructure';
import { Step4AdminAccount, type Step4Data } from './Step4AdminAccount';
import { Step5ReviewSubmit } from './Step5ReviewSubmit';
import { toast } from '../../../../components/ui/Toast';

export interface CreateOrganizationWizardPageProps {
  onNavigate?: (tab: PlatformPageId, orgId?: string) => void;
  mode?: 'SUPER_ADMIN' | 'ORG_ADMIN';
  initialAdminData?: Partial<Step4Data>;
  onSuccess?: (newOrg: Organization) => void;
  onCancel?: () => void;
}

export const CreateOrganizationWizardPage: React.FC<CreateOrganizationWizardPageProps> = ({
  onNavigate,
  mode = 'SUPER_ADMIN',
  initialAdminData,
  onSuccess,
  onCancel
}) => {
  const createOrgMutation = useCreateOrganization();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdResult, setCreatedResult] = useState<{ org: Organization; inviteToken?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Step 1 State
  const [step1Data, setStep1Data] = useState<Step1Data>({
    name: '',
    legalName: '',
    slug: '',
    type: 'BANK',
    contactEmail: initialAdminData?.primaryAdminEmail || '',
    contactPhone: initialAdminData?.primaryAdminPhone || '',
    country: 'US',
    timezone: 'America/New_York'
  });

  // Step 2 State
  const [step2Data, setStep2Data] = useState<Step2Data>({
    planName: mode === 'ORG_ADMIN' ? 'Free' : 'Professional',
    billingCycle: 'monthly'
  });

  // Step 3 State
  const [step3Data, setStep3Data] = useState<Step3Data>({
    preferredShardId: platformStore.shards[0]?.id || 'shard_01',
    autoFailover: true,
    isolationLevel: 'SHARED_SHARD'
  });

  // Step 4 State
  const [step4Data, setStep4Data] = useState<Step4Data>({
    primaryAdminName: initialAdminData?.primaryAdminName || '',
    primaryAdminEmail: initialAdminData?.primaryAdminEmail || '',
    primaryAdminPhone: initialAdminData?.primaryAdminPhone || '',
    adminRole: 'TENANT_OWNER',
    enforceMfa: true
  });

  const steps: WizardStep[] = [
    { number: 1, title: 'General Info', description: 'Company Identity' },
    { number: 2, title: 'Plan & Billing', description: 'Tier Selection' },
    { number: 3, title: 'Infrastructure', description: 'Shard Topology' },
    { number: 4, title: 'Tenant Admin', description: 'Initial Credentials' },
    { number: 5, title: 'Review & Submit', description: mode === 'ORG_ADMIN' ? 'Submit Application' : 'Provision Org' }
  ];

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!step1Data.name.trim()) newErrors.name = 'Organization name is required';
      if (!step1Data.slug.trim()) newErrors.slug = 'URL slug is required';
      if (!step1Data.contactEmail.trim()) {
        newErrors.contactEmail = 'Contact email is required';
      } else if (!/\S+@\S+\.\S+/.test(step1Data.contactEmail)) {
        newErrors.contactEmail = 'Invalid email address format';
      }
    } else if (stepNum === 4) {
      if (!step4Data.primaryAdminName.trim()) newErrors.primaryAdminName = 'Admin full name is required';
      if (!step4Data.primaryAdminEmail.trim()) {
        newErrors.primaryAdminEmail = 'Admin email is required';
      } else if (!/\S+@\S+\.\S+/.test(step4Data.primaryAdminEmail)) {
        newErrors.primaryAdminEmail = 'Invalid email address format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(4)) {
      toast.warning('Please review and correct the required fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    let createdOrg: Organization;
    const orgPayload = {
      name: step1Data.name,
      legalName: step1Data.legalName,
      slug: step1Data.slug,
      type: step1Data.type as OrgType,
      contactEmail: step1Data.contactEmail,
      contactPhone: step1Data.contactPhone,
      country: step1Data.country,
      timezone: step1Data.timezone,
      primaryAdminName: step4Data.primaryAdminName,
      primaryAdminEmail: step4Data.primaryAdminEmail,
      primaryAdminPhone: step4Data.primaryAdminPhone,
      planName: step2Data.planName,
      preferredShardId: step3Data.preferredShardId
    };

    if (mode === 'ORG_ADMIN') {
      createdOrg = platformStore.submitOrganizationRegistration(orgPayload);
      toast.success('Registration submitted successfully for review!');
    } else {
      try {
        createdOrg = await createOrgMutation.mutateAsync(orgPayload);
        toast.success(`Organization "${createdOrg.name}" provisioned successfully!`);
      } catch (err: any) {
        toast.fromApiError(err, 'Failed to provision organization');
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);

    const inviteToken = platformStore.lastGeneratedInvite?.token;
    setCreatedResult({ org: createdOrg, inviteToken });
  };


  const handleFinishModal = () => {
    if (!createdResult) return;
    if (onSuccess) {
      onSuccess(createdResult.org);
    } else if (onNavigate) {
      onNavigate('organizations');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Top Header Row with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else if (onNavigate) {
                onNavigate('organizations');
              }
            }}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 5,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <ArrowLeft size={13} /> {mode === 'ORG_ADMIN' ? 'Back to Portal' : 'Back to Organizations'}
          </button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {mode === 'ORG_ADMIN' ? 'Register Your Organization' : 'Onboard New Tenant Organization'}
            </h1>
            <p style={{ fontSize: 10.5, color: '#64748b', margin: '1px 0 0 0' }}>
              {mode === 'ORG_ADMIN'
                ? 'Fill out your company identity, plan, and admin profile. Your submission will be reviewed by Super Admin.'
                : 'Multi-step enterprise wizard for provisioning company accounts, database shard topology, and primary admin credentials.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <WizardStepperHeader
        steps={steps}
        currentStep={currentStep}
        onStepClick={(stepNum) => {
          if (validateStep(currentStep)) {
            setCurrentStep(stepNum);
          }
        }}
      />

      {/* Dynamic Step Content Component */}
      <div>
        {currentStep === 1 && (
          <Step1GeneralInfo
            data={step1Data}
            onChange={(fields) => setStep1Data((prev) => ({ ...prev, ...fields }))}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2SubscriptionPlan
            data={step2Data}
            onChange={(fields) => setStep2Data((prev) => ({ ...prev, ...fields }))}
          />
        )}

        {currentStep === 3 && (
          <Step3Infrastructure
            data={step3Data}
            onChange={(fields) => setStep3Data((prev) => ({ ...prev, ...fields }))}
          />
        )}

        {currentStep === 4 && (
          <Step4AdminAccount
            data={step4Data}
            onChange={(fields) => setStep4Data((prev) => ({ ...prev, ...fields }))}
            errors={errors}
          />
        )}

        {currentStep === 5 && (
          <Step5ReviewSubmit
            step1={step1Data}
            step2={step2Data}
            step3={step3Data}
            step4={step4Data}
          />
        )}
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="qf-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else if (onNavigate) {
              onNavigate('organizations');
            }
          }}
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 5,
            padding: '6px 14px',
            fontSize: 11.5,
            fontWeight: 700,
            color: '#dc2626',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <XCircle size={14} /> Cancel
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 5,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <ChevronLeft size={13} /> Previous Step
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                borderRadius: 5,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Next Step <ChevronRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: 5,
                padding: '6px 16px',
                fontSize: 11,
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              <CheckCircle2 size={14} />
              {isSubmitting 
                ? (mode === 'ORG_ADMIN' ? 'Submitting Registration...' : 'Provisioning Organization...') 
                : (mode === 'ORG_ADMIN' ? 'Submit Registration for Review' : 'Provision Organization')}
            </button>
          )}
        </div>
      </div>

      {/* Password Setup Link / Onboarding Success Modal (Option 2) */}
      {createdResult && (
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
              maxWidth: 520,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              animation: 'scaleIn 0.2s ease-out'
            }}
          >
            {/* Header Banner */}
            <div
              style={{
                backgroundColor: '#10b981',
                padding: '24px 20px',
                textAlign: 'center',
                color: '#ffffff'
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto'
                }}
              >
                <CheckCircle2 size={28} color="#ffffff" />
              </div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                {mode === 'ORG_ADMIN' ? 'Registration Submitted!' : 'Organization Provisioned!'}
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 12, opacity: 0.9 }}>
                Welcome email & one-time password setup link generated
              </p>
            </div>

            {/* Content Body */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, fontSize: 11.5, color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Organization:</span>
                  <strong>{createdResult.org.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Primary Administrator:</span>
                  <strong>{createdResult.org.primaryAdminName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Administrator Email:</span>
                  <strong style={{ color: '#2563eb' }}>{createdResult.org.primaryAdminEmail}</strong>
                </div>
              </div>

              {/* Secure Link Box */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
                  One-Time Password Setup Link (Valid for 24 Hours)
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/setup-password?token=${createdResult.inviteToken || 'demo_token'}`}
                    style={{
                      flex: 1,
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '8px 10px',
                      fontSize: 11,
                      fontFamily: 'monospace',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const link = `${window.location.origin}/setup-password?token=${createdResult.inviteToken || 'demo_token'}`;
                      navigator.clipboard.writeText(link);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2500);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: copiedLink ? '#059669' : '#2563eb',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {copiedLink ? '✓ Copied' : 'Copy Link'}
                  </button>
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: 10, color: '#64748b' }}>
                  ℹ️ This zero-knowledge link was dispatched to <strong>{createdResult.org.primaryAdminEmail}</strong>. You can also copy it now to test setting the password.
                </p>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: 10, marginTop: 8, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                <a
                  href={`/setup-password?token=${createdResult.inviteToken || 'demo_token'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #c7d2fe',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: 11.5,
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  Open Setup Link ↗
                </a>

                <button
                  type="button"
                  onClick={handleFinishModal}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Done (View Organizations)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

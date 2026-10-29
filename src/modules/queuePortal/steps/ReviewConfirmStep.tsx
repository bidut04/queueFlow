import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Pencil,
  Stethoscope,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
} from 'lucide-react';
import type { TenantItem, QueueServiceItem, BranchItem } from '../types/queuePortal.types';

interface ReviewConfirmStepProps {
  selectedTenant?: TenantItem | null;
  selectedService?: QueueServiceItem | null;
  selectedBranch?: BranchItem | null;
  onEdit: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ReviewConfirmStep: React.FC<ReviewConfirmStepProps> = ({
  selectedTenant,
  selectedService,
  selectedBranch,
  onEdit,
  onContinue,
  onBack,
}) => {
  // Graceful fallback to Apollo Clinic mock data matching design mockup
  const organizationName = selectedTenant?.name || 'Apollo Health Clinic';
  const serviceName = selectedService?.name || 'Doctor Consultation Token';
  const branchName = selectedBranch?.name || 'Kharagpur Diagnostic Centre';
  const branchAddress =
    selectedBranch?.address && selectedBranch.address !== 'Main Branch Counter'
      ? selectedBranch.address
      : 'Kharagpur, West Bengal';
  const waitMinutes = selectedBranch?.waitMinutes ?? 8;
  const activeCounters = selectedBranch?.activeCounters ?? 3;
  const peopleAhead = 2;

  return (
    <div className="relative w-full max-w-4xl mx-auto py-1 sm:py-2 px-2 sm:px-4 min-w-0">
      {/* Decorative Organic Wave Shapes in Background (Compact & Subtle) */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 sm:w-60 sm:h-60 opacity-45 overflow-hidden select-none">
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <path
            d="M120 0C240 30 350 70 400 180V0H120Z"
            fill="url(#top-wave-grad)"
          />
          <defs>
            <linearGradient id="top-wave-grad" x1="150" y1="0" x2="400" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93c5fd" stopOpacity="0.25" />
              <stop offset="1" stopColor="#c4b5fd" stopOpacity="0.08" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 sm:w-60 sm:h-60 opacity-45 overflow-hidden select-none">
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <path
            d="M0 260C90 250 170 320 200 400H0V260Z"
            fill="url(#bottom-wave-grad)"
          />
          <defs>
            <linearGradient id="bottom-wave-grad" x1="0" y1="260" x2="200" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93c5fd" stopOpacity="0.2" />
              <stop offset="1" stopColor="#dbeafe" stopOpacity="0.08" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Back Navigation Link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 mb-2 sm:mb-2.5 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to branch details</span>
      </button>

      {/* Header Block: Calendar Icon + Title + Subtitle (Compact) */}
      <div className="flex items-center gap-3 sm:gap-3.5 mb-3 sm:mb-3.5">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#eef4ff] text-[#2563eb] border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
          <svg
            className="w-5 h-5 text-[#2563eb]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#0e1e38] tracking-tight leading-snug">
            Review your booking
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal">
            Make sure everything looks right before choosing a visit time.
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid Layout (Compact Padding & Gap) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-3.5 items-stretch mb-3.5">
        {/* Left Column: Organization & Service Review Card */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div className="space-y-3">
            {/* Row 1: Organization */}
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#eef4ff] text-[#2563eb] flex items-center justify-center shrink-0 shadow-2xs border border-blue-100/50">
                  {/* Medical Hospital / Clinic Building Icon */}
                  <svg
                    className="w-5 h-5 text-[#2563eb]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21h18" />
                    <path d="M5 21V7l7-4 7 4v14" />
                    <path d="M10 9h4" />
                    <path d="M12 7v4" />
                    <path d="M9 21v-5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block leading-none">
                    ORGANIZATION
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#0e1e38] truncate mt-0.5">
                    {organizationName}
                  </h2>
                </div>
              </div>

              {/* Edit Button */}
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-blue-200 text-blue-600 bg-white hover:bg-blue-50/70 text-[11px] font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            {/* Subtle Divider */}
            <hr className="border-slate-100 my-0" />

            {/* Row 2: Service */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#faf0ff] text-[#9333ea] flex items-center justify-center shrink-0 shadow-2xs border border-purple-100/50">
                <Stethoscope className="w-5 h-5 text-[#9333ea]" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block leading-none">
                  SERVICE
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-[#0e1e38] truncate mt-0.5">
                  {serviceName}
                </h3>
              </div>
            </div>

            {/* Subtle Divider */}
            <hr className="border-slate-100 my-0" />

            {/* Row 3: Branch / Centre */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#eef6ff] text-[#2563eb] flex items-center justify-center shrink-0 shadow-2xs border border-blue-100/50">
                <MapPin className="w-5 h-5 text-[#2563eb]" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block leading-none">
                  BRANCH / CENTRE
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-[#0e1e38] truncate mt-0.5">
                  {branchName}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                  {branchAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Mint-Tinted Metrics Container (Compact) */}
          <div className="bg-[#f0fbf7] border border-[#d2f3e3] rounded-xl p-2.5 sm:p-3 mt-3.5 flex items-center justify-between gap-2">
            {/* Metric 1: Estimated Wait Time */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#daf5e8] text-[#059669] flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 text-[#059669]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold tracking-wider uppercase text-slate-500 block leading-none mb-0.5">
                  ESTIMATED WAIT TIME
                </span>
                <span className="inline-block bg-[#d2f5e2] text-[#047857] text-[11px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full">
                  ~ {waitMinutes} min
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-slate-200/70 shrink-0" />

            {/* Metric 2: People Ahead */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#e8f1fe] text-[#2563eb] flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-[#2563eb]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold tracking-wider uppercase text-slate-500 block leading-none mb-0.5">
                  PEOPLE AHEAD
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#0e1e38]">
                  {peopleAhead}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-slate-200/70 shrink-0" />

            {/* Metric 3: Available Counters */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#e8f1fe] text-[#2563eb] flex items-center justify-center shrink-0">
                {/* Counter Booth Icon */}
                <svg
                  className="w-3.5 h-3.5 text-[#2563eb]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <circle cx="8" cy="10" r="1.5" />
                  <circle cx="16" cy="10" r="1.5" />
                  <path d="M2 20h20" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold tracking-wider uppercase text-slate-500 block leading-none mb-0.5">
                  AVAILABLE COUNTERS
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#0e1e38]">
                  {activeCounters}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Artwork & Confirmation Card (Compact) */}
        <div className="md:col-span-5 bg-gradient-to-b from-blue-50/40 via-white to-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Scaled-down 3D-Styled Artwork Matching Mockup 1 */}
          <div className="w-full max-w-[210px] sm:max-w-[230px] h-[130px] sm:h-[145px] relative flex items-center justify-center select-none">
            {/* Ambient Radial Halo */}
            <div className="absolute inset-0 bg-radial from-blue-200/40 via-sky-100/20 to-transparent blur-lg -z-10" />

            <svg viewBox="0 0 360 260" fill="none" className="w-full h-full overflow-visible">
              <defs>
                {/* Gradients */}
                <linearGradient id="stopwatch-outer" x1="180" y1="36" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e6fff" />
                  <stop offset="1" stopColor="#0d50db" />
                </linearGradient>
                <linearGradient id="stopwatch-inner" x1="180" y1="52" x2="180" y2="168" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f8fbff" />
                  <stop offset="1" stopColor="#dce9ff" />
                </linearGradient>
                <linearGradient id="ticket-grad" x1="220" y1="130" x2="290" y2="170" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1d63ff" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="avatar-glass" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#bfdbfe" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#93c5fd" stopOpacity="0.65" />
                </linearGradient>
                <linearGradient id="cloud-podium" x1="60" y1="180" x2="300" y2="230" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f0f6ff" />
                  <stop offset="1" stopColor="#dbeafe" />
                </linearGradient>
                <filter id="card-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#1e40af" floodOpacity="0.12" />
                </filter>
                <filter id="ticket-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#1e3a8a" floodOpacity="0.22" />
                </filter>
              </defs>

              {/* Soft Floating Cloud / Podium Base */}
              <g filter="url(#card-soft-shadow)">
                <ellipse cx="180" cy="205" rx="140" ry="24" fill="url(#cloud-podium)" opacity="0.85" />
                <ellipse cx="120" cy="195" rx="55" ry="18" fill="#ffffff" opacity="0.65" />
                <ellipse cx="235" cy="198" rx="65" ry="20" fill="#ffffff" opacity="0.55" />
              </g>

              {/* Sparkle Action Rays around Stopwatch */}
              <path d="M260 52L272 44" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
              <path d="M280 68L294 66" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
              <path d="M266 84L278 88" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />

              {/* Big Stopwatch Timer */}
              <g filter="url(#card-soft-shadow)">
                {/* Top Stem & Button */}
                <rect x="172" y="24" width="16" height="18" rx="3" fill="#1e6fff" />
                <rect x="166" y="18" width="28" height="9" rx="4.5" fill="#1e6fff" />
                {/* Angled Side Knob */}
                <rect x="220" y="38" width="10" height="14" rx="2" transform="rotate(35 220 38)" fill="#1e6fff" />

                {/* Main Stopwatch Outer Ring */}
                <circle cx="180" cy="110" r="62" fill="url(#stopwatch-outer)" />
                {/* Inner Dial Face */}
                <circle cx="180" cy="110" r="50" fill="url(#stopwatch-inner)" />

                {/* Dial Tick Marks */}
                <line x1="180" y1="64" x2="180" y2="70" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="180" y1="150" x2="180" y2="156" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                <line x1="134" y1="110" x2="140" y2="110" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                <line x1="220" y1="110" x2="226" y2="110" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />

                {/* Center Pivot & Clock Hand */}
                <line x1="180" y1="110" x2="154" y2="84" stroke="#1d4ed8" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="180" cy="110" r="5.5" fill="#1e40af" />
                <circle cx="180" cy="110" r="2.5" fill="#ffffff" />
              </g>

              {/* Crowd / People Silhouettes (3 translucent blue avatars) */}
              {/* Left Avatar */}
              <g opacity="0.92">
                <circle cx="128" cy="138" r="14" fill="url(#avatar-glass)" />
                <path d="M108 178C108 160 116 154 128 154C140 154 148 160 148 178" fill="url(#avatar-glass)" />
              </g>

              {/* Center Main Avatar */}
              <g opacity="0.96" filter="url(#card-soft-shadow)">
                <circle cx="160" cy="144" r="16" fill="url(#avatar-glass)" />
                <path d="M136 186C136 166 146 160 160 160C174 160 184 166 184 186" fill="url(#avatar-glass)" />
              </g>

              {/* Right Avatar */}
              <g opacity="0.92">
                <circle cx="192" cy="140" r="14" fill="url(#avatar-glass)" />
                <path d="M174 180C174 162 182 156 192 156C202 156 210 162 210 180" fill="url(#avatar-glass)" />
              </g>

              {/* Pop-Out Queue Token / Ticket Badge (#2) */}
              <g filter="url(#ticket-shadow)">
                <path
                  d="M216 132H280C282.209 132 284 133.791 284 136V144C280.686 144 278 146.686 278 150C278 153.314 280.686 156 284 156V164C284 166.209 282.209 168 280 168H216C213.791 168 212 166.209 212 164V156C215.314 156 218 153.314 218 150C218 146.686 215.314 144 212 144V136C212 133.791 213.791 132 216 132Z"
                  fill="url(#ticket-grad)"
                />
                <line x1="230" y1="135" x2="230" y2="165" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
                <text x="256" y="156" fill="#ffffff" fontSize="18" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
                  #2
                </text>
              </g>
            </svg>
          </div>

          {/* Title & Description (Compact) */}
          <h2 className="text-base sm:text-lg font-extrabold text-[#0e1e38] mt-2 mb-1 tracking-tight">
            You’re almost there!
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 max-w-[240px] leading-snug mb-3 font-normal">
            Your booking is ready. Just hit continue and choose your preferred visit time slot.
          </p>

          {/* Trust / Security Badge (Compact) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4ff] text-[#2563eb] border border-[#d6e5ff] text-[11px] font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>No signup or credit card required</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Actions Bar (Compact) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all hover:border-slate-300 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#1d63ff] via-[#3368fa] to-[#7c3aed] hover:from-[#1752df] hover:to-[#6d28d9] text-white font-bold text-xs sm:text-sm shadow-[0_6px_18px_-3px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Calendar,
  ArrowRight,
  Play,
  Clock,
  Smartphone,
  ShieldCheck,
  X,
  CheckCircle2,
  Tv,
  Globe,
} from 'lucide-react';
import type { TenantItem } from '../types/queuePortal.types';

export interface QueueHeroBannerProps {
  tenants?: TenantItem[];
  selectedTenantId?: string;
  onSelectTenant?: (tenantId: string) => void;
  onBookQueueClick?: () => void;
  onSelectCategory?: (category: string) => void;
  onViewLiveQueueClick?: () => void;
}

export const QueueHeroBanner: React.FC<QueueHeroBannerProps> = ({
  onBookQueueClick,
  onSelectCategory,
  onViewLiveQueueClick,
}) => {
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showMultiChannelModal, setShowMultiChannelModal] = useState(false);

  const handleBookClick = () => {
    if (onBookQueueClick) {
      onBookQueueClick();
      return;
    }
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewLiveQueue = () => {
    if (onViewLiveQueueClick) {
      onViewLiveQueueClick();
      return;
    }
    const liveSection = document.getElementById('live-queue-section');
    if (liveSection) {
      liveSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterEveryService = () => {
    if (onSelectCategory) {
      onSelectCategory('all');
    }
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#eef5fc] via-[#f4f8fe] to-[#e8f1fc] border border-blue-100/90 mb-3 shadow-xs w-full max-w-full min-w-0">
        {/* Ambient background blur highlight */}
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="flex flex-col lg:flex-row items-center justify-between w-full min-w-0 relative z-10">
          {/* Left Column: Heading, Subtitle, Interactive Buttons & Features */}
          <div className="w-full min-w-0 lg:w-[55%] xl:w-[56%] flex flex-col justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            {/* 1. Green Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2.5 w-fit shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Smarter Queues, Happier People.</span>
            </div>

            {/* 2. Bold Two-Tone Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-black text-[#0d1d3a] tracking-tight leading-[1.14] mb-2.5 break-words">
              Skip the line.<br />
              <span className="text-blue-600">Plan your visit.</span>
            </h1>

            {/* 3. Subtitle */}
            <p className="text-slate-600 text-xs sm:text-sm lg:text-[14.5px] leading-relaxed max-w-lg mb-3.5 break-words">
              Book a slot or track your queue turn before arriving at the counter. Save time, avoid waiting, and get things done – faster.
            </p>

            {/* 4. Action Buttons & Org Dropdown */}
            <div className="flex items-center gap-2.5 flex-wrap mb-4">
              <button
                type="button"
                onClick={handleBookClick}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowHowItWorksModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs hover:border-slate-300"
              >
                <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>Watch How It Works</span>
              </button>
            </div>

            {/* 5. Workable Feature Highlights (No divider line) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 w-full max-w-xl">
              {/* Feature 1: Real-time Wait Time */}
              <button
                type="button"
                onClick={handleViewLiveQueue}
                className="flex items-start gap-2 p-1.5 rounded-xl hover:bg-blue-100/40 text-left transition-all cursor-pointer group"
                title="Click to jump to Live Queue status"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                    Real-time Wait
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight truncate">Live Tracker →</div>
                </div>
              </button>

              {/* Feature 2: Multiple Channels */}
              <button
                type="button"
                onClick={() => setShowMultiChannelModal(true)}
                className="flex items-start gap-2 p-1.5 rounded-xl hover:bg-emerald-100/40 text-left transition-all cursor-pointer group"
                title="Click to learn about multi-channel booking"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight truncate">
                    Multi Channel
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight truncate">Web, Mobile, Kiosk ℹ️</div>
                </div>
              </button>

              {/* Feature 3: For Every Service */}
              <button
                type="button"
                onClick={handleFilterEveryService}
                className="flex items-start gap-2 p-1.5 rounded-xl hover:bg-purple-100/40 text-left transition-all cursor-pointer group"
                title="Click to view all service categories"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-tight truncate">
                    Every Service
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight truncate">Banks, Hospital, Gov →</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Seamless Full-Width 3D Illustration (No line, no shadow seam) */}
          <div className="w-full lg:w-[45%] xl:w-[44%] relative flex items-center justify-center lg:justify-end self-stretch px-3 pb-3 sm:px-6 sm:pb-5 lg:p-0">
            <div className="relative w-full max-w-[560px] flex items-center justify-center lg:justify-end">
              <img
                src="/images/queue_hero_scene_clean.png"
                alt="QueueFlow Digital Smart Counter & Mobile Token K023"
                className="w-full h-auto max-h-[420px] object-contain select-none"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 8%, black 18%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 8%, black 18%, black 100%)',
                }}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal 1: How It Works */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHowItWorksModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                Q
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">How QueueFlow Works</h3>
                <p className="text-xs text-slate-500">Fast 3-step digital queue booking</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Choose Service & Location</h4>
                  <p className="text-[11px] text-slate-600">
                    Find nearby bank branches, hospitals, or government offices with real-time GPS distance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Instant Digital Token</h4>
                  <p className="text-[11px] text-slate-600">
                    Receive your digital ticket (e.g. K023) directly on your device with SMS & QR code confirmation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Track & Walk Right In</h4>
                  <p className="text-[11px] text-slate-600">
                    Watch the live queue advance in real time. Arrive just when your number is called – zero waiting room stress.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowHowItWorksModal(false);
                  handleBookClick();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Got It, Book Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Multi-Channel Information */}
      {showMultiChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMultiChannelModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Multi-Channel Queue Integration</h3>
                <p className="text-xs text-slate-500">Access your token from any device or touchpoint</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Web Portal</h4>
                  <p className="text-[11px] text-slate-600">
                    Book online ahead of time from your laptop or desktop browser. No app install required.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Mobile & SMS Tracking</h4>
                  <p className="text-[11px] text-slate-600">
                    Get real-time SMS alerts and live ticket countdowns right on your smartphone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">On-Site Touch Kiosk</h4>
                  <p className="text-[11px] text-slate-600">
                    Walk-in visitors can print paper QR tickets at the counter kiosk that synchronize with the same digital queue.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowMultiChannelModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useRef } from 'react';
import { QueuePortalNavbar } from '../modules/queuePortal/components/QueuePortalNavbar';
import { QueueHeroBanner } from '../modules/queuePortal/components/QueueHeroBanner';
import { QueueCategoryFilter } from '../modules/queuePortal/components/QueueCategoryFilter';
import { PopularServiceCard } from '../modules/queuePortal/components/PopularServiceCard';
import { LiveQueuePreviewCard } from '../modules/queuePortal/components/LiveQueuePreviewCard';
import { HowItWorksCard } from '../modules/queuePortal/components/HowItWorksCard';
import { UpcomingAppointmentCard } from '../modules/queuePortal/components/UpcomingAppointmentCard';
import { MyBookingsModal } from '../modules/queuePortal/components/MyBookingsModal';
import {
  MobileQueueBottomNav,
  type MobileBottomNavTab,
} from '../modules/queuePortal/components/MobileQueueBottomNav';
import {
  MOCK_LOCATIONS,
  CATEGORY_TABS,
} from '../modules/queuePortal/data/queuePortalMockData';
import type { QueueServiceItem } from '../modules/queuePortal/types/queuePortal.types';
import { useQueuePortal } from '../modules/queuePortal/hooks/useQueuePortal';
import { useQueueBookingFlow } from '../modules/queuePortal/hooks/useQueueBookingFlow';

// 8 Dedicated Sub-Steps (Steps 2 through 9)
import { OrganizationSelectStep } from '../modules/queuePortal/steps/OrganizationSelectStep';
import { ServiceSelectStep } from '../modules/queuePortal/steps/ServiceSelectStep';
import { BranchSelectStep } from '../modules/queuePortal/steps/BranchSelectStep';
import { BranchDetailsStep } from '../modules/queuePortal/steps/BranchDetailsStep';
import { ReviewConfirmStep } from '../modules/queuePortal/steps/ReviewConfirmStep';
import { ChooseTimeSlotStep } from '../modules/queuePortal/steps/ChooseTimeSlotStep';
import { BookingConfirmationStep } from '../modules/queuePortal/steps/BookingConfirmationStep';
import { TrackQueueStep } from '../modules/queuePortal/steps/TrackQueueStep';

export interface QueueBookingPortalPageProps {
  onNavigate?: (pageId: string) => void;
}

export const QueueBookingPortalPage: React.FC<QueueBookingPortalPageProps> = () => {
  // 1. Queue Portal APIs & Live Search / Location
  const {
    userLocation,
    currentLocationText,
    setCurrentLocationText,
    isLocating,
    detectLocation,
    tenants,
    isLoadingTenants,
    selectedTenantId,
    setSelectedTenantId,
    selectedCategory,
    setSelectedCategory,
    branchSearchQuery,
    setBranchSearchQuery,
    filteredServices,
    isLoadingServices,
    liveQueueData,
    upcomingAppointment,
    handleViewQueue,
  } = useQueuePortal();

  // 2. 9-Step Guided Booking Journey State Machine
  const {
    currentStep,
    selectedTenant,
    selectedService,
    selectedBranch,
    bookedToken,
    tenantServices,
    tenantBranches,
    isLoadingServices: isBookingLoadingServices,
    isLoadingBranches: isBookingLoadingBranches,
    startBooking,
    handleSelectTenant,
    handleSelectService,
    handleSelectBranch,
    handleProceedToReview,
    handleProceedToChooseTime,
    handleConfirmAndGetToken,
    handleGoToTrackQueue,
    handleGoBack,
    resetToHome,
  } = useQueueBookingFlow(userLocation || undefined);

  // Authenticated user profile from login session
  const currentUserProfile = React.useMemo(() => {
    try {
      const userStr = localStorage.getItem('queflow_user') || localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        return {
          name: u.fullName || u.name || u.email?.split('@')[0] || 'User',
          avatarUrl: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
          activeBookingsCount: upcomingAppointment ? 1 : 0,
        };
      }
    } catch {
      // fallback
    }
    return {
      name: 'Dipam',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      activeBookingsCount: upcomingAppointment ? 1 : 0,
    };
  }, [upcomingAppointment]);

  const [mobileTab, setMobileTab] = useState<'services' | 'queue'>('services');
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState(false);
  const liveQueueRef = useRef<HTMLDivElement>(null);

  // Active tab determination for floating mobile pill bottom navigation (matching sidebar items)
  const activeBottomTab: MobileBottomNavTab =
    isMyBookingsModalOpen || currentStep === 'track-queue' || currentStep === 'confirmation'
      ? 'bookings'
      : currentStep === 'select-branch' || currentStep === 'branch-details'
      ? 'branches'
      : currentStep === 'select-org' ||
        currentStep === 'select-service' ||
        currentStep === 'review-confirm' ||
        currentStep === 'choose-time'
      ? 'services'
      : 'home';

  const handleBottomNavChange = (tab: MobileBottomNavTab) => {
    if (tab === 'bookings') {
      if (bookedToken) {
        setIsMyBookingsModalOpen(false);
        handleGoToTrackQueue();
      } else {
        setIsMyBookingsModalOpen(true);
      }
    } else if (tab === 'home') {
      setIsMyBookingsModalOpen(false);
      if (currentStep !== 'home') {
        resetToHome();
      }
      setMobileTab('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'services') {
      setIsMyBookingsModalOpen(false);
      startBooking();
    } else if (tab === 'branches') {
      setIsMyBookingsModalOpen(false);
      const tenantToUse = selectedTenant || (tenants && tenants.length > 0 ? tenants[0] : undefined);
      if (tenantToUse) {
        handleSelectTenant(tenantToUse);
      } else {
        startBooking();
      }
    }
  };

  const onSelectViewQueue = (service: QueueServiceItem) => {
    handleViewQueue(service);
    setMobileTab('queue');
    if (window.innerWidth < 1024 && liveQueueRef.current) {
      liveQueueRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleBookFromCard = (service: QueueServiceItem) => {
    handleSelectService(service);
  };

  return (
    <div className="queue-portal-theme min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8fafc] text-slate-800 pb-28 md:pb-8 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Universal Top Navbar Header */}
      <QueuePortalNavbar
        currentLocation={currentLocationText}
        isLocating={isLocating}
        locations={MOCK_LOCATIONS}
        onSelectLocation={setCurrentLocationText}
        onDetectLocation={detectLocation}
        userProfile={currentUserProfile}
        currentStep={currentStep}
        onNavigateStep={(step) => {
          if (step === 'home') resetToHome();
          else if (step === 'select-org') startBooking();
          else if (step === 'select-branch') handleGoBack();
        }}
        onOpenBookings={() => {
          if (bookedToken) {
            handleGoToTrackQueue();
          } else {
            setIsMyBookingsModalOpen(true);
          }
        }}
      />

      <main className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-4 min-w-0 overflow-x-hidden">
        {/* Render Step 1: Home Landing Page */}
        {currentStep === 'home' && (
          <>
            <QueueHeroBanner
              tenants={tenants}
              selectedTenantId={selectedTenantId}
              onSelectTenant={setSelectedTenantId}
              onBookQueueClick={() => startBooking()}
              onSelectCategory={(cat) => setSelectedCategory(cat as any)}
              onViewLiveQueueClick={() => {
                setMobileTab('queue');
                const el = document.getElementById('live-queue-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <QueueCategoryFilter
              categories={CATEGORY_TABS}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              branchSearchQuery={branchSearchQuery}
              onBranchSearchChange={setBranchSearchQuery}
            />

            {/* Mobile Soft Pill Switcher matching Image 1 */}
            <div className="flex lg:hidden items-center justify-center p-1 bg-[#eceef2] rounded-full border border-slate-200/80 shadow-inner mb-3 text-xs w-full max-w-full">
              <button
                type="button"
                onClick={() => setMobileTab('services')}
                className={`flex-1 py-1.5 px-3 rounded-full text-center transition-all cursor-pointer ${
                  mobileTab === 'services'
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                Nearby Services ({filteredServices.length})
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('queue')}
                className={`flex-1 py-1.5 px-3 rounded-full text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mobileTab === 'queue'
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span>Live Queue Status</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </div>

            {/* 2-Column Responsive Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start w-full min-w-0">
              <section
                id="services-section"
                className={`w-full min-w-0 lg:col-span-7 xl:col-span-7 ${
                  mobileTab === 'services' ? 'block' : 'hidden lg:block'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                    Popular Nearby Services
                  </h2>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isLoadingServices ? 'Searching services...' : `${filteredServices.length} available`}
                  </span>
                </div>

                <div className="space-y-1">
                  {filteredServices.map((service) => (
                    <PopularServiceCard
                      key={service.id}
                      service={service}
                      isSelected={liveQueueData.id === service.id}
                      onViewQueue={onSelectViewQueue}
                      onBookSlot={handleBookFromCard}
                    />
                  ))}
                </div>

                <div className="mt-2.5">
                  <HowItWorksCard />
                </div>
              </section>

              <aside
                id="live-queue-section"
                ref={liveQueueRef}
                className={`w-full min-w-0 lg:col-span-5 xl:col-span-5 space-y-2.5 ${
                  mobileTab === 'queue' ? 'block' : 'hidden lg:block'
                }`}
              >
                <LiveQueuePreviewCard queueData={liveQueueData} />
                <UpcomingAppointmentCard
                  appointment={upcomingAppointment}
                  onClick={handleGoToTrackQueue}
                />
              </aside>
            </div>
          </>
        )}

        {/* Render Steps 2 through 9 */}
        {currentStep === 'select-org' && (
          <OrganizationSelectStep
            tenants={tenants}
            isLoading={isLoadingTenants}
            currentLocationText={currentLocationText}
            onSelectTenant={handleSelectTenant}
            onBack={handleGoBack}
          />
        )}

        {currentStep === 'select-service' && selectedTenant && (
          <ServiceSelectStep
            selectedTenant={selectedTenant}
            services={tenantServices}
            isLoading={isBookingLoadingServices}
            onSelectService={handleSelectService}
            onBack={handleGoBack}
          />
        )}

        {currentStep === 'select-branch' && selectedTenant && selectedService && (
          <BranchSelectStep
            selectedTenant={selectedTenant}
            selectedService={selectedService}
            branches={tenantBranches}
            isLoading={isBookingLoadingBranches}
            onSelectBranch={handleSelectBranch}
            onBack={handleGoBack}
          />
        )}

        {currentStep === 'branch-details' && selectedTenant && selectedBranch && selectedService && (
          <BranchDetailsStep
            selectedTenant={selectedTenant}
            selectedBranch={selectedBranch}
            selectedService={selectedService}
            services={tenantServices}
            onSelectService={handleSelectService}
            onContinue={handleProceedToReview}
            onBack={handleGoBack}
          />
        )}

        {currentStep === 'review-confirm' && selectedTenant && selectedBranch && selectedService && (
          <ReviewConfirmStep
            selectedTenant={selectedTenant}
            selectedService={selectedService}
            selectedBranch={selectedBranch}
            onEdit={() => startBooking(selectedTenant)}
            onContinue={handleProceedToChooseTime}
            onBack={handleGoBack}
          />
        )}

        {currentStep === 'choose-time' && selectedTenant && selectedBranch && selectedService && (
          <ChooseTimeSlotStep
            selectedTenant={selectedTenant}
            selectedService={selectedService}
            selectedBranch={selectedBranch}
            onGetToken={handleConfirmAndGetToken}
            onBack={handleGoBack}
          />
        )}

        {currentStep === 'confirmation' && bookedToken && (
          <BookingConfirmationStep
            bookedToken={bookedToken}
            onTrackQueue={handleGoToTrackQueue}
            onViewDetails={() => resetToHome()}
          />
        )}

        {currentStep === 'track-queue' && bookedToken && (
          <TrackQueueStep
            bookedToken={bookedToken}
            onBookAnother={() => startBooking()}
            onBack={resetToHome}
          />
        )}
      </main>

      {/* Modal for Bookings summary */}
      {isMyBookingsModalOpen && (
        <MyBookingsModal
          isOpen={isMyBookingsModalOpen}
          onClose={() => setIsMyBookingsModalOpen(false)}
          activeQueue={liveQueueData}
          upcomingAppointment={upcomingAppointment}
        />
      )}

      {/* Floating Mobile Bottom Navigation Pill matching Image 2 */}
      <MobileQueueBottomNav
        activeTab={activeBottomTab}
        onChangeTab={handleBottomNavChange}
        hasActiveAppointment={Boolean(upcomingAppointment)}
        hasActiveLiveToken={Boolean(bookedToken || liveQueueData?.userTicket)}
      />
    </div>
  );
};

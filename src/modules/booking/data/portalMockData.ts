import type {
  OrganizationProfile,
  BranchProfile,
  ServiceOffering,
  StaffResource,
  PortalAppointment,
  BookingKPIStats
} from '../types/portalBooking';

export const MOCK_ORGANIZATIONS: OrganizationProfile[] = [
  {
    id: 'org-apex',
    name: 'Apex Care & Wellness Hub',
    legalName: 'Apex Health & Personal Care Services Ltd.',
    slug: 'apex-care',
    type: 'CLINIC',
    rating: 4.9,
    description: 'Premier health, therapy, diagnostics, and personal care services with zero-wait digital queuing.',
    activeBranchesCount: 3,
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'org-pacific',
    name: 'Pacific Federal & Trust',
    legalName: 'Pacific Federal Banking Corporation',
    slug: 'pacific-bank',
    type: 'BANK',
    rating: 4.8,
    description: 'Full-service corporate and retail banking, priority wealth management, and smart loans.',
    activeBranchesCount: 4,
    logoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'org-metro',
    name: 'Metropolitan Civic Services',
    legalName: 'City Council Municipal Citizen Services',
    slug: 'metro-civic',
    type: 'GOVERNMENT',
    rating: 4.7,
    description: 'Fast-track citizen document processing, licensing, property registry, and municipal desks.',
    activeBranchesCount: 2,
    logoUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'org-starlight',
    name: 'Starlight Medical Hospital',
    legalName: 'Starlight Healthcare Network Inc.',
    slug: 'starlight-health',
    type: 'HOSPITAL',
    rating: 4.9,
    description: 'Multi-specialty tertiary care hospital, imaging diagnostics, and ambulatory daycare.',
    activeBranchesCount: 2,
    logoUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=100&auto=format&fit=crop&q=80'
  }
];

export const MOCK_BRANCHES: BranchProfile[] = [
  // Apex Care branches
  {
    id: 'br-apex-downtown',
    orgId: 'org-apex',
    name: 'Downtown Central Flagship',
    code: 'DT-01',
    address: '452 Grand Avenue, Suite 100, Downtown',
    city: 'New York',
    phone: '+1 (555) 234-8901',
    openHours: '8:30 AM – 7:00 PM',
    isOpenNow: true,
    activeQueueCount: 5,
    avgWaitMinutes: 8
  },
  {
    id: 'br-apex-west',
    orgId: 'org-apex',
    name: 'West End Pavilion',
    code: 'WE-02',
    address: '890 Sunset Blvd, West Plaza',
    city: 'Los Angeles',
    phone: '+1 (555) 891-2309',
    openHours: '9:00 AM – 6:30 PM',
    isOpenNow: true,
    activeQueueCount: 2,
    avgWaitMinutes: 4
  },
  {
    id: 'br-apex-north',
    orgId: 'org-apex',
    name: 'Northgate Medical Square',
    code: 'NG-03',
    address: '12 Northgate Park Road',
    city: 'Chicago',
    phone: '+1 (555) 345-6712',
    openHours: '9:00 AM – 5:00 PM',
    isOpenNow: false,
    activeQueueCount: 0,
    avgWaitMinutes: 0
  },

  // Pacific Federal branches
  {
    id: 'br-pac-fin',
    orgId: 'org-pacific',
    name: 'Financial District Tower',
    code: 'FD-01',
    address: '100 Wall Street, Floor 1',
    city: 'New York',
    phone: '+1 (555) 990-1122',
    openHours: '9:00 AM – 5:00 PM',
    isOpenNow: true,
    activeQueueCount: 6,
    avgWaitMinutes: 11
  },
  {
    id: 'br-pac-uptown',
    orgId: 'org-pacific',
    name: 'Uptown Tech Plaza',
    code: 'UT-02',
    address: '224 Madison Ave',
    city: 'New York',
    phone: '+1 (555) 778-9900',
    openHours: '9:30 AM – 4:30 PM',
    isOpenNow: true,
    activeQueueCount: 3,
    avgWaitMinutes: 6
  },

  // Metro Civic branches
  {
    id: 'br-civic-cityhall',
    orgId: 'org-metro',
    name: 'City Hall One-Stop Center',
    code: 'CH-01',
    address: '1 Civic Center Plaza',
    city: 'San Francisco',
    phone: '+1 (555) 311-0000',
    openHours: '8:00 AM – 4:00 PM',
    isOpenNow: true,
    activeQueueCount: 14,
    avgWaitMinutes: 18
  }
];

export const MOCK_SERVICES: ServiceOffering[] = [
  // Apex Care services (matching screenshots & medical/wellness)
  {
    id: 'srv-mens-cut',
    orgId: 'org-apex',
    name: "Men's Cut & Style",
    category: 'Grooming & Care',
    durationMinutes: 45,
    priceFormatted: '$45.00',
    isFree: false,
    description: 'Precision haircut, hot towel consultation, styling, and scalp refresh.'
  },
  {
    id: 'srv-therapy',
    orgId: 'org-apex',
    name: 'Dandruff Control Therapy',
    category: 'Therapy & Wellness',
    durationMinutes: 45,
    priceFormatted: '$75.00',
    isFree: false,
    description: 'Clinical scalp detox, deep follicle conditioning, and therapeutic serum massage.'
  },
  {
    id: 'srv-z-haircut',
    orgId: 'org-apex',
    name: 'Z Haircut & Signature Beard',
    category: 'Grooming & Care',
    durationMinutes: 60,
    priceFormatted: '$65.00',
    isFree: false,
    description: 'Complete custom haircut styling with artisan razor beard sculpting and finishing oil.'
  },
  {
    id: 'srv-scalp-detox',
    orgId: 'org-apex',
    name: 'Scalp Detox Treatment',
    category: 'Therapy & Wellness',
    durationMinutes: 60,
    priceFormatted: '$90.00',
    isFree: false,
    description: 'Specialist micro-mist treatment, exfoliating clay mask, and infrared light therapy.'
  },
  {
    id: 'srv-physio',
    orgId: 'org-apex',
    name: 'Physiotherapy Assessment',
    category: 'Clinical Health',
    durationMinutes: 45,
    priceFormatted: '$110.00',
    isFree: false,
    description: 'Comprehensive musculoskeletal evaluation, mobility testing, and exercise plan.'
  },
  {
    id: 'srv-general-consult',
    orgId: 'org-apex',
    name: 'General Health Consultation',
    category: 'Clinical Health',
    durationMinutes: 30,
    priceFormatted: '$60.00',
    isFree: false,
    description: 'Primary physician consultation, vital checks, prescription review, and health advice.'
  },

  // Pacific Federal Services
  {
    id: 'srv-wealth',
    orgId: 'org-pacific',
    name: 'Priority Wealth Advisory',
    category: 'Wealth Management',
    durationMinutes: 45,
    priceFormatted: 'Complimentary',
    isFree: true,
    description: 'Private banking session for portfolio rebalancing, bond yields, and tax strategy.'
  },
  {
    id: 'srv-kyc',
    orgId: 'org-pacific',
    name: 'KYC & Account Onboarding',
    category: 'Retail Banking',
    durationMinutes: 25,
    priceFormatted: 'Free',
    isFree: true,
    description: 'Biometric identification, document verification, and instant debit card issuance.'
  },
  {
    id: 'srv-loan',
    orgId: 'org-pacific',
    name: 'Mortgage & Home Loan Consult',
    category: 'Credit & Loans',
    durationMinutes: 45,
    priceFormatted: 'Free',
    isFree: true,
    description: 'In-depth pre-approval underwriting check and fixed vs floating rate comparison.'
  }
];

export const MOCK_STAFF: StaffResource[] = [
  {
    id: 'stf-marcus',
    orgId: 'org-apex',
    branchId: 'br-apex-downtown',
    name: 'Marcus Reid',
    roleTitle: 'ATC Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
    colorTag: '#10b981',
    servicesHandled: ['srv-mens-cut', 'srv-z-haircut', 'srv-physio']
  },
  {
    id: 'stf-john',
    orgId: 'org-apex',
    branchId: 'br-apex-downtown',
    name: 'John Dean',
    roleTitle: 'Barber & Stylist',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
    colorTag: '#0ea5e9',
    servicesHandled: ['srv-mens-cut', 'srv-z-haircut']
  },
  {
    id: 'stf-jordan',
    orgId: 'org-apex',
    branchId: 'br-apex-downtown',
    name: 'Jordan Cruz',
    roleTitle: 'Clinical Therapist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
    colorTag: '#8b5cf6',
    servicesHandled: ['srv-therapy', 'srv-scalp-detox', 'srv-general-consult']
  },
  {
    id: 'stf-leo',
    orgId: 'org-apex',
    branchId: 'br-apex-downtown',
    name: 'Leo Martinez',
    roleTitle: 'Senior Stylist',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
    colorTag: '#f59e0b',
    servicesHandled: ['srv-mens-cut', 'srv-z-haircut', 'srv-therapy']
  },
  {
    id: 'stf-ryan',
    orgId: 'org-apex',
    branchId: 'br-apex-downtown',
    name: 'Ryan Anderson',
    roleTitle: 'Therapist',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
    colorTag: '#ec4899',
    servicesHandled: ['srv-therapy', 'srv-scalp-detox', 'srv-general-consult']
  }
];

export const MOCK_APPOINTMENTS: PortalAppointment[] = [
  // 1. Daniel Carter (9:00 AM - 10:00 AM with John Dean) -> Done
  {
    id: 'apt-101',
    ticketNumber: 'A-101',
    orgId: 'org-apex',
    orgName: 'Apex Care & Wellness Hub',
    branchId: 'br-apex-downtown',
    branchName: 'Downtown Central Flagship',
    serviceId: 'srv-mens-cut',
    serviceName: "Men's Cut",
    staffId: 'stf-john',
    staffName: 'John Dean',
    customerName: 'Daniel Carter',
    customerPhone: '+1 (555) 234-9081',
    customerEmail: 'daniel.carter@example.com',
    date: '2026-08-29',
    startTime: '09:00',
    endTime: '10:00',
    timeSlotFormatted: '9:00AM - 10:00AM',
    status: 'Done',
    isWalkIn: false,
    createdAt: '2026-08-29T08:15:00Z'
  },
  // 2. Michael Brooks (9:15 AM - 10:00 AM with Ryan Anderson) -> Done
  {
    id: 'apt-102',
    ticketNumber: 'A-102',
    orgId: 'org-apex',
    orgName: 'Apex Care & Wellness Hub',
    branchId: 'br-apex-downtown',
    branchName: 'Downtown Central Flagship',
    serviceId: 'srv-therapy',
    serviceName: 'Revitalizing Hair Treatment',
    staffId: 'stf-ryan',
    staffName: 'Ryan Anderson',
    customerName: 'Michael Brooks',
    customerPhone: '+1 (555) 982-1144',
    customerEmail: 'm.brooks@example.com',
    date: '2026-08-29',
    startTime: '09:15',
    endTime: '10:00',
    timeSlotFormatted: '9:15AM - 10:00AM',
    status: 'Done',
    isWalkIn: false,
    createdAt: '2026-08-29T08:30:00Z'
  },
  // 3. Nathan Cooper (10:00 AM - 10:45 AM with Jordan Cruz) -> Done
  {
    id: 'apt-103',
    ticketNumber: 'A-103',
    orgId: 'org-apex',
    orgName: 'Apex Care & Wellness Hub',
    branchId: 'br-apex-downtown',
    branchName: 'Downtown Central Flagship',
    serviceId: 'srv-therapy',
    serviceName: 'Dandruff Control Therapy',
    staffId: 'stf-jordan',
    staffName: 'Jordan Cruz',
    customerName: 'Nathan Cooper',
    customerPhone: '+1 (555) 432-8877',
    customerEmail: 'nathan.c@example.com',
    date: '2026-08-29',
    startTime: '10:00',
    endTime: '10:45',
    timeSlotFormatted: '10:00AM - 10:45AM',
    status: 'Done',
    isWalkIn: false,
    createdAt: '2026-08-29T09:00:00Z'
  },
  // 4. Jason Miller (11:00 AM - 12:00 PM with Marcus Reid) -> On-going
  {
    id: 'apt-104',
    ticketNumber: 'A-104',
    orgId: 'org-apex',
    orgName: 'Apex Care & Wellness Hub',
    branchId: 'br-apex-downtown',
    branchName: 'Downtown Central Flagship',
    serviceId: 'srv-z-haircut',
    serviceName: 'Z Haircut',
    staffId: 'stf-marcus',
    staffName: 'Marcus Reid',
    customerName: 'Jason Miller',
    customerPhone: '+1 (555) 345-0912',
    customerEmail: 'jmiller@example.com',
    date: '2026-08-29',
    startTime: '11:00',
    endTime: '12:00',
    timeSlotFormatted: '11:00AM - 12:00PM',
    status: 'On-going',
    isWalkIn: true,
    notes: 'Walk-in client requested priority finishing',
    createdAt: '2026-08-29T10:45:00Z'
  },
  // 5. David Johnson (11:30 AM - 12:15 PM with Leo Martinez) -> Waiting
  {
    id: 'apt-105',
    ticketNumber: 'A-105',
    orgId: 'org-apex',
    orgName: 'Apex Care & Wellness Hub',
    branchId: 'br-apex-downtown',
    branchName: 'Downtown Central Flagship',
    serviceId: 'srv-mens-cut',
    serviceName: 'Iron / Hair Styling',
    staffId: 'stf-leo',
    staffName: 'Leo Martinez',
    customerName: 'David Johnson',
    customerPhone: '+1 (555) 678-2233',
    customerEmail: 'david.j@example.com',
    date: '2026-08-29',
    startTime: '11:30',
    endTime: '12:15',
    timeSlotFormatted: '11:30AM - 12:15PM',
    status: 'Waiting',
    isWalkIn: false,
    createdAt: '2026-08-29T11:00:00Z'
  },
  // 6. Carlos Mendez (12:30 PM - 1:30 PM with John Dean) -> Waiting
  {
    id: 'apt-106',
    ticketNumber: 'A-106',
    orgId: 'org-apex',
    orgName: 'Apex Care & Wellness Hub',
    branchId: 'br-apex-downtown',
    branchName: 'Downtown Central Flagship',
    serviceId: 'srv-mens-cut',
    serviceName: "Men's Cut",
    staffId: 'stf-john',
    staffName: 'John Dean',
    customerName: 'Carlos Mendez',
    customerPhone: '+1 (555) 890-4455',
    customerEmail: 'carlos.m@example.com',
    date: '2026-08-29',
    startTime: '12:30',
    endTime: '13:30',
    timeSlotFormatted: '12:30PM - 1:30PM',
    status: 'Waiting',
    isWalkIn: false,
    createdAt: '2026-08-29T11:30:00Z'
  },
  // 7. Ethan Miller (2:00 PM - 3:00 PM with Ryan Anderson) -> Waiting
  {
    id: 'apt-107',
    ticketNumber: 'A-107',
    orgId: 'org-apex',
    orgName: 'Apex Care & Wellness Hub',
    branchId: 'br-apex-downtown',
    branchName: 'Downtown Central Flagship',
    serviceId: 'srv-scalp-detox',
    serviceName: 'Scalp Detox Treatment',
    staffId: 'stf-ryan',
    staffName: 'Ryan Anderson',
    customerName: 'Ethan Miller',
    customerPhone: '+1 (555) 789-3321',
    customerEmail: 'ethan.m@example.com',
    date: '2026-08-29',
    startTime: '14:00',
    endTime: '15:00',
    timeSlotFormatted: '2:00PM - 3:00PM',
    status: 'Waiting',
    isWalkIn: false,
    createdAt: '2026-08-29T12:00:00Z'
  }
];

export const INITIAL_KPI_STATS: BookingKPIStats = {
  totalAppointments: 140,
  completedPercent: 85,
  noShowPercent: 7,
  avgWaitlistHours: 1.5,
  waitingCount: 3,
  onGoingCount: 1
};

export const QUICK_CUSTOMERS_LIST = [
  { name: 'Ethan Caldwell', email: 'ethan.caldwell@example.com', phone: '+1 (555) 201-9988', initials: 'EC', color: '#ec4899' },
  { name: 'Kristin Watson', email: 'kristin.watson@example.com', phone: '+1 (555) 402-1133', initials: 'KW', color: '#0ea5e9' },
  { name: 'Liam Torres', email: 'liam.torres@example.com', phone: '+1 (555) 703-4422', initials: 'LT', color: '#3b82f6' },
  { name: 'Lila Morgan', email: 'lila.morgan@example.com', phone: '+1 (555) 804-5511', initials: 'LM', color: '#10b981' },
  { name: 'Savannah Brooks', email: 'savannah@example.com', phone: '+1 (555) 905-6677', initials: 'SB', color: '#f59e0b' }
];

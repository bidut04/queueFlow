export type NavPageId = 
  | 'dashboard' 
  | 'branches' 
  | 'services' 
  | 'employees'
  | 'users' 
  | 'bookings' 
  | 'master-booking-form'
  | 'tickets' 
  | 'queue' 
  | 'reports' 
  | 'settings'
  | 'roles'
  | 'departments'
  | 'employee-department-association'
  | 'login'
  | 'login-form'
  | 'form-builder'
  | 'platform'
  | 'org-portal';

export interface NavSubItem {
  id: NavPageId;
  label: string;
  iconName?: string;
}

export interface NavItem {
  id: NavPageId | 'master' | 'association';
  label: string;
  iconName: string;
  badgeCount?: number;
  subItems?: NavSubItem[];
}

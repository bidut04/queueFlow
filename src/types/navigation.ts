export type NavPageId = 
  | 'dashboard' 
  | 'branches' 
  | 'services' 
  | 'categories'
  | 'employees'
  | 'users' 
  | 'bookings' 
  | 'master-booking-form'
  | 'tickets' 
  | 'queue' 
  | 'reports' 
  | 'settings'
  | 'roles'
  | 'permissions'
  | 'departments'
  | 'employee-department-association'
  | 'login'
  | 'login-form'
  | 'form-builder'
  | 'platform'
  | 'org-portal'
  | 'setup-password'
  | 'queue-portal';

export interface NavSubItem {
  id: NavPageId | string;
  label: string;
  iconName?: string;
}

export interface NavItem {
  id: NavPageId | 'master' | 'association' | string;
  label: string;
  iconName: string;
  badgeCount?: number;
  subItems?: NavSubItem[];
}

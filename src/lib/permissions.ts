import { authApi } from '../api/auth.api';

export interface ModulePermissionRow {
  id: string;
  module: string;
  description: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  copy: boolean;
  excel: boolean;
  print: boolean;
  pdf: boolean;
}

// Runtime token export to satisfy non-type imports
export const ModulePermissionRow = undefined;

export const DEFAULT_MODULE_PERMISSIONS: ModulePermissionRow[] = [
  {
    id: 'dashboard',
    module: 'Dashboard',
    description: 'KPI summary, queue velocity and live waiting metrics',
    create: false,
    read: true,
    update: false,
    delete: false,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'queue-portal',
    module: 'Queue & Booking Portal',
    description: 'Self-service customer kiosk and ticket booking interface',
    create: true,
    read: true,
    update: false,
    delete: false,
    copy: true,
    excel: false,
    print: true,
    pdf: false,
  },
  {
    id: 'bookings',
    module: 'Bookings & Appointments',
    description: 'Customer scheduled bookings, dates, timeslots and status',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'users',
    module: 'User Accounts',
    description: 'Tenant staff credentials, profiles and access assignments',
    create: true,
    read: true,
    update: true,
    delete: true,
    copy: true,
    excel: true,
    print: false,
    pdf: false,
  },
  {
    id: 'tickets',
    module: 'Live Tickets',
    description: 'Real-time ticket tokens, counter call orders and stages',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'queue',
    module: 'Queue Management',
    description: 'Live token calls, serving, transfers and waiting queue states',
    create: true,
    read: true,
    update: true,
    delete: true,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'reports',
    module: 'Reports & Analytics',
    description: 'Historical wait times, operator velocity and export logs',
    create: false,
    read: true,
    update: false,
    delete: false,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'master-booking-form',
    module: 'Master Booking Form',
    description: 'Master appointment intake form configuration and fields',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: false,
    excel: false,
    print: false,
    pdf: false,
  },
  {
    id: 'form-builder',
    module: 'Dynamic Form Builder',
    description: 'Custom intake questions, conditional logic and layout editor',
    create: true,
    read: true,
    update: true,
    delete: true,
    copy: false,
    excel: false,
    print: false,
    pdf: false,
  },
  {
    id: 'org-portal',
    module: 'Organization Portal',
    description: 'Multi-branch organizational governance and hub directory',
    create: false,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: false,
    pdf: false,
  },
  {
    id: 'login-form',
    module: 'Login Form Designer',
    description: 'Custom tenant brand logos, themes and auth layout options',
    create: false,
    read: true,
    update: true,
    delete: false,
    copy: false,
    excel: false,
    print: false,
    pdf: false,
  },
  {
    id: 'roles',
    module: 'Roles & Designations',
    description: 'Security designations, privileges and permissions matrix',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'permissions',
    module: 'Permissions Matrix',
    description: 'Decider access control, module visibility and action grants',
    create: true,
    read: true,
    update: true,
    delete: true,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'departments',
    module: 'Departments',
    description: 'Organizational operational divisions and counter groupings',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'branches',
    module: 'Branches & Locations',
    description: 'Physical service centers, regional hubs and counters',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: false,
    pdf: false,
  },
  {
    id: 'services',
    module: 'Services Catalog',
    description: 'Branch services, SLAs, target duration and category tagging',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: false,
    pdf: false,
  },
  {
    id: 'categories',
    module: 'Service Categories',
    description: 'Category taxonomy, service classifications, tags and color coding',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'employees',
    module: 'Employee & Staff',
    description: 'Counter staff, operators, shift associations and desk pins',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: true,
    pdf: true,
  },
  {
    id: 'employee-department-association',
    module: 'Emp Dept Association',
    description: 'Counter staff service desk and department associations',
    create: true,
    read: true,
    update: true,
    delete: false,
    copy: true,
    excel: true,
    print: false,
    pdf: false,
  },
  {
    id: 'settings',
    module: 'Company Settings',
    description: 'Tenant organization branding, logo and operating hours',
    create: false,
    read: true,
    update: true,
    delete: false,
    copy: false,
    excel: false,
    print: false,
    pdf: false,
  },
];

/**
 * Default permission matrix for Receptionist role
 * Grants operational front-desk powers (Tickets, Queue, Bookings, Dashboard)
 * Revokes administrative governance modules (Roles, Permissions, Settings, etc.)
 */
export const RECEPTIONIST_MODULE_PERMISSIONS: ModulePermissionRow[] = DEFAULT_MODULE_PERMISSIONS.map((mod) => {
  if (mod.id === 'tickets' || mod.id === 'queue') {
    return {
      ...mod,
      create: true,
      read: true,
      update: true,
      delete: false,
      copy: true,
      excel: false,
      print: true,
      pdf: false,
    };
  }
  if (mod.id === 'bookings' || mod.id === 'queue-portal') {
    return {
      ...mod,
      create: true,
      read: true,
      update: false,
      delete: false,
      copy: true,
      excel: true,
      print: true,
      pdf: false,
    };
  }
  if (mod.id === 'dashboard' || mod.id === 'master-booking-form') {
    return {
      ...mod,
      create: false,
      read: true,
      update: false,
      delete: false,
      copy: false,
      excel: false,
      print: false,
      pdf: false,
    };
  }
  // All other admin / sensitive modules are REVOKED (Read = false -> hidden in navigation and blocked)
  return {
    ...mod,
    create: false,
    read: false,
    update: false,
    delete: false,
    copy: false,
    excel: false,
    print: false,
    pdf: false,
  };
});

export const PERMISSIONS_STORAGE_KEY = 'qf_tenant_permissions_matrix';
export const PERMISSIONS_UPDATED_EVENT = 'permissions:updated';

/**
 * Checks if the current authenticated user has Decider power
 * (i.e. is an authorized admin with authority to grant or revoke system capabilities)
 */
export const isAuthorizedDecider = (): boolean => {
  if (!authApi.isAuthenticated()) return false;
  if (authApi.isSuperAdmin()) return true;
  if (authApi.isTenantAdmin()) return true;
  const user = authApi.getCurrentUser();
  if (!user) return false;
  const role = (user.role || '').toUpperCase();
  const userType = (user.userType || '').toUpperCase();
  return (
    role === 'ADMIN' ||
    role === 'TENANT_ADMIN' ||
    role === 'TENANT_OWNER' ||
    role === 'PLATFORM_SUPER_ADMIN' ||
    role === 'PLATFORM_OWNER' ||
    userType === 'TENANT_ADMIN' ||
    userType === 'PLATFORM_SUPER_ADMIN'
  );
};

/**
 * Retrieve saved permission matrix from localStorage (or fallback to defaults)
 */
export const getStoredPermissions = (): ModulePermissionRow[] => {
  try {
    const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map<string, ModulePermissionRow>(parsed.map((item) => [item.id, item]));
        return DEFAULT_MODULE_PERMISSIONS.map((def) => map.get(def.id) || def);
      }
    }
  } catch (err) {
    console.error('Error reading permissions from storage:', err);
  }
  return DEFAULT_MODULE_PERMISSIONS;
};

/**
 * Persists the permission matrix and notifies listeners across the application
 */
export const savePermissions = (modules: ModulePermissionRow[]): void => {
  try {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(modules));
  } catch (err) {
    console.error('Failed to save permissions to storage:', err);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PERMISSIONS_UPDATED_EVENT, { detail: modules }));
  }
};

/**
 * Checks whether the current user is allowed to access and see a specific module/page.
 * Returns false if:
 * 1. The page is 'permissions' and user is not an authorized decider.
 * 2. An administrator has revoked 'read' (view) power for this module in the matrix.
 */
export const canUserAccessPage = (pageId: string): boolean => {
  // 1. The Permissions Matrix is strictly reserved for authorized deciders
  if (pageId === 'permissions') {
    return isAuthorizedDecider();
  }

  // 2. Public / standalone system views that have their own authentication routes
  if (pageId === 'setup-password' || pageId === 'login' || pageId === 'platform') {
    return true;
  }

  // 3. For any operational module: check if read (view) permission has been revoked
  const permissions = getStoredPermissions();
  const modulePerm = permissions.find((m) => m.id === pageId);
  if (modulePerm) {
    return modulePerm.read;
  }

  return true;
};

/**
 * Retrieves the specific export permissions for a module (Copy, Excel, Print, PDF)
 */
export const getExportPermissionsForModule = (pageId: string) => {
  const permissions = getStoredPermissions();
  const modulePerm = permissions.find((m) => m.id === pageId);
  if (modulePerm) {
    return {
      copy: modulePerm.copy,
      excel: modulePerm.excel,
      print: modulePerm.print,
      pdf: modulePerm.pdf,
    };
  }
  return { copy: true, excel: true, print: true, pdf: true };
};


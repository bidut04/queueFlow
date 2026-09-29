export interface RoleItem {
  id: string;
  roleCode: string;
  roleName: string;
  description: string;
  permissionsCount: number;
  assignedEmployees: number;
  level: 'High' | 'Medium' | 'Standard';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export const INITIAL_ROLES: RoleItem[] = [
  {
    id: 'role-1',
    roleCode: 'ROLE_SUPER_ADMIN',
    roleName: 'Super Admin',
    description: 'Full system control, tenant configuration & audit logs access',
    permissionsCount: 48,
    assignedEmployees: 2,
    level: 'High',
    status: 'Active',
    createdAt: '2024-01-10'
  },
  {
    id: 'role-2',
    roleCode: 'ROLE_BRANCH_MANAGER',
    roleName: 'Branch Manager',
    description: 'Branch level counter management, staff scheduling & reports',
    permissionsCount: 32,
    assignedEmployees: 5,
    level: 'High',
    status: 'Active',
    createdAt: '2024-02-01'
  },
  {
    id: 'role-3',
    roleCode: 'ROLE_COUNTER_STAFF',
    roleName: 'Counter Staff / Operator',
    description: 'Live ticket calling, customer serving & token handling',
    permissionsCount: 16,
    assignedEmployees: 18,
    level: 'Standard',
    status: 'Active',
    createdAt: '2024-02-15'
  },
  {
    id: 'role-4',
    roleCode: 'ROLE_KYC_OFFICER',
    roleName: 'KYC & Verification Officer',
    description: 'Document verification, customer onboarding & compliance checks',
    permissionsCount: 22,
    assignedEmployees: 8,
    level: 'Medium',
    status: 'Active',
    createdAt: '2024-03-01'
  },
  {
    id: 'role-5',
    roleCode: 'ROLE_LOAN_SPECIALIST',
    roleName: 'Loan Operations Specialist',
    description: 'Credit application processing & loan disbursement tickets',
    permissionsCount: 24,
    assignedEmployees: 6,
    level: 'Medium',
    status: 'Active',
    createdAt: '2024-03-20'
  },
  {
    id: 'role-6',
    roleCode: 'ROLE_AUDITOR',
    roleName: 'Compliance Auditor',
    description: 'Read-only access to branch queue metrics, waiting logs & reports',
    permissionsCount: 12,
    assignedEmployees: 3,
    level: 'Standard',
    status: 'Active',
    createdAt: '2024-04-10'
  }
];

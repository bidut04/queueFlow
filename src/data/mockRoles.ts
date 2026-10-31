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
    id: 'role-receptionist',
    roleCode: 'ROLE_RECEPTIONIST',
    roleName: 'Receptionist',
    description: 'Front desk reception, visitor token issuance, and queue check-in',
    permissionsCount: 8,
    assignedEmployees: 1,
    level: 'Standard',
    status: 'Active',
    createdAt: '2024-01-15',
  },
];

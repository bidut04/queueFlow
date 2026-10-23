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

export const INITIAL_ROLES: RoleItem[] = [];

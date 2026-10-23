export interface EmployeeDepartmentAssociation {
  id: string;
  assocCode: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  deptId: string;
  deptName: string;
  designationRole: string;
  associationType: 'Primary' | 'Secondary';
  branch: string;
  assignedDate: string;
  status: 'Active' | 'Inactive';
}

export const INITIAL_ASSOCIATIONS: EmployeeDepartmentAssociation[] = [];

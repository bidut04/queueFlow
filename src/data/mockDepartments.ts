export interface DepartmentItem {
  id: string;
  deptCode: string;
  deptName: string;
  headOfDept: string;
  branch: string;
  totalStaff: number;
  activeCounters: number;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

export const INITIAL_DEPARTMENTS: DepartmentItem[] = [];

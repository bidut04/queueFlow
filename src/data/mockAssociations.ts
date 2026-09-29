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

export const INITIAL_ASSOCIATIONS: EmployeeDepartmentAssociation[] = [
  {
    id: 'assoc-1',
    assocCode: 'EDA-2001',
    employeeId: 'EMP-1001',
    employeeName: 'Rahul Amin',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    deptId: 'DEP-101',
    deptName: 'Executive Operations',
    designationRole: 'Super Admin',
    associationType: 'Primary',
    branch: 'Main Branch',
    assignedDate: '2023-01-15',
    status: 'Active'
  },
  {
    id: 'assoc-2',
    assocCode: 'EDA-2002',
    employeeId: 'EMP-1002',
    employeeName: 'Dr. Nasrin Sultana',
    employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    deptId: 'DEP-102',
    deptName: 'Medical & Healthcare',
    designationRole: 'Branch Manager',
    associationType: 'Primary',
    branch: 'Gulshan Branch',
    assignedDate: '2023-03-20',
    status: 'Active'
  },
  {
    id: 'assoc-3',
    assocCode: 'EDA-2003',
    employeeId: 'EMP-1003',
    employeeName: 'Tanvir Hossain',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    deptId: 'DEP-103',
    deptName: 'KYC & Verification',
    designationRole: 'Branch Manager',
    associationType: 'Primary',
    branch: 'Dhanmondi Branch',
    assignedDate: '2023-06-10',
    status: 'Active'
  },
  {
    id: 'assoc-4',
    assocCode: 'EDA-2004',
    employeeId: 'EMP-1004',
    employeeName: 'Farzana Karim',
    employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    deptId: 'DEP-104',
    deptName: 'Cash & Teller Operations',
    designationRole: 'Counter Staff',
    associationType: 'Primary',
    branch: 'Uttara Branch',
    assignedDate: '2024-02-01',
    status: 'Active'
  },
  {
    id: 'assoc-5',
    assocCode: 'EDA-2005',
    employeeId: 'EMP-1005',
    employeeName: 'Shahadat Hossain',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    deptId: 'DEP-105',
    deptName: 'Loan & Credit Services',
    designationRole: 'Loan Specialist',
    associationType: 'Primary',
    branch: 'Mirpur Branch',
    assignedDate: '2024-04-12',
    status: 'Active'
  },
  {
    id: 'assoc-6',
    assocCode: 'EDA-2006',
    employeeId: 'EMP-1006',
    employeeName: 'Sabrina Khan',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    deptId: 'DEP-106',
    deptName: 'Customer Helpdesk & Service',
    designationRole: 'Counter Staff',
    associationType: 'Secondary',
    branch: 'Main Branch',
    assignedDate: '2024-05-01',
    status: 'Active'
  },
  {
    id: 'assoc-7',
    assocCode: 'EDA-2007',
    employeeId: 'EMP-1007',
    employeeName: 'Zubair Ahmed',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    deptId: 'DEP-104',
    deptName: 'Cash & Teller Operations',
    designationRole: 'Counter Staff',
    associationType: 'Primary',
    branch: 'Gulshan Branch',
    assignedDate: '2024-05-10',
    status: 'Active'
  }
];

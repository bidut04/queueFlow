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

export const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'dept-1',
    deptCode: 'DEP-101',
    deptName: 'Executive Operations',
    headOfDept: 'Rahul Amin',
    branch: 'Main Branch',
    totalStaff: 6,
    activeCounters: 2,
    status: 'Active',
    createdDate: '2023-01-15'
  },
  {
    id: 'dept-2',
    deptCode: 'DEP-102',
    deptName: 'Medical & Healthcare',
    headOfDept: 'Dr. Nasrin Sultana',
    branch: 'Gulshan Branch',
    totalStaff: 12,
    activeCounters: 5,
    status: 'Active',
    createdDate: '2023-03-10'
  },
  {
    id: 'dept-3',
    deptCode: 'DEP-103',
    deptName: 'KYC & Verification',
    headOfDept: 'Tanvir Hossain',
    branch: 'Dhanmondi Branch',
    totalStaff: 8,
    activeCounters: 3,
    status: 'Active',
    createdDate: '2023-06-01'
  },
  {
    id: 'dept-4',
    deptCode: 'DEP-104',
    deptName: 'Cash & Teller Operations',
    headOfDept: 'Farzana Karim',
    branch: 'Uttara Branch',
    totalStaff: 15,
    activeCounters: 6,
    status: 'Active',
    createdDate: '2023-08-20'
  },
  {
    id: 'dept-5',
    deptCode: 'DEP-105',
    deptName: 'Loan & Credit Services',
    headOfDept: 'Shahadat Hossain',
    branch: 'Mirpur Branch',
    totalStaff: 9,
    activeCounters: 4,
    status: 'Active',
    createdDate: '2023-11-05'
  },
  {
    id: 'dept-6',
    deptCode: 'DEP-106',
    deptName: 'Customer Helpdesk & Service',
    headOfDept: 'Sabrina Khan',
    branch: 'Main Branch',
    totalStaff: 10,
    activeCounters: 4,
    status: 'Active',
    createdDate: '2024-01-10'
  }
];

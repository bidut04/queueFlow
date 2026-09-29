export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Branch Manager' | 'Staff' | 'Doctor' | 'Officer';
  department: string;
  branch: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
}

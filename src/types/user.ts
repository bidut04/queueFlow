export type UserRole = 'Super Admin' | 'Branch Manager' | 'Staff' | 'Doctor' | 'Customer';
export type AccountStatus = 'Active' | 'Failed' | 'Inactive';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  avatarUrl: string;
  phone: string;
  country: string;
  countryFlag: string;
  balance: string;
  totalInvoices: number;
  createdOn: string;
  status: AccountStatus;
  joinedDate: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: string;
  totalBookingsThisMonth: number;
  growthRate: number;
  status: 'Active' | 'Inactive';
}

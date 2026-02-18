export interface Appointment {
  id?: string;
  clientName?: string;
  clientPhone?: string;
  carModel?: string;
  service?: string;
  value?: number;
  isInsurance?: boolean;
  date: string;
  time: string;
  createdBy: string;
  createdAt: string;
}

export interface Employee {
  id?: string;
  name: string;
  email?: string;
  password: string;
  isAdmin: boolean;
}

export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  totalAppointments: number;
  insurancePercentage: number;
}

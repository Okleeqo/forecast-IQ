export interface CohortMetrics {
  cohortDate: string;
  size: number;
  activeCustomers: number;
  churnedCustomers: number;
  retentionRate: number;
  averageRevenue: number;
  totalRevenue: number;
}

export interface RetentionData {
  cohort: string;
  size: number;
  retentionByMonth: number[];
}

export interface CohortCustomer {
  id: string;
  signupDate: string;
  churnDate?: string;
  mrr: number;
}
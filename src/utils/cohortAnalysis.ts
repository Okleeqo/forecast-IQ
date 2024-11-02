import { SubscriptionData } from '../types';

export interface CohortMetrics {
  cohortDate: string;
  size: number;
  activeCustomers: number;
  churnedCustomers: number;
  retentionRate: number;
  averageRevenue: number;
  totalRevenue: number;
}

export function calculateCohortMetrics(data: SubscriptionData[]): CohortMetrics[] {
  // Group data by month
  const monthlyData = data.reduce((acc, entry) => {
    const date = new Date(entry.date);
    if (!isNaN(date.getTime())) { // Check if date is valid
      const monthKey = date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short'
      });
      
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(entry);
    }
    return acc;
  }, {} as Record<string, SubscriptionData[]>);

  // Calculate metrics for each cohort
  return Object.entries(monthlyData).map(([monthKey, cohortData]) => {
    const totalSubscribers = cohortData.reduce((sum, entry) => sum + entry.subscribers, 0);
    const activeSubscribers = cohortData[cohortData.length - 1].subscribers;
    const churnedSubscribers = totalSubscribers - activeSubscribers;
    const totalRevenue = cohortData.reduce((sum, entry) => sum + entry.mrr, 0);
    const averageRevenue = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;

    return {
      cohortDate: monthKey,
      size: totalSubscribers,
      activeCustomers: activeSubscribers,
      churnedCustomers: churnedSubscribers,
      retentionRate: totalSubscribers > 0 ? (activeSubscribers / totalSubscribers) * 100 : 0,
      averageRevenue,
      totalRevenue
    };
  }).sort((a, b) => {
    // Sort by date in descending order
    const dateA = new Date(a.cohortDate);
    const dateB = new Date(b.cohortDate);
    return dateB.getTime() - dateA.getTime();
  });
}
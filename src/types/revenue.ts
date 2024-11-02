export interface MonthlyRevenueData {
  month: string;
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnedMrr: number;
  netMrr: number;
}

export interface SegmentRevenueData {
  name: string;
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnedMrr: number;
  netMrr: number;
}

export interface RevenueBreakdown {
  monthlyData: MonthlyRevenueData[];
  segmentData: SegmentRevenueData[];
  summary: {
    newMrr: number;
    expansionMrr: number;
    contractionMrr: number;
    churnedMrr: number;
    netMrr: number;
  };
}
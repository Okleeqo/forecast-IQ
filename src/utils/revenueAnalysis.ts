import { SubscriptionData, SegmentType } from '../types';
import { MonthlyRevenueData, RevenueBreakdown, SegmentRevenueData } from '../types/revenue';

export function calculateRevenueBreakdown(
  data: SubscriptionData,
  selectedSegment: SegmentType | 'all',
  months: number
): RevenueBreakdown {
  const relevantSegments = selectedSegment === 'all' 
    ? data.segments 
    : data.segments.filter(s => s.name === selectedSegment);

  const monthlyData = generateMonthlyData(relevantSegments, data.mrr, months);
  const segmentData = calculateSegmentBreakdown(relevantSegments);

  const summary = {
    newMrr: monthlyData.reduce((sum, m) => sum + m.newMrr, 0),
    expansionMrr: monthlyData.reduce((sum, m) => sum + m.expansionMrr, 0),
    contractionMrr: monthlyData.reduce((sum, m) => sum + m.contractionMrr, 0),
    churnedMrr: monthlyData.reduce((sum, m) => sum + m.churnedMrr, 0),
    netMrr: monthlyData.reduce((sum, m) => sum + m.netMrr, 0)
  };

  return {
    monthlyData,
    segmentData,
    summary
  };
}

function generateMonthlyData(
  segments: SubscriptionData['segments'],
  totalMrr: number,
  months: number
): MonthlyRevenueData[] {
  return Array.from({ length: months }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (months - i - 1));

    const segmentMrr = segments.reduce((sum, s) => sum + s.mrr, 0);
    const avgGrowthRate = segments.reduce((sum, s) => sum + s.growthRate, 0) / segments.length;
    const avgChurnRate = segments.reduce((sum, s) => sum + s.churnRate, 0) / segments.length;

    const newMrr = segmentMrr * (avgGrowthRate / 100);
    const expansionMrr = segmentMrr * 0.1; // Assume 10% expansion rate
    const contractionMrr = segmentMrr * 0.05; // Assume 5% contraction rate
    const churnedMrr = segmentMrr * (avgChurnRate / 100);

    return {
      month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      newMrr,
      expansionMrr,
      contractionMrr,
      churnedMrr,
      netMrr: newMrr + expansionMrr - contractionMrr - churnedMrr
    };
  });
}

function calculateSegmentBreakdown(
  segments: SubscriptionData['segments']
): SegmentRevenueData[] {
  return segments.map(segment => {
    const newMrr = segment.mrr * (segment.growthRate / 100);
    const expansionMrr = segment.mrr * 0.1;
    const contractionMrr = segment.mrr * 0.05;
    const churnedMrr = segment.mrr * (segment.churnRate / 100);

    return {
      name: segment.name,
      newMrr,
      expansionMrr,
      contractionMrr,
      churnedMrr,
      netMrr: newMrr + expansionMrr - contractionMrr - churnedMrr
    };
  });
}
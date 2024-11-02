import { SubscriptionData } from '../types';

export interface SegmentCACMetrics {
  cac: number;
  cltv: number;
  cltvCacRatio: number;
  paybackPeriod: number;
  efficiency: 'optimal' | 'good' | 'poor';
}

export interface CACMetrics {
  overall: SegmentCACMetrics;
  segments: Record<string, SegmentCACMetrics>;
  insights: string[];
}

export function calculateCACMetrics(data: SubscriptionData | null, thresholdRatio: number): CACMetrics {
  if (!data) {
    return {
      overall: {
        cac: 0,
        cltv: 0,
        cltvCacRatio: 0,
        paybackPeriod: 0,
        efficiency: 'poor'
      },
      segments: {},
      insights: ['No data available']
    };
  }

  // Calculate overall metrics
  const averageCAC = calculateAverageCAC(data.cac);
  const monthlyRevenue = data.subscribers > 0 ? data.mrr / data.subscribers : 0;
  const cltv = calculateCLTV(monthlyRevenue, data.churnRate);
  const cltvCacRatio = calculateRatio(cltv, averageCAC);
  const paybackPeriod = calculatePaybackPeriod(monthlyRevenue, averageCAC);

  const overall = {
    cac: averageCAC,
    cltv,
    cltvCacRatio,
    paybackPeriod,
    efficiency: getEfficiencyRating(cltvCacRatio, thresholdRatio)
  };

  // Calculate segment metrics
  const segments = data.segments.reduce((acc, segment) => {
    const segmentCAC = getSegmentCAC(segment.name, data.cac);
    const segmentRevenue = segment.subscribers > 0 ? segment.mrr / segment.subscribers : 0;
    const segmentCLTV = calculateCLTV(segmentRevenue, segment.churnRate);
    const segmentRatio = calculateRatio(segmentCLTV, segmentCAC);
    const segmentPayback = calculatePaybackPeriod(segmentRevenue, segmentCAC);

    acc[segment.name] = {
      cac: segmentCAC,
      cltv: segmentCLTV,
      cltvCacRatio: segmentRatio,
      paybackPeriod: segmentPayback,
      efficiency: getEfficiencyRating(segmentRatio, thresholdRatio)
    };

    return acc;
  }, {} as Record<string, SegmentCACMetrics>);

  const insights = generateInsights(segments, overall, thresholdRatio);

  return { overall, segments, insights };
}

function calculateAverageCAC(cac: { smb: number; midMarket: number; enterprise: number; average?: number }): number {
  if (cac.average && cac.average > 0) return cac.average;
  
  const values = [cac.smb, cac.midMarket, cac.enterprise].filter(v => v > 0);
  return values.length > 0 ? values.reduce((a, b) => a + b) / values.length : 0;
}

function calculateCLTV(monthlyRevenue: number, churnRate: number): number {
  if (!monthlyRevenue || !churnRate) return 0;
  const monthlyChurnRate = churnRate / 100;
  return monthlyChurnRate > 0 ? monthlyRevenue / monthlyChurnRate : 0;
}

function calculateRatio(value: number, divisor: number): number {
  if (!value || !divisor) return 0;
  return divisor > 0 ? value / divisor : 0;
}

function calculatePaybackPeriod(monthlyRevenue: number, cac: number): number {
  if (!monthlyRevenue || !cac) return 0;
  return monthlyRevenue > 0 ? cac / monthlyRevenue : 0;
}

function getSegmentCAC(
  segmentName: string,
  cac: { smb: number; midMarket: number; enterprise: number }
): number {
  switch (segmentName) {
    case 'SMB':
      return cac.smb || 0;
    case 'Mid-Market':
      return cac.midMarket || 0;
    case 'Enterprise':
      return cac.enterprise || 0;
    default:
      return 0;
  }
}

function getEfficiencyRating(ratio: number, threshold: number): 'optimal' | 'good' | 'poor' {
  if (!ratio || !threshold) return 'poor';
  if (ratio >= threshold * 1.5) return 'optimal';
  if (ratio >= threshold) return 'good';
  return 'poor';
}

function generateInsights(
  segments: Record<string, SegmentCACMetrics>,
  overall: SegmentCACMetrics,
  thresholdRatio: number
): string[] {
  const insights: string[] = [];

  if (overall.cac === 0) {
    insights.push('No CAC data available. Please input customer acquisition costs.');
    return insights;
  }

  if (overall.cltvCacRatio < thresholdRatio) {
    insights.push(
      `Overall CLTV/CAC ratio (${overall.cltvCacRatio.toFixed(2)}x) is below target ${thresholdRatio}x.`
    );
  }

  Object.entries(segments).forEach(([segment, metrics]) => {
    if (metrics.cltvCacRatio < thresholdRatio) {
      insights.push(
        `${segment} segment needs attention (${metrics.cltvCacRatio.toFixed(2)}x ratio).`
      );
    }

    if (metrics.paybackPeriod > 12) {
      insights.push(
        `${segment} segment has a long payback period (${metrics.paybackPeriod.toFixed(1)} months).`
      );
    }
  });

  return insights;
}
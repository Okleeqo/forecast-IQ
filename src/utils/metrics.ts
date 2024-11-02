import { CustomerSegment, SubscriptionData } from '../types';

export interface MetricsResult {
  overall: {
    cac: number;
    cltv: number;
    paybackPeriod: number;
    ltv_cac_ratio: number;
  };
  segments: {
    [key: string]: {
      cac: number;
      cltv: number;
      paybackPeriod: number;
      ltv_cac_ratio: number;
    };
  };
}

export function calculateAdvancedMetrics(data: SubscriptionData): MetricsResult {
  const overall = calculateSegmentMetrics({
    name: 'Overall',
    subscribers: data.subscribers,
    mrr: data.mrr,
    churnRate: data.churnRate,
    growthRate: data.growthRate
  }, data.cac.average);

  const segments = data.segments.reduce((acc, segment) => {
    const segmentCAC = getSegmentCAC(segment.name, data.cac);
    acc[segment.name] = calculateSegmentMetrics(segment, segmentCAC);
    return acc;
  }, {} as MetricsResult['segments']);

  return { overall, segments };
}

function calculateSegmentMetrics(
  segment: CustomerSegment | { name: string; subscribers: number; mrr: number; churnRate: number; growthRate: number },
  cac: number
) {
  const arpu = segment.mrr / segment.subscribers;
  const monthlyChurnRate = segment.churnRate / 100;
  
  // Calculate CLTV using the traditional formula: ARPU / Churn Rate
  const cltv = arpu / monthlyChurnRate;
  
  // Calculate Payback Period: CAC / ARPU
  const paybackPeriod = cac / arpu;
  
  // Calculate LTV:CAC ratio
  const ltv_cac_ratio = cltv / cac;

  return {
    cac,
    cltv,
    paybackPeriod,
    ltv_cac_ratio
  };
}

function getSegmentCAC(segmentName: string, cac: { smb: number; midMarket: number; enterprise: number; average: number }) {
  switch (segmentName) {
    case 'SMB':
      return cac.smb;
    case 'Mid-Market':
      return cac.midMarket;
    case 'Enterprise':
      return cac.enterprise;
    default:
      return cac.average;
  }
}

export function getMetricsInsights(metrics: MetricsResult): string[] {
  const insights: string[] = [];
  const { overall } = metrics;

  // LTV:CAC Ratio Analysis
  if (overall.ltv_cac_ratio < 3) {
    insights.push('Warning: LTV:CAC ratio is below the recommended 3:1 minimum. Consider optimizing customer acquisition costs or improving customer lifetime value.');
  } else if (overall.ltv_cac_ratio > 5) {
    insights.push('Opportunity: High LTV:CAC ratio indicates potential for more aggressive growth. Consider increasing marketing spend.');
  }

  // Payback Period Analysis
  if (overall.paybackPeriod > 12) {
    insights.push('Warning: Customer payback period exceeds 12 months. Focus on reducing CAC or increasing ARPU to improve cash efficiency.');
  } else if (overall.paybackPeriod < 6) {
    insights.push('Positive: Quick customer payback period indicates efficient customer acquisition. Consider scaling acquisition efforts.');
  }

  // Segment Analysis
  const segmentInsights = Object.entries(metrics.segments).map(([segment, metrics]) => {
    if (metrics.ltv_cac_ratio < overall.ltv_cac_ratio) {
      return `${segment} segment shows lower efficiency than average. Review acquisition strategy and pricing.`;
    }
    return null;
  }).filter(Boolean);

  insights.push(...segmentInsights);

  return insights;
}
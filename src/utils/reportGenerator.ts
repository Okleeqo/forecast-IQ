import { SubscriptionData } from '../stores/subscriptionStore';
import { formatCurrency, formatPercent } from './forecasting';

interface ReportConfig {
  type: 'revenue' | 'churn' | 'cohort' | 'forecast';
  dateRange: '30d' | '90d' | '6m' | '1y' | 'all';
  data: SubscriptionData[];
}

interface ReportSection {
  title: string;
  content: string;
  metrics?: Record<string, string | number>;
}

interface CFOReport {
  title: string;
  summary: string;
  sections: ReportSection[];
  date: string;
}

export async function generateCFOReport(config: ReportConfig): Promise<CFOReport> {
  const reportData = prepareReportData(config);
  
  const prompt = generateReportPrompt(reportData, config.type);
  
  try {
    const response = await fetch('/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        reportData,
        type: config.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

function generateReportPrompt(data: any, type: string): string {
  const basePrompt = `Generate a detailed CFO-style SaaS metrics report based on the following data. 
    Include executive summary, key metrics analysis, trends, and recommendations.
    Format the report in a professional Fortune 500 style with clear sections and insights.
    Focus on ${type} metrics and their business impact.`;

  return `${basePrompt}\n\nData: ${JSON.stringify(data)}`;
}

function prepareReportData(config: ReportConfig): any {
  const { type, data, dateRange } = config;
  const filteredData = filterDataByRange(data, dateRange);
  
  const metrics = {
    currentMRR: filteredData[filteredData.length - 1].mrr,
    totalSubscribers: filteredData[filteredData.length - 1].subscribers,
    averageGrowthRate: calculateAverageGrowthRate(filteredData),
    averageChurnRate: calculateAverageChurnRate(filteredData),
    revenueGrowth: calculateRevenueGrowth(filteredData),
    netRetentionRate: calculateNetRetention(filteredData),
  };

  const trends = {
    mrrTrend: calculateMRRTrend(filteredData),
    subscriberTrend: calculateSubscriberTrend(filteredData),
    churnTrend: calculateChurnTrend(filteredData),
  };

  return {
    metrics,
    trends,
    historicalData: filteredData,
    period: dateRange,
  };
}

function filterDataByRange(data: SubscriptionData[], range: string): SubscriptionData[] {
  const now = new Date();
  const ranges: Record<string, number> = {
    '30d': 30,
    '90d': 90,
    '6m': 180,
    '1y': 365,
  };

  if (range === 'all') return data;

  const daysToInclude = ranges[range];
  const cutoffDate = new Date(now.getTime() - (daysToInclude * 24 * 60 * 60 * 1000));

  return data.filter(item => new Date(item.date) >= cutoffDate);
}

function calculateAverageGrowthRate(data: SubscriptionData[]): number {
  return data.reduce((sum, item) => sum + item.growthRate, 0) / data.length;
}

function calculateAverageChurnRate(data: SubscriptionData[]): number {
  return data.reduce((sum, item) => sum + item.churnRate, 0) / data.length;
}

function calculateRevenueGrowth(data: SubscriptionData[]): number {
  if (data.length < 2) return 0;
  const firstMRR = data[0].mrr;
  const lastMRR = data[data.length - 1].mrr;
  return ((lastMRR - firstMRR) / firstMRR) * 100;
}

function calculateNetRetention(data: SubscriptionData[]): number {
  if (data.length < 2) return 100;
  const monthlyRetention = data.map(item => 100 - item.churnRate);
  return monthlyRetention.reduce((sum, rate) => sum + rate, 0) / monthlyRetention.length;
}

function calculateMRRTrend(data: SubscriptionData[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';
  const firstMRR = data[0].mrr;
  const lastMRR = data[data.length - 1].mrr;
  const change = ((lastMRR - firstMRR) / firstMRR) * 100;
  return change > 1 ? 'up' : change < -1 ? 'down' : 'stable';
}

function calculateSubscriberTrend(data: SubscriptionData[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';
  const first = data[0].subscribers;
  const last = data[data.length - 1].subscribers;
  const change = ((last - first) / first) * 100;
  return change > 1 ? 'up' : change < -1 ? 'down' : 'stable';
}

function calculateChurnTrend(data: SubscriptionData[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';
  const first = data[0].churnRate;
  const last = data[data.length - 1].churnRate;
  const change = last - first;
  return change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';
}
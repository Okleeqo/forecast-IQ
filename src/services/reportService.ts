import { SubscriptionData } from '../types';
import { Report } from '../types/report';

export async function generateBasicReport(data: SubscriptionData): Promise<Report> {
  const report: Report = {
    title: "Financial Performance Report",
    date: new Date().toISOString(),
    summary: generateSummary(data),
    sections: [
      {
        title: "Revenue Analysis",
        content: generateRevenueAnalysis(data)
      },
      {
        title: "Customer Metrics",
        content: generateCustomerMetrics(data)
      },
      {
        title: "Segment Performance",
        content: generateSegmentAnalysis(data)
      }
    ]
  };

  return report;
}

export async function generateAIInsights(data: SubscriptionData): Promise<Report> {
  try {
    const reportData = {
      mrr: data.mrr,
      subscribers: data.subscribers,
      arpu: data.subscribers > 0 ? data.mrr / data.subscribers : 0,
      churnRate: data.churnRate,
      growthRate: data.growthRate,
      segments: data.segments,
      cac: data.cac,
      seasonalChurn: data.seasonalChurn
    };

    const response = await fetch('/.netlify/functions/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reportData })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result || !result.title || !result.sections) {
      throw new Error('Invalid AI insights data received');
    }

    return result;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw error instanceof Error ? error : new Error('Failed to generate AI insights');
  }
}

function generateSummary(data: SubscriptionData): string {
  const arpu = data.subscribers > 0 ? data.mrr / data.subscribers : 0;
  
  return `Monthly recurring revenue (MRR) is currently at ${formatCurrency(data.mrr)} with ${
    data.subscribers
  } active subscribers. The average revenue per user (ARPU) is ${formatCurrency(arpu)}. 
  The business is experiencing a ${data.growthRate}% growth rate with a ${
    data.churnRate
  }% churn rate.`;
}

function generateRevenueAnalysis(data: SubscriptionData): string {
  const annualRevenue = data.mrr * 12;
  const revenuePerSegment = data.segments.map(
    segment => `${segment.name}: ${formatCurrency(segment.mrr)}`
  ).join('\n');

  return `Annual recurring revenue (ARR): ${formatCurrency(annualRevenue)}
  
Revenue by segment:
${revenuePerSegment}

Growth trajectory indicates a ${data.growthRate}% increase in revenue.`;
}

function generateCustomerMetrics(data: SubscriptionData): string {
  const arpu = data.subscribers > 0 ? data.mrr / data.subscribers : 0;
  
  return `Customer Base:
- Total Subscribers: ${data.subscribers}
- Average Revenue Per User: ${formatCurrency(arpu)}
- Churn Rate: ${data.churnRate}%
- Monthly Growth Rate: ${data.growthRate}%

Customer Acquisition:
- Average CAC: ${formatCurrency(data.cac.average)}
- SMB CAC: ${formatCurrency(data.cac.smb)}
- Mid-Market CAC: ${formatCurrency(data.cac.midMarket)}
- Enterprise CAC: ${formatCurrency(data.cac.enterprise)}`;
}

function generateSegmentAnalysis(data: SubscriptionData): string {
  return data.segments.map(segment => `
${segment.name} Segment:
- Subscribers: ${segment.subscribers}
- MRR: ${formatCurrency(segment.mrr)}
- Churn Rate: ${segment.churnRate}%
- Growth Rate: ${segment.growthRate}%`
  ).join('\n\n');
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
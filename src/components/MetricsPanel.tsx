import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { MetricsResult } from '../utils/metrics';
import { formatCurrency, formatNumber } from '../utils/forecasting';

interface MetricsPanelProps {
  metrics: MetricsResult;
  insights: string[];
}

export default function MetricsPanel({ metrics, insights }: MetricsPanelProps) {
  const { overall, segments } = metrics;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Customer Acquisition Cost"
            value={formatCurrency(overall.cac)}
            trend={overall.cac > 1000 ? 'down' : 'up'}
          />
          <MetricCard
            title="Customer Lifetime Value"
            value={formatCurrency(overall.cltv)}
            trend={overall.ltv_cac_ratio > 3 ? 'up' : 'down'}
          />
          <MetricCard
            title="Payback Period"
            value={`${formatNumber(overall.paybackPeriod)} months`}
            trend={overall.paybackPeriod < 12 ? 'up' : 'down'}
          />
          <MetricCard
            title="LTV:CAC Ratio"
            value={`${overall.ltv_cac_ratio.toFixed(1)}x`}
            trend={overall.ltv_cac_ratio > 3 ? 'up' : 'down'}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Segment Analysis</h2>
        <div className="space-y-4">
          {Object.entries(segments).map(([segment, metrics]) => (
            <div key={segment} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">{segment}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">CAC</p>
                  <p className="text-lg font-semibold">{formatCurrency(metrics.cac)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CLTV</p>
                  <p className="text-lg font-semibold">{formatCurrency(metrics.cltv)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payback Period</p>
                  <p className="text-lg font-semibold">{formatNumber(metrics.paybackPeriod)} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">LTV:CAC Ratio</p>
                  <p className="text-lg font-semibold">{metrics.ltv_cac_ratio.toFixed(1)}x</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {insights.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Insights & Recommendations</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
}

function MetricCard({ title, value, trend }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
      </div>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
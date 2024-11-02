import React from 'react';
import { CustomerSegment } from '../types';
import { formatCurrency, formatPercent } from '../utils/forecasting';

interface ChurnMetricsPanelProps {
  segments: CustomerSegment[];
  selectedSegment: string;
  timeframe: string;
}

export default function ChurnMetricsPanel({
  segments,
  selectedSegment,
  timeframe
}: ChurnMetricsPanelProps) {
  const filteredSegments = selectedSegment === 'all'
    ? segments
    : segments.filter(s => s.name === selectedSegment);

  return (
    <div className="space-y-6">
      {filteredSegments.map(segment => (
        <div key={segment.name} className="space-y-4">
          <h3 className="font-medium text-gray-900">{segment.name} Segment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Revenue Churn</p>
              <p className="text-lg font-semibold">
                {formatCurrency(segment.mrr * (segment.churnRate / 100))} / month
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Churn Rate</p>
              <p className="text-lg font-semibold">
                {formatPercent(segment.churnRate)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">MRR</p>
              <p className="text-lg font-semibold">
                {formatCurrency(segment.mrr)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Growth Rate</p>
              <p className="text-lg font-semibold">
                {formatPercent(segment.growthRate)}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Insights</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {segment.churnRate > 5 && (
                <li>• High churn rate indicates retention issues in {segment.name} segment</li>
              )}
              {segment.growthRate < segment.churnRate && (
                <li>• Growth rate is lower than churn rate, suggesting negative net revenue retention</li>
              )}
              {segment.mrr / segments.reduce((sum, s) => sum + s.mrr, 0) > 0.4 && (
                <li>• High revenue concentration in {segment.name} segment</li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
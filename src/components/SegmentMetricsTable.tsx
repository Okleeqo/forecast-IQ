import React from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { CACMetrics } from '../utils/cacAnalysis';
import { formatCurrency } from '../utils/forecasting';

interface SegmentMetricsTableProps {
  metrics: CACMetrics;
  thresholdRatio: number;
}

export default function SegmentMetricsTable({ metrics, thresholdRatio }: SegmentMetricsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Segment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CLTV
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CAC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CLTV/CAC Ratio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payback Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(metrics.segments).map(([segment, data]) => (
            <tr key={segment}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {segment}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(data.cltv)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(data.cac)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  {data.cltvCacRatio.toFixed(2)}x
                  {data.cltvCacRatio >= thresholdRatio ? (
                    <TrendingUp className="w-4 h-4 ml-2 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 ml-2 text-red-500" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {data.paybackPeriod.toFixed(1)} months
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {data.cltvCacRatio >= thresholdRatio ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Efficient
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Needs Improvement
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
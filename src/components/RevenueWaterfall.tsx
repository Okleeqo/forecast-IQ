import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Filter } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useClientStore } from '../stores/clientStore';
import { calculateRevenueBreakdown } from '../utils/revenueAnalysis';
import WaterfallChart from './WaterfallChart';
import { formatCurrency, formatPercent } from '../utils/formatting';
import { SegmentType } from '../types';

export default function RevenueWaterfall() {
  const [selectedSegment, setSelectedSegment] = useState<SegmentType | 'all'>('all');
  const [timeframe, setTimeframe] = useState<'3m' | '6m' | '12m'>('6m');
  const { selectedClientId } = useClientStore();
  const latestData = useSubscriptionStore((state) => 
    state.getLatestData(selectedClientId || '')
  );

  if (!selectedClientId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please select a client to view revenue breakdown</p>
      </div>
    );
  }

  if (!latestData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please add subscription data to view revenue breakdown</p>
      </div>
    );
  }

  const months = timeframe === '3m' ? 3 : timeframe === '6m' ? 6 : 12;
  const breakdown = calculateRevenueBreakdown(latestData, selectedSegment, months);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Revenue Breakdown</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze MRR changes by source and segment
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value as SegmentType | 'all')}
            className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Segments</option>
            <option value="SMB">SMB</option>
            <option value="Mid-Market">Mid-Market</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '3m' | '6m' | '12m')}
            className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="12m">Last 12 months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">New MRR</h3>
            <BarChart3 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(breakdown.summary.newMrr)}
          </p>
          <p className="mt-2 text-sm text-green-600">
            +{formatPercent(breakdown.summary.newMrr / latestData.mrr * 100)} of total MRR
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Expansion MRR</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(breakdown.summary.expansionMrr)}
          </p>
          <p className="mt-2 text-sm text-blue-600">
            +{formatPercent(breakdown.summary.expansionMrr / latestData.mrr * 100)} of total MRR
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Contraction MRR</h3>
            <BarChart3 className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(breakdown.summary.contractionMrr)}
          </p>
          <p className="mt-2 text-sm text-orange-600">
            -{formatPercent(breakdown.summary.contractionMrr / latestData.mrr * 100)} of total MRR
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Churned MRR</h3>
            <BarChart3 className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(breakdown.summary.churnedMrr)}
          </p>
          <p className="mt-2 text-sm text-red-600">
            -{formatPercent(breakdown.summary.churnedMrr / latestData.mrr * 100)} of total MRR
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">MRR Waterfall</h2>
        <WaterfallChart data={breakdown.monthlyData} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Segment Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expansion MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contraction MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Churned MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net MRR
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {breakdown.segmentData.map((segment) => (
                <tr key={segment.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {segment.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(segment.newMrr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(segment.expansionMrr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(segment.contractionMrr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(segment.churnedMrr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(segment.netMrr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
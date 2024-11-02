import React, { useState, useMemo } from 'react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useClientStore } from '../stores/clientStore';
import { calculateCohortMetrics } from '../utils/cohortAnalysis';
import { formatCurrency, formatPercent } from '../utils/formatting';
import { Select } from './ui/Select';
import CohortRetentionHeatmap from './CohortRetentionHeatmap';
import { RetentionData } from '../types/cohort';

export default function CohortAnalysis() {
  const [timeframe, setTimeframe] = useState('3');
  const { selectedClientId } = useClientStore();
  const subscriptionData = useSubscriptionStore((state) => 
    state.data[selectedClientId || ''] || []
  );

  const cohortData = useMemo(() => {
    if (!subscriptionData.length) return [];
    return calculateCohortMetrics(subscriptionData);
  }, [subscriptionData]);

  const retentionData: RetentionData[] = useMemo(() => {
    if (!cohortData.length) return [];
    
    return cohortData.map(cohort => ({
      cohort: cohort.cohortDate,
      size: cohort.size,
      retentionByMonth: [100, cohort.retentionRate]
    }));
  }, [cohortData]);

  const timeframeOptions = [
    { value: '3', label: 'Last 3 months' },
    { value: '6', label: 'Last 6 months' },
    { value: '12', label: 'Last 12 months' }
  ];

  if (!selectedClientId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please select a client to view cohort analysis</p>
      </div>
    );
  }

  if (!subscriptionData.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please add subscription data to view cohort analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Cohort Analysis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze user behavior and retention patterns across different cohorts
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Cohort Performance</h2>
              <p className="text-sm text-gray-500">Track retention and revenue metrics by cohort</p>
            </div>
            <div className="flex space-x-2">
              <Select
                value={timeframe}
                onChange={(value) => setTimeframe(value)}
                options={timeframeOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Average Retention Rate</h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {formatPercent(
                  cohortData.reduce((sum, c) => sum + c.retentionRate, 0) / cohortData.length
                )}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {cohortData.reduce((sum, c) => sum + c.size, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Average Revenue</h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  cohortData.reduce((sum, c) => sum + c.averageRevenue, 0) / cohortData.length
                )}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {formatCurrency(cohortData.reduce((sum, c) => sum + c.totalRevenue, 0))}
              </p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Retention Heatmap</h3>
              <CohortRetentionHeatmap data={retentionData} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cohort
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retention Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cohortData.slice(0, parseInt(timeframe)).map((cohort, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cohort.cohortDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cohort.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cohort.activeCustomers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercent(cohort.retentionRate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(cohort.averageRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
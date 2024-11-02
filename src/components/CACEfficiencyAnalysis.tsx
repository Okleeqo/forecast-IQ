import React, { useState, useEffect } from 'react';
import { AlertCircle, Settings, TrendingUp, DollarSign } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useClientStore } from '../stores/clientStore';
import { calculateCACMetrics } from '../utils/cacAnalysis';
import CACEfficiencyChart from './CACEfficiencyChart';
import SegmentMetricsTable from './SegmentMetricsTable';
import { formatCurrency } from '../utils/formatting';

export default function CACEfficiencyAnalysis() {
  const [thresholdRatio, setThresholdRatio] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const { selectedClientId } = useClientStore();
  const latestData = useSubscriptionStore((state) => 
    state.getLatestData(selectedClientId || '')
  );

  const metrics = calculateCACMetrics(latestData, thresholdRatio);

  if (!selectedClientId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please select a client to view CAC analysis</p>
      </div>
    );
  }

  if (!latestData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please add subscription data to view CAC analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">CAC Efficiency Analysis</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze customer acquisition costs and lifetime value across segments
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Analysis Settings</h3>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="threshold" className="block text-sm text-gray-600">
                CLTV/CAC Threshold Ratio
              </label>
              <input
                type="number"
                id="threshold"
                value={thresholdRatio}
                onChange={(e) => setThresholdRatio(Number(e.target.value))}
                className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                min="1"
                step="0.1"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Average CLTV/CAC Ratio</h3>
            <TrendingUp className={`w-5 h-5 ${
              metrics.overall.cltvCacRatio >= thresholdRatio 
                ? 'text-green-500' 
                : 'text-red-500'
            }`} />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {metrics.overall.cltvCacRatio.toFixed(2)}x
          </p>
          {metrics.overall.cltvCacRatio < thresholdRatio && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Below target ratio of {thresholdRatio}x
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Average CLTV</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(metrics.overall.cltv)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Per customer lifetime
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Average CAC</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(metrics.overall.cac)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Per customer acquisition
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Segment Analysis</h2>
        <CACEfficiencyChart metrics={metrics} thresholdRatio={thresholdRatio} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Detailed Metrics</h2>
        <SegmentMetricsTable metrics={metrics} thresholdRatio={thresholdRatio} />
      </div>

      {metrics.insights.length > 0 && (
        <div className="bg-blue-50 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-blue-900 mb-4">Insights & Recommendations</h2>
          <ul className="space-y-3">
            {metrics.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-400">
                  <AlertCircle className="h-5 w-5" />
                </span>
                <span className="ml-3 text-blue-800">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
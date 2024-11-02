import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useClientStore } from '../stores/clientStore';
import { calculateChurnImpact, formatCurrency, formatPercent } from '../utils/forecasting';
import { AlertCircle, TrendingDown, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChurnAnalysis() {
  const { selectedClientId } = useClientStore();
  const latestData = useSubscriptionStore((state) => 
    state.getLatestData(selectedClientId || '')
  );
  const [customChurnRate, setCustomChurnRate] = useState(5);
  const [months, setMonths] = useState(12);
  const [churnImpact, setChurnImpact] = useState<any>(null);

  useEffect(() => {
    if (latestData) {
      const impact = calculateChurnImpact(
        latestData.mrr,
        latestData.growthRate,
        latestData.churnRate,
        customChurnRate,
        months,
        latestData.seasonalChurn
      );
      setChurnImpact(impact);
    }
  }, [latestData, customChurnRate, months]);

  if (!selectedClientId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please select a client to view churn analysis</p>
      </div>
    );
  }

  if (!latestData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please add subscription data to view churn analysis</p>
      </div>
    );
  }

  const chartData = {
    labels: Array.from({ length: months }, (_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Current Churn Rate',
        data: churnImpact?.baseline || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Simulated Churn Rate',
        data: churnImpact?.impacted || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Churn Impact Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Churn Analysis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze the impact of different churn rates on your revenue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Current Churn Rate</h3>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatPercent(latestData.churnRate)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Monthly Revenue Loss</h3>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(latestData.mrr * (latestData.churnRate / 100))}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Churned Customers</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {Math.round(latestData.subscribers * (latestData.churnRate / 100)).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Churn Impact Simulation</h2>
          <div className="flex items-center gap-4 mb-6">
            <div>
              <label htmlFor="churnRate" className="block text-sm font-medium text-gray-700 mb-1">
                Simulate Churn Rate
              </label>
              <input
                type="range"
                id="churnRate"
                min="0"
                max="20"
                step="0.1"
                value={customChurnRate}
                onChange={(e) => setCustomChurnRate(Number(e.target.value))}
                className="w-48"
              />
              <span className="ml-2">{formatPercent(customChurnRate)}</span>
            </div>
            <div>
              <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-1">
                Projection Period
              </label>
              <select
                id="months"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
              </select>
            </div>
          </div>
        </div>
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {churnImpact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Impact</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Projected Revenue Loss</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(churnImpact.baseline[months - 1] - churnImpact.impacted[months - 1])}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue Difference</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(
                    (churnImpact.baseline[months - 1] - churnImpact.impacted[months - 1]) / months
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Impact</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Additional Churned Customers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(
                    latestData.subscribers * ((customChurnRate - latestData.churnRate) / 100)
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Churn Rate Difference</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatPercent(customChurnRate - latestData.churnRate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
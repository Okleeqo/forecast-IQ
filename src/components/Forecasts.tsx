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
import { calculateRevenueProjection, formatCurrency, formatNumber } from '../utils/forecasting';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Forecasts() {
  const [months, setMonths] = useState(12);
  const [optimisticGrowth, setOptimisticGrowth] = useState(0);
  const [pessimisticGrowth, setPessimisticGrowth] = useState(0);
  const { selectedClientId } = useClientStore();
  const latestData = useSubscriptionStore((state) => state.getLatestData(selectedClientId || ''));
  const [projections, setProjections] = useState<{
    baseline: number[];
    optimistic: number[];
    pessimistic: number[];
  }>({
    baseline: [],
    optimistic: [],
    pessimistic: []
  });

  useEffect(() => {
    if (latestData) {
      const { mrr, growthRate, churnRate } = latestData;
      const baselineProjections = calculateRevenueProjection(mrr, growthRate, churnRate, months);
      const optimisticProjections = calculateRevenueProjection(
        mrr, 
        growthRate * 1.2, // 20% more optimistic growth
        churnRate,
        months
      );
      const pessimisticProjections = calculateRevenueProjection(
        mrr,
        growthRate * 0.8, // 20% less growth for pessimistic scenario
        churnRate,
        months
      );

      setProjections({
        baseline: baselineProjections,
        optimistic: optimisticProjections,
        pessimistic: pessimisticProjections
      });
      setOptimisticGrowth(growthRate * 1.2);
      setPessimisticGrowth(growthRate * 0.8);
    }
  }, [latestData, months]);

  if (!selectedClientId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please select a client to view forecasts</p>
      </div>
    );
  }

  if (!latestData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please add subscription data to view forecasts</p>
      </div>
    );
  }

  const annualRecurringRevenue = latestData.mrr * 12;

  const chartData = {
    labels: Array.from({ length: months }, (_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Baseline Projection',
        data: projections.baseline,
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Optimistic Projection',
        data: projections.optimistic,
        borderColor: 'rgb(34, 197, 94)', // Green
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Pessimistic Projection',
        data: projections.pessimistic,
        borderColor: 'rgb(239, 68, 68)', // Red
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      }
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
        text: 'Revenue Projections',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
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
        <h1 className="text-2xl font-semibold text-gray-900">Revenue Forecasts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Project your revenue growth with baseline, optimistic, and pessimistic scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current MRR</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(latestData.mrr)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current ARR</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(annualRecurringRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(latestData.growthRate)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Growth Projections</h2>
              <p className="text-sm text-gray-500">
                Comparing baseline, optimistic (+20%), and pessimistic (-20%) scenarios
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="months" className="text-sm text-gray-600">
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

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Projected Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Baseline Projection ({months} months)</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(projections.baseline[projections.baseline.length - 1] || 0)}
            </p>
            <p className="text-sm text-gray-500">Growth Rate: {formatNumber(latestData.growthRate)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Optimistic Projection ({months} months)</p>
            <p className="text-xl font-semibold text-green-600">
              {formatCurrency(projections.optimistic[projections.optimistic.length - 1] || 0)}
            </p>
            <p className="text-sm text-gray-500">Growth Rate: {formatNumber(optimisticGrowth)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Pessimistic Projection ({months} months)</p>
            <p className="text-xl font-semibold text-red-600">
              {formatCurrency(projections.pessimistic[projections.pessimistic.length - 1] || 0)}
            </p>
            <p className="text-sm text-gray-500">Growth Rate: {formatNumber(pessimisticGrowth)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
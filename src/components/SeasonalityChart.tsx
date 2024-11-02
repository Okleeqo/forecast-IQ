import React from 'react';
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
import { Line } from 'react-chartjs-2';
import { SeasonalChurn } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SeasonalityChartProps {
  baseChurnRate: number;
  seasonalAdjustments: SeasonalChurn[];
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function SeasonalityChart({ baseChurnRate, seasonalAdjustments }: SeasonalityChartProps) {
  const adjustedRates = seasonalAdjustments.map(adj => 
    baseChurnRate * (1 + adj.adjustment / 100)
  );

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Adjusted Churn Rate',
        data: adjustedRates,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Base Churn Rate',
        data: Array(12).fill(baseChurnRate),
        borderColor: 'rgb(75, 85, 99)',
        backgroundColor: 'rgba(75, 85, 99, 0.5)',
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Seasonal Churn Rate Variations',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Churn Rate (%)'
        },
        ticks: {
          callback: function(value: number) {
            return value.toFixed(1) + '%';
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line data={data} options={options} />
    </div>
  );
}
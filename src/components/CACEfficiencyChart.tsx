import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CACMetrics } from '../utils/cacAnalysis';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CACEfficiencyChartProps {
  metrics: CACMetrics;
  thresholdRatio: number;
}

export default function CACEfficiencyChart({ metrics, thresholdRatio }: CACEfficiencyChartProps) {
  const segments = Object.keys(metrics.segments);
  
  const data = {
    labels: segments,
    datasets: [
      {
        label: 'CLTV',
        data: segments.map(segment => metrics.segments[segment].cltv),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'CAC',
        data: segments.map(segment => metrics.segments[segment].cac),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div>
      <Bar data={data} options={options} height={300} />
      <div className="mt-4 flex justify-center">
        <div className="bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-600">
          Target CLTV/CAC Ratio: {thresholdRatio}x
        </div>
      </div>
    </div>
  );
}
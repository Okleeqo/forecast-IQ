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
import { CustomerSegment, SeasonalChurn, SegmentType } from '../types';
import { calculateChurnImpact } from '../utils/forecasting';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SegmentedChurnChartProps {
  data: CustomerSegment[];
  selectedSegment: SegmentType | 'all';
  months: number;
  seasonalChurn: SeasonalChurn[];
}

const SEGMENT_COLORS = {
  'SMB': {
    border: 'rgb(59, 130, 246)',
    background: 'rgba(59, 130, 246, 0.1)'
  },
  'Mid-Market': {
    border: 'rgb(16, 185, 129)',
    background: 'rgba(16, 185, 129, 0.1)'
  },
  'Enterprise': {
    border: 'rgb(245, 158, 11)',
    background: 'rgba(245, 158, 11, 0.1)'
  }
};

export default function SegmentedChurnChart({
  data,
  selectedSegment,
  months,
  seasonalChurn
}: SegmentedChurnChartProps) {
  const chartData = {
    labels: Array.from({ length: months }, (_, i) => `Month ${i + 1}`),
    datasets: data
      .filter(segment => selectedSegment === 'all' || segment.name === selectedSegment)
      .map(segment => {
        const impact = calculateChurnImpact(
          segment.mrr,
          segment.growthRate,
          segment.churnRate,
          segment.churnRate,
          months,
          seasonalChurn
        );

        return {
          label: `${segment.name} Revenue`,
          data: impact.baseline,
          borderColor: SEGMENT_COLORS[segment.name].border,
          backgroundColor: SEGMENT_COLORS[segment.name].background,
          tension: 0.4
        };
      })
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
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
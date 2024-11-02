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
import { ScenarioProjection } from '../types/scenario';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScenarioChartProps {
  projections: Record<string, ScenarioProjection>;
  selectedScenarioId: string | null;
}

const COLORS = {
  optimistic: {
    border: 'rgb(16, 185, 129)',
    background: 'rgba(16, 185, 129, 0.1)'
  },
  pessimistic: {
    border: 'rgb(239, 68, 68)',
    background: 'rgba(239, 68, 68, 0.1)'
  },
  baseline: {
    border: 'rgb(59, 130, 246)',
    background: 'rgba(59, 130, 246, 0.1)'
  }
};

export default function ScenarioChart({
  projections,
  selectedScenarioId
}: ScenarioChartProps) {
  const data = {
    labels: Object.values(projections)[0]?.months || [],
    datasets: Object.entries(projections).map(([id, projection], index) => ({
      label: `Scenario ${index + 1}`,
      data: projection.mrr,
      borderColor: Object.values(COLORS)[index % Object.keys(COLORS).length].border,
      backgroundColor: Object.values(COLORS)[index % Object.keys(COLORS).length].background,
      borderWidth: id === selectedScenarioId ? 3 : 1,
      tension: 0.4
    }))
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
        title: {
          display: true,
          text: 'Monthly Recurring Revenue ($)'
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}
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
import { MonthlyRevenueData } from '../types/revenue';
import { formatCurrency } from '../utils/forecasting';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WaterfallChartProps {
  data: MonthlyRevenueData[];
}

export default function WaterfallChart({ data }: WaterfallChartProps) {
  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'New MRR',
        data: data.map(d => d.newMrr),
        backgroundColor: 'rgb(34, 197, 94)',
        stack: 'stack0',
      },
      {
        label: 'Expansion MRR',
        data: data.map(d => d.expansionMrr),
        backgroundColor: 'rgb(59, 130, 246)',
        stack: 'stack0',
      },
      {
        label: 'Contraction MRR',
        data: data.map(d => -d.contractionMrr),
        backgroundColor: 'rgb(249, 115, 22)',
        stack: 'stack0',
      },
      {
        label: 'Churned MRR',
        data: data.map(d => -d.churnedMrr),
        backgroundColor: 'rgb(239, 68, 68)',
        stack: 'stack0',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            const value = Math.abs(context.parsed.y);
            label += formatCurrency(value);
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Monthly Recurring Revenue ($)',
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(Math.abs(value));
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
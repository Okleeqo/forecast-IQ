import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: Array<{
    month: number;
    baseline?: number;
    impacted: number;
  }>;
  showBaseline?: boolean;
  height?: number;
  tooltipFormatter?: (value: number) => string;
}

export default function RevenueChart({
  data,
  showBaseline = false,
  height = 400,
  tooltipFormatter = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value),
}: RevenueChartProps) {
  const chartData: ChartData<'line'> = {
    labels: data.map((d) => `Month ${d.month}`),
    datasets: [
      {
        label: 'Projected Revenue',
        data: data.map((d) => d.impacted),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
      ...(showBaseline && data[0].baseline
        ? [
            {
              label: 'Baseline',
              data: data.map((d) => d.baseline!),
              borderColor: '#9CA3AF',
              backgroundColor: 'rgba(156, 163, 175, 0.1)',
              borderDash: [5, 5],
              tension: 0.4,
            },
          ]
        : []),
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += tooltipFormatter(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
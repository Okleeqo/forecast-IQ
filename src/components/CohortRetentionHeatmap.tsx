import React from 'react';
import { RetentionData } from '../types/cohort';

interface CohortRetentionHeatmapProps {
  data: RetentionData[];
}

export default function CohortRetentionHeatmap({ data }: CohortRetentionHeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No cohort data available</p>
      </div>
    );
  }

  const maxMonths = Math.max(...data.map(d => (d.retentionByMonth || []).length));
  
  const getColorForValue = (value: number): string => {
    const hue = 215; // Blue hue
    const saturation = 90;
    const lightness = 100 - (value * 0.7); // Higher retention = darker color
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cohort
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            {Array.from({ length: maxMonths }, (_, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                M{i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((cohort, i) => (
            <tr key={i}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {cohort.cohort}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {cohort.size}
              </td>
              {(cohort.retentionByMonth || []).map((value, j) => (
                <td
                  key={j}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  style={{ backgroundColor: getColorForValue(value) }}
                >
                  {value.toFixed(1)}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
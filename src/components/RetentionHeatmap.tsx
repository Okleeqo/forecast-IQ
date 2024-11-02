import React from 'react';
import { CustomerSegment } from '../types';

interface RetentionHeatmapProps {
  segments: CustomerSegment[];
  months: number;
  selectedSegment: string;
}

export default function RetentionHeatmap({
  segments,
  months,
  selectedSegment
}: RetentionHeatmapProps) {
  const filteredSegments = selectedSegment === 'all'
    ? segments
    : segments.filter(s => s.name === selectedSegment);

  const getRetentionColor = (retention: number) => {
    const hue = 215; // Blue hue
    const saturation = 90;
    const lightness = 100 - (retention * 0.7); // Higher retention = darker color
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const calculateRetention = (segment: CustomerSegment, month: number) => {
    const monthlyChurnRate = segment.churnRate / 100;
    return Math.pow(1 - monthlyChurnRate, month) * 100;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Segment
            </th>
            {Array.from({ length: months }, (_, i) => (
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
          {filteredSegments.map((segment) => (
            <tr key={segment.name}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {segment.name}
              </td>
              {Array.from({ length: months }, (_, month) => {
                const retention = calculateRetention(segment, month + 1);
                return (
                  <td
                    key={month}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    style={{ backgroundColor: getRetentionColor(retention / 100) }}
                  >
                    {retention.toFixed(1)}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React from 'react';
import { Info } from 'lucide-react';
import { SeasonalChurn } from '../types';

interface DynamicRateInputProps {
  seasonalChurn: SeasonalChurn[];
  onChange: (adjustments: SeasonalChurn[]) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DynamicRateInput({ seasonalChurn, onChange }: DynamicRateInputProps) {
  const handleAdjustmentChange = (month: number, adjustment: number) => {
    const updatedAdjustments = seasonalChurn.map(item =>
      item.month === month ? { ...item, adjustment } : item
    );
    onChange(updatedAdjustments);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Adjust the percentage to modify the base churn rate for each month.
              Positive values increase churn, negative values decrease it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MONTHS.map((month, index) => (
          <div key={month} className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {month}
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={seasonalChurn[index].adjustment}
                onChange={(e) => handleAdjustmentChange(index + 1, Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                step="0.1"
                min="-100"
                max="100"
              />
              <span className="ml-2 text-gray-500">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
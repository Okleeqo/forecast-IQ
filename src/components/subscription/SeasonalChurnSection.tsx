import React from 'react';
import { SectionHeader } from './SectionHeader';

interface SeasonalChurnSectionProps {
  seasonalChurn: Record<string, number>;
  onChange: (month: string, value: number) => void;
  onReset: () => void;
}

export function SeasonalChurnSection({ 
  seasonalChurn, 
  onChange, 
  onReset 
}: SeasonalChurnSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Seasonal Churn Adjustments" 
        onReset={onReset}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(seasonalChurn).map(([month, value]) => (
          <div key={month}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {month} (%)
            </label>
            <input
              type="number"
              value={value || 0}
              onChange={(e) => onChange(month, parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              step="0.1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
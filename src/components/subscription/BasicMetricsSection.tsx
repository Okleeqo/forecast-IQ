import React from 'react';
import { RotateCcw } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface BasicMetricsProps {
  mrr: number;
  subscribers: number;
  churnRate: number;
  growthRate: number;
  onChange: (name: string, value: number) => void;
  onReset: () => void;
}

export function BasicMetricsSection({
  mrr,
  subscribers,
  churnRate,
  growthRate,
  onChange,
  onReset
}: BasicMetricsProps) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Basic Metrics" 
        onReset={onReset}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Recurring Revenue ($)
          </label>
          <input
            type="number"
            name="mrr"
            value={mrr || 0}
            onChange={(e) => onChange('mrr', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Subscribers
          </label>
          <input
            type="number"
            name="subscribers"
            value={subscribers || 0}
            onChange={(e) => onChange('subscribers', parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Churn Rate (%)
          </label>
          <input
            type="number"
            name="churnRate"
            value={churnRate || 0}
            onChange={(e) => onChange('churnRate', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Growth Rate (%)
          </label>
          <input
            type="number"
            name="growthRate"
            value={growthRate || 0}
            onChange={(e) => onChange('growthRate', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}
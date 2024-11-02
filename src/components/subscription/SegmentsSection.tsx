import React from 'react';
import { CustomerSegment } from '../../types';
import { SectionHeader } from './SectionHeader';

interface SegmentsSectionProps {
  segments: CustomerSegment[];
  onChange: (segmentName: string, field: string, value: number) => void;
  onReset: () => void;
}

export function SegmentsSection({ segments, onChange, onReset }: SegmentsSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Segment Analysis" 
        onReset={onReset}
      />
      
      {segments.map((segment) => (
        <div key={segment.name} className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">{segment.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscribers
              </label>
              <input
                type="number"
                value={segment.subscribers || 0}
                onChange={(e) => onChange(segment.name, 'subscribers', parseInt(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MRR ($)
              </label>
              <input
                type="number"
                value={segment.mrr || 0}
                onChange={(e) => onChange(segment.name, 'mrr', parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Churn Rate (%)
              </label>
              <input
                type="number"
                value={segment.churnRate || 0}
                onChange={(e) => onChange(segment.name, 'churnRate', parseFloat(e.target.value) || 0)}
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
                value={segment.growthRate || 0}
                onChange={(e) => onChange(segment.name, 'growthRate', parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
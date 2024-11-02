import React from 'react';
import { SectionHeader } from './SectionHeader';

interface CACData {
  smb: number;
  midMarket: number;
  enterprise: number;
  average: number;
}

interface CACSectionProps {
  cac: CACData;
  onChange: (field: string, value: number) => void;
  onReset: () => void;
}

export function CACSection({ cac, onChange, onReset }: CACSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Customer Acquisition Costs" 
        onReset={onReset}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMB CAC ($)
          </label>
          <input
            type="number"
            value={cac.smb || 0}
            onChange={(e) => onChange('smb', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mid-Market CAC ($)
          </label>
          <input
            type="number"
            value={cac.midMarket || 0}
            onChange={(e) => onChange('midMarket', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enterprise CAC ($)
          </label>
          <input
            type="number"
            value={cac.enterprise || 0}
            onChange={(e) => onChange('enterprise', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Average CAC ($)
          </label>
          <input
            type="number"
            value={cac.average || 0}
            onChange={(e) => onChange('average', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { RotateCcw } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  onReset: () => void;
}

export function SectionHeader({ title, onReset }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <button
        type="button"
        onClick={onReset}
        className="flex items-center px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        Reset to Zero
      </button>
    </div>
  );
}
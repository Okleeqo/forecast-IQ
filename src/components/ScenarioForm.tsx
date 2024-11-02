import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useScenarioStore } from '../stores/scenarioStore';
import type { ScenarioInput } from '../types/scenario';

interface ScenarioFormProps {
  onClose: () => void;
}

export default function ScenarioForm({ onClose }: ScenarioFormProps) {
  const addScenario = useScenarioStore((state) => state.addScenario);
  const [formData, setFormData] = useState<Omit<ScenarioInput, 'id'>>({
    name: '',
    churnRate: 0,
    growthRate: 0,
    arpu: 0,
    cacAdjustment: 0,
    seasonalityEnabled: false,
    seasonalAdjustments: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addScenario(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create New Scenario
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scenario Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="e.g., Optimistic Growth"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Growth Rate (%)
              </label>
              <input
                type="number"
                value={formData.growthRate}
                onChange={(e) => setFormData({ ...formData, growthRate: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Churn Rate (%)
              </label>
              <input
                type="number"
                value={formData.churnRate}
                onChange={(e) => setFormData({ ...formData, churnRate: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ARPU ($)
              </label>
              <input
                type="number"
                value={formData.arpu}
                onChange={(e) => setFormData({ ...formData, arpu: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CAC Adjustment (%)
              </label>
              <input
                type="number"
                value={formData.cacAdjustment}
                onChange={(e) => setFormData({ ...formData, cacAdjustment: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                step="0.1"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="seasonality"
                checked={formData.seasonalityEnabled}
                onChange={(e) => setFormData({ ...formData, seasonalityEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="seasonality" className="ml-2 block text-sm text-gray-700">
                Enable Seasonal Adjustments
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Scenario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
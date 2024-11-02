import React, { useState } from 'react';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useScenarioStore } from '../stores/scenarioStore';
import { PricingScenario } from '../types';
import RevenueChart from './RevenueChart';
import { formatCurrency, formatNumber } from '../utils/forecasting';

export default function PricingScenarios() {
  const latestData = useSubscriptionStore((state) => state.getLatestData());
  const { scenarios, addScenario, removeScenario, selectScenario, selectedScenario, getScenarioResults } = useScenarioStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<PricingScenario>>({
    name: '',
    basePrice: 0,
    annualDiscount: 0,
    enterprisePrice: 0,
    expectedConversion: 0,
    expectedChurn: 0,
    growthRate: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newScenario: PricingScenario = {
      ...formData as PricingScenario,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    addScenario(newScenario);
    setShowForm(false);
    setFormData({
      name: '',
      basePrice: 0,
      annualDiscount: 0,
      enterprisePrice: 0,
      expectedConversion: 0,
      expectedChurn: 0,
      growthRate: 0,
    });
  };

  const scenarioResults = selectedScenario ? getScenarioResults(latestData) : null;

  if (!latestData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center text-amber-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Please input subscription data to create pricing scenarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pricing Scenarios</h2>
          <p className="text-gray-600">Compare different pricing strategies</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Scenario
        </button>
      </div>

      {/* Scenario Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price ($)
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Discount (%)
                </label>
                <input
                  type="number"
                  value={formData.annualDiscount}
                  onChange={(e) => setFormData({ ...formData, annualDiscount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enterprise Price ($)
                </label>
                <input
                  type="number"
                  value={formData.enterprisePrice}
                  onChange={(e) => setFormData({ ...formData, enterprisePrice: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Conversion (%)
                </label>
                <input
                  type="number"
                  value={formData.expectedConversion}
                  onChange={(e) => setFormData({ ...formData, expectedConversion: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Churn (%)
                </label>
                <input
                  type="number"
                  value={formData.expectedChurn}
                  onChange={(e) => setFormData({ ...formData, expectedChurn: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                  min="0"
                  max="100"
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
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Scenario
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scenarios List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer border-2 transition-colors ${
              selectedScenario === scenario.id ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => selectScenario(scenario.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
                <p className="text-sm text-gray-500">
                  Base Price: {formatCurrency(scenario.basePrice)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeScenario(scenario.id);
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Annual Discount: {scenario.annualDiscount}%</p>
              <p>Enterprise Price: {formatCurrency(scenario.enterprisePrice)}</p>
              <p>Expected Conversion: {scenario.expectedConversion}%</p>
              <p>Expected Churn: {scenario.expectedChurn}%</p>
              <p>Growth Rate: {scenario.growthRate}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      {scenarioResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Projected MRR</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {formatCurrency(scenarioResults.mrr)}
              </p>
              <p className="text-sm text-green-600 mt-2">
                +{formatCurrency(scenarioResults.revenueIncrease)} increase
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Projected ARR</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {formatCurrency(scenarioResults.arr)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Projected Subscribers</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {formatNumber(scenarioResults.subscribers)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Projection</h3>
            <RevenueChart data={scenarioResults.timeline} showBaseline={true} />
          </div>
        </div>
      )}
    </div>
  );
}
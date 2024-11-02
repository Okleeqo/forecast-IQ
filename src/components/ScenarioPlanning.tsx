import React, { useState } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useClientStore } from '../stores/clientStore';
import { useScenarioStore } from '../stores/scenarioStore';
import ScenarioChart from './ScenarioChart';
import ScenarioForm from './ScenarioForm';
import ScenarioComparisonTable from './ScenarioComparisonTable';
import { formatCurrency } from '../utils/formatting';

export default function ScenarioPlanning() {
  const [showForm, setShowForm] = useState(false);
  const { selectedClientId } = useClientStore();
  const latestData = useSubscriptionStore((state) => 
    state.getLatestData(selectedClientId || '')
  );
  const {
    scenarios,
    selectedScenarioId,
    selectScenario,
    deleteScenario,
    getProjections,
    getComparisons,
  } = useScenarioStore();

  if (!selectedClientId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please select a client to create scenarios</p>
      </div>
    );
  }

  if (!latestData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please add subscription data to create scenarios</p>
      </div>
    );
  }

  const projections = getProjections(latestData.mrr, latestData.subscribers);
  const comparisons = getComparisons(latestData.mrr, latestData.subscribers);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Scenario Planning</h1>
          <p className="mt-1 text-sm text-gray-500">
            Model different growth scenarios and compare outcomes
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Scenario
        </button>
      </div>

      {showForm && <ScenarioForm onClose={() => setShowForm(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Current MRR</h3>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(latestData.mrr)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Current Subscribers</h3>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {latestData.subscribers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Active Scenarios</h3>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {scenarios.length}
          </p>
        </div>
      </div>

      {scenarios.length > 0 && (
        <>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Scenario Comparison</h2>
              <div className="flex space-x-4">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => selectScenario(scenario.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedScenarioId === scenario.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </div>
            
            <ScenarioChart
              projections={projections}
              selectedScenarioId={selectedScenarioId}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Scenario Details</h2>
            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={`p-4 rounded-lg border ${
                    selectedScenarioId === scenario.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{scenario.name}</h3>
                      <div className="mt-1 grid grid-cols-2 gap-x-4 text-sm text-gray-500">
                        <p>Growth Rate: {scenario.growthRate}%</p>
                        <p>Churn Rate: {scenario.churnRate}%</p>
                        <p>ARPU: {formatCurrency(scenario.arpu)}</p>
                        <p>CAC Adjustment: {scenario.cacAdjustment}%</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteScenario(scenario.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Projections Summary</h2>
            <ScenarioComparisonTable
              comparisons={comparisons}
              scenarios={scenarios}
            />
          </div>
        </>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useClientStore } from '../stores/clientStore';
import { SegmentType } from '../types';

interface FormData {
  basicMetrics: {
    mrr: string;
    subscribers: string;
    churnRate: string;
    growthRate: string;
  };
  segments: {
    [key in SegmentType]: {
      subscribers: string;
      mrr: string;
      churnRate: string;
      growthRate: string;
    };
  };
  cac: {
    smb: string;
    midMarket: string;
    enterprise: string;
  };
  seasonalChurn: {
    [key: string]: string;
  };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SEGMENTS: SegmentType[] = ['SMB', 'Mid-Market', 'Enterprise'];

const createInitialFormData = (existingData?: any): FormData => ({
  basicMetrics: {
    mrr: existingData?.mrr?.toString() || '0',
    subscribers: existingData?.subscribers?.toString() || '0',
    churnRate: existingData?.churnRate?.toString() || '0',
    growthRate: existingData?.growthRate?.toString() || '0'
  },
  segments: SEGMENTS.reduce((acc, segment) => {
    const segmentData = existingData?.segments?.find((s: any) => s.name === segment);
    acc[segment] = {
      subscribers: segmentData?.subscribers?.toString() || '0',
      mrr: segmentData?.mrr?.toString() || '0',
      churnRate: segmentData?.churnRate?.toString() || '0',
      growthRate: segmentData?.growthRate?.toString() || '0'
    };
    return acc;
  }, {} as FormData['segments']),
  cac: {
    smb: existingData?.cac?.smb?.toString() || '0',
    midMarket: existingData?.cac?.midMarket?.toString() || '0',
    enterprise: existingData?.cac?.enterprise?.toString() || '0'
  },
  seasonalChurn: MONTHS.reduce((acc, month) => {
    acc[month] = existingData?.seasonalChurn?.[month]?.toString() || '0';
    return acc;
  }, {} as Record<string, string>)
});

export function SubscriptionForm({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('basic');
  const { selectedClientId } = useClientStore();
  const addData = useSubscriptionStore((state) => state.addData);
  const existingData = useSubscriptionStore(
    (state) => selectedClientId ? state.getLatestData(selectedClientId) : null
  );

  const [formData, setFormData] = useState<FormData>(() => 
    createInitialFormData(existingData)
  );

  useEffect(() => {
    if (existingData) {
      setFormData(createInitialFormData(existingData));
    }
  }, [existingData]);

  const handleBasicMetricsChange = (field: keyof FormData['basicMetrics'], value: string) => {
    setFormData(prev => ({
      ...prev,
      basicMetrics: {
        ...prev.basicMetrics,
        [field]: value
      }
    }));
  };

  const handleSegmentChange = (segment: SegmentType, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      segments: {
        ...prev.segments,
        [segment]: {
          ...prev.segments[segment],
          [field]: value
        }
      }
    }));
  };

  const handleCACChange = (field: keyof FormData['cac'], value: string) => {
    setFormData(prev => ({
      ...prev,
      cac: {
        ...prev.cac,
        [field]: value
      }
    }));
  };

  const handleSeasonalChurnChange = (month: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      seasonalChurn: {
        ...prev.seasonalChurn,
        [month]: value
      }
    }));
  };

  const resetSection = (section: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [section]: createInitialFormData()[section]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const numericData = {
      mrr: Number(formData.basicMetrics.mrr),
      subscribers: Number(formData.basicMetrics.subscribers),
      churnRate: Number(formData.basicMetrics.churnRate),
      growthRate: Number(formData.basicMetrics.growthRate),
      segments: SEGMENTS.map(segment => ({
        name: segment,
        subscribers: Number(formData.segments[segment].subscribers),
        mrr: Number(formData.segments[segment].mrr),
        churnRate: Number(formData.segments[segment].churnRate),
        growthRate: Number(formData.segments[segment].growthRate)
      })),
      cac: {
        smb: Number(formData.cac.smb),
        midMarket: Number(formData.cac.midMarket),
        enterprise: Number(formData.cac.enterprise),
        average: 0 // Will be calculated in the store
      },
      seasonalChurn: Object.entries(formData.seasonalChurn).reduce((acc, [month, value]) => ({
        ...acc,
        [month]: Number(value)
      }), {})
    };

    addData(selectedClientId, numericData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Subscription Data</h2>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'basic', label: 'Basic Metrics' },
                  { id: 'segments', label: 'Segments' },
                  { id: 'cac', label: 'CAC' },
                  { id: 'seasonal', label: 'Seasonal Churn' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Recurring Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={formData.basicMetrics.mrr}
                    onChange={(e) => handleBasicMetricsChange('mrr', e.target.value)}
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
                    value={formData.basicMetrics.subscribers}
                    onChange={(e) => handleBasicMetricsChange('subscribers', e.target.value)}
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
                    value={formData.basicMetrics.churnRate}
                    onChange={(e) => handleBasicMetricsChange('churnRate', e.target.value)}
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
                    value={formData.basicMetrics.growthRate}
                    onChange={(e) => handleBasicMetricsChange('growthRate', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    min="0"
                    step="0.1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => resetSection('basicMetrics')}
                  className="col-span-2 text-sm text-red-600 hover:text-red-700"
                >
                  Reset to Zero
                </button>
              </div>
            )}

            {activeTab === 'segments' && (
              <div className="space-y-6">
                {SEGMENTS.map((segment) => (
                  <div key={segment} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{segment}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subscribers
                        </label>
                        <input
                          type="number"
                          value={formData.segments[segment].subscribers}
                          onChange={(e) => handleSegmentChange(segment, 'subscribers', e.target.value)}
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
                          value={formData.segments[segment].mrr}
                          onChange={(e) => handleSegmentChange(segment, 'mrr', e.target.value)}
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
                          value={formData.segments[segment].churnRate}
                          onChange={(e) => handleSegmentChange(segment, 'churnRate', e.target.value)}
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
                          value={formData.segments[segment].growthRate}
                          onChange={(e) => handleSegmentChange(segment, 'growthRate', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => resetSection('segments')}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Reset All Segments to Zero
                </button>
              </div>
            )}

            {activeTab === 'cac' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMB CAC ($)
                    </label>
                    <input
                      type="number"
                      value={formData.cac.smb}
                      onChange={(e) => handleCACChange('smb', e.target.value)}
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
                      value={formData.cac.midMarket}
                      onChange={(e) => handleCACChange('midMarket', e.target.value)}
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
                      value={formData.cac.enterprise}
                      onChange={(e) => handleCACChange('enterprise', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => resetSection('cac')}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Reset CAC Values to Zero
                </button>
              </div>
            )}

            {activeTab === 'seasonal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {MONTHS.map((month) => (
                    <div key={month}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {month} Adjustment (%)
                      </label>
                      <input
                        type="number"
                        value={formData.seasonalChurn[month]}
                        onChange={(e) => handleSeasonalChurnChange(month, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        min="-100"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => resetSection('seasonalChurn')}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Reset Seasonal Adjustments to Zero
                </button>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
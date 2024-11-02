import React, { useState } from 'react';
import { Download, Loader2, AlertCircle, Brain } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useClientStore } from '../stores/clientStore';
import { generateDoc } from '../utils/docGenerator';
import { generateBasicReport, generateAIInsights } from '../services/reportService';
import { Report } from '../types/report';
import { formatCurrency, formatPercent } from '../utils/formatting';

export function Reports() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAIError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [aiInsights, setAIInsights] = useState<Report | null>(null);
  const { selectedClientId } = useClientStore();
  const latestData = useSubscriptionStore((state) => 
    state.getLatestData(selectedClientId || '')
  );

  const generateReport = async () => {
    if (!latestData) {
      setError('No subscription data available. Please add data first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const generatedReport = await generateBasicReport(latestData);
      setReport(generatedReport);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generateAIReport = async () => {
    if (!report) {
      setAIError('Please generate a basic report first.');
      return;
    }

    setAILoading(true);
    setAIError(null);

    try {
      const insights = await generateAIInsights(latestData);
      setAIInsights(insights);
    } catch (err) {
      console.error('Error generating AI insights:', err);
      setAIError('Failed to generate AI insights. Please try again later.');
    } finally {
      setAILoading(false);
    }
  };

  const downloadDoc = () => {
    if (!report) return;
    generateDoc(report);
  };

  if (!selectedClientId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Please select a client to generate reports</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Financial Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate detailed financial reports and AI-driven insights
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {latestData ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Generate Report</h2>
                  <p className="text-sm text-gray-500">Create a comprehensive financial report</p>
                </div>
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Report'
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Monthly Revenue"
                  value={formatCurrency(latestData.mrr)}
                />
                <MetricCard
                  title="Total Subscribers"
                  value={latestData.subscribers.toLocaleString()}
                />
                <MetricCard
                  title="Growth Rate"
                  value={formatPercent(latestData.growthRate)}
                />
                <MetricCard
                  title="Churn Rate"
                  value={formatPercent(latestData.churnRate)}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Please add subscription data before generating a report
              </p>
            </div>
          )}

          {report && (
            <div className="space-y-4 mt-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">{report.title}</h2>
                  <div className="bg-white p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
                    <p className="whitespace-pre-wrap">{report.summary}</p>
                  </div>
                  {report.sections.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                      <div className="whitespace-pre-wrap">{section.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={downloadDoc}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </button>

                <button
                  onClick={generateAIReport}
                  disabled={aiLoading}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating AI Insights...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate AI Insights
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{aiError}</p>
              </div>
            </div>
          )}

          {aiInsights && (
            <div className="mt-8 bg-indigo-50 rounded-lg p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">
                  AI-Generated Strategic Insights
                </h2>
                <div className="bg-white p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                    Executive Analysis
                  </h3>
                  <p className="text-indigo-800 whitespace-pre-wrap">{aiInsights.summary}</p>
                </div>
                {aiInsights.sections.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                      {section.title}
                    </h3>
                    <div className="text-indigo-800 whitespace-pre-wrap">{section.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
}

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
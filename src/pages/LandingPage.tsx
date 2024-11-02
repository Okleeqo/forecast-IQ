import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, LineChart, Target, Zap, BarChart2, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const demoChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Projected Growth',
      data: [30, 45, 57, 75, 90, 100],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      tension: 0.4
    },
    {
      label: 'Actual Growth',
      data: [30, 42, 53, 69, 82, 95],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      tension: 0.4
    }
  ]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      display: false
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900">
      <Navbar isLanding />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Brain className="h-16 w-16 text-indigo-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              AI-Powered SaaS
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text"> Metrics</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your subscription data into actionable insights with predictive analytics
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/auth"
                className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-10">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <LineChart className="h-8 w-8 text-indigo-400" />
                <span className="text-xs text-indigo-300">Real-time</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Revenue Forecasting</h3>
              <p className="text-gray-300">Predict future revenue with AI-powered accuracy</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-cyan-400" />
                <span className="text-xs text-cyan-300">Automated</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Churn Prevention</h3>
              <p className="text-gray-300">Identify at-risk customers before they leave</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <BarChart2 className="h-8 w-8 text-purple-400" />
                <span className="text-xs text-purple-300">Intelligent</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cohort Analysis</h3>
              <p className="text-gray-300">Deep insights into customer behavior patterns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Make data-driven decisions with confidence
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-indigo-500/10 rounded-lg">
                    <Zap className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Predictive Analytics</h3>
                    <p className="text-gray-300">Forecast key metrics with machine learning models</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-cyan-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Growth Insights</h3>
                    <p className="text-gray-300">Understand what drives your business growth</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-purple-500/10 rounded-lg">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">AI Recommendations</h3>
                    <p className="text-gray-300">Get actionable insights powered by AI</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <Line data={demoChartData} options={chartOptions} className="w-full h-64" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your metrics?
          </h2>
          <p className="text-xl text-indigo-200 mb-8">
            Join forward-thinking CFOs and SaaS leaders using ForecastIQ
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            Start Free Trial
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} ForecastIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
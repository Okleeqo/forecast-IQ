import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign,
  BarChart2,
  FileText,
  Users2,
  Target,
  Clock,
  DollarSign as DollarIcon,
  Percent
} from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useClientStore } from '../stores/clientStore';
import { formatCurrency, formatPercent } from '../utils/formatting';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { selectedClientId } = useClientStore();
  const latestData = useSubscriptionStore((state) => 
    selectedClientId ? state.getLatestData(selectedClientId) : null
  );

  const quickActions = [
    {
      name: 'View Revenue Forecast',
      icon: TrendingUp,
      onClick: () => navigate('/dashboard/forecasts')
    },
    {
      name: 'Analyze Churn',
      icon: Users,
      onClick: () => navigate('/dashboard/churn')
    },
    {
      name: 'CAC Analysis',
      icon: DollarSign,
      onClick: () => navigate('/dashboard/cac')
    },
    {
      name: 'Cohort Analysis',
      icon: Users2,
      onClick: () => navigate('/dashboard/cohorts')
    },
    {
      name: 'Revenue Breakdown',
      icon: BarChart2,
      onClick: () => navigate('/dashboard/revenue')
    },
    {
      name: 'Generate Report',
      icon: FileText,
      onClick: () => navigate('/dashboard/reports')
    }
  ];

  if (!selectedClientId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome to ForecastIQ
        </h2>
        <p className="text-gray-600">
          Select a client from the sidebar to get started with subscription analytics.
        </p>
      </div>
    );
  }

  if (!latestData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Data Available
        </h2>
        <p className="text-gray-600 mb-6">
          Add subscription data to see insights and analytics.
        </p>
      </div>
    );
  }

  const annualRecurringRevenue = latestData.mrr * 12;
  const averageRevenuePerUser = latestData.subscribers > 0 
    ? latestData.mrr / latestData.subscribers 
    : 0;
  const customerLifetimeValue = averageRevenuePerUser * (12 / (latestData.churnRate || 1));
  const averageCac = latestData.cac?.average || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>
      
      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current MRR</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(latestData.mrr)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {latestData.subscribers.toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPercent(latestData.growthRate)}
              </p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Churn Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPercent(latestData.churnRate)}
              </p>
            </div>
            <ArrowDownRight className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annual Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(annualRecurringRevenue)}
              </p>
            </div>
            <DollarIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Revenue/User</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(averageRevenuePerUser)}
              </p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer LTV</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(customerLifetimeValue)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg CAC</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(averageCac)}
              </p>
            </div>
            <Percent className="h-8 w-8 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                onClick={action.onClick}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-gray-700">{action.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
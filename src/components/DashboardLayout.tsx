import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LineChart, Users, FileText, Settings as SettingsIcon } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigation = [
    { name: 'Forecasts', to: '/dashboard', icon: LineChart },
    { name: 'Cohort Analysis', to: '/dashboard/cohorts', icon: Users },
    { name: 'Reports', to: '/dashboard/reports', icon: FileText },
    { name: 'Settings', to: '/dashboard/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600">ForecastIQ</h1>
        </div>
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || 
              (item.to === '/dashboard' && location.pathname === '/dashboard/');
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
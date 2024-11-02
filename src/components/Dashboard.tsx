import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import ChurnAnalysis from './ChurnAnalysis';
import Forecasts from './Forecasts';
import CohortAnalysis from './CohortAnalysis';
import CACEfficiencyAnalysis from './CACEfficiencyAnalysis';
import ScenarioPlanning from './ScenarioPlanning';
import RevenueWaterfall from './RevenueWaterfall';
import ClientsManagement from './ClientsManagement';
import { Reports } from './Reports';
import { Settings } from './Settings';

export function Dashboard() {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="clients" element={<ClientsManagement />} />
      <Route path="churn" element={<ChurnAnalysis />} />
      <Route path="forecasts" element={<Forecasts />} />
      <Route path="cohorts" element={<CohortAnalysis />} />
      <Route path="cac" element={<CACEfficiencyAnalysis />} />
      <Route path="revenue" element={<RevenueWaterfall />} />
      <Route path="scenarios" element={<ScenarioPlanning />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}
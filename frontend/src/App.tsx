import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { MaintenanceRequestsPage } from './pages/MaintenanceRequestsPage';
import { TrainMonitorPage } from './pages/TrainMonitorPage';
import { RailwayMapPage } from './pages/RailwayMapPage';
import { BlockPlannerPage } from './pages/BlockPlannerPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { DigitalPnPage } from './pages/DigitalPnPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100 font-sans">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/requests" element={<MaintenanceRequestsPage />} />
              <Route path="/trains" element={<TrainMonitorPage />} />
              <Route path="/map" element={<RailwayMapPage />} />
              <Route path="/planner" element={<BlockPlannerPage />} />
              <Route path="/simulator" element={<WhatIfSimulatorPage />} />
              <Route path="/pn" element={<DigitalPnPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/audit" element={<AuditLogsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;

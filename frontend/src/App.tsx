import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AiChatbot } from './components/AiChatbot';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MaintenanceRequestsPage } from './pages/MaintenanceRequestsPage';
import { TrainMonitorPage } from './pages/TrainMonitorPage';
import { RailwayMapPage } from './pages/RailwayMapPage';
import { BlockPlannerPage } from './pages/BlockPlannerPage';
import { DigitalPnPage } from './pages/DigitalPnPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { DivisionsPage } from './pages/DivisionsPage';
import { ZonesPage } from './pages/ZonesPage';
import { DistancePage } from './pages/DistancePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AppearanceSettingsPage } from './pages/AppearanceSettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AssetManagementPage } from './pages/AssetManagementPage';

const MainLayout: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const isLight = effectiveTheme === 'light';

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className={`flex-1 overflow-y-auto p-6 relative transition-colors duration-200 ${
          isLight ? 'bg-slate-100' : 'bg-slate-950'
        }`}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><MaintenanceRequestsPage /></ProtectedRoute>} />
            <Route path="/trains" element={<ProtectedRoute><TrainMonitorPage /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><RailwayMapPage /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><BlockPlannerPage /></ProtectedRoute>} />
            <Route path="/pn" element={<ProtectedRoute><DigitalPnPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/audit" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
            <Route path="/divisions" element={<ProtectedRoute><DivisionsPage /></ProtectedRoute>} />
            <Route path="/zones" element={<ProtectedRoute><ZonesPage /></ProtectedRoute>} />
            <Route path="/distance" element={<ProtectedRoute><DistancePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/appearance" element={<ProtectedRoute><AppearanceSettingsPage /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute><AssetManagementPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
      <AiChatbot />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

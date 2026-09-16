import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  TrainTrack,
  MapPin,
  Layers,
  KeyRound,
  BarChart3,
  ScrollText,
  Activity,
  ShieldCheck,
  Route,
  Bell,
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Database,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trains', label: 'Train Tracking', icon: TrainTrack },
  { path: '/requests', label: 'Maintenance Requests', icon: Wrench },
  { path: '/assets', label: 'Asset Management', icon: Database },
  { path: '/analytics', label: 'AI Risk Analysis', icon: BarChart3 },
  { path: '/planner', label: 'Block Management', icon: Layers, badge: 'CP-SAT' },
  { path: '/pn', label: 'Digital PN Workflow', icon: KeyRound },
  { path: '/divisions', label: 'Divisions', icon: MapPin },
  { path: '/zones', label: 'Zones', icon: Activity },
  { path: '/distance', label: 'Distance & Route', icon: Route },
  { path: '/notifications', label: 'Alerts & Notifs', icon: Bell },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/audit', label: 'Audit Logs', icon: ScrollText },
  { path: '/profile', label: 'Officer Profile', icon: UserCheck },
  { path: '/appearance', label: 'Appearance Settings', icon: Sliders },
  { path: '/admin', label: 'Admin Governance', icon: ShieldCheck, badge: 'ADMIN' },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen transition-all duration-300 z-20`}>
      {/* Branding Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-sky-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-sky-500/20 flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-base tracking-wider bg-gradient-to-r from-sky-400 to-blue-200 bg-clip-text text-transparent">
                RETRACK
              </h1>
              <p className="text-[10px] text-sky-400/80 font-mono tracking-widest uppercase font-semibold">
                RailSync-AI • SIH 26027
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">
            Operations Console
          </div>
        )}
        {navItems.map((item) => {
          // Hide admin item if user is not SUPER_ADMIN / ADMIN
          if (item.path === '/admin' && user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN') {
            return null;
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-inner'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 rounded border border-sky-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-500">
          <div className="flex items-center space-x-2 text-slate-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-[11px]">NIC Gov Portal Standard</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight font-mono">
            Decision Support System for Indian Railways.
          </p>
        </div>
      )}
    </aside>
  );
};

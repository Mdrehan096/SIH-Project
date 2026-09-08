import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  TrainTrack,
  MapPin,
  Layers,
  SlidersHorizontal,
  KeyRound,
  BarChart3,
  ScrollText,
  Activity,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Main Dashboard', icon: LayoutDashboard },
  { path: '/requests', label: 'Maintenance Requests', icon: Wrench },
  { path: '/trains', label: 'Train Monitor', icon: TrainTrack },
  { path: '/map', label: 'Railway Corridor Map', icon: MapPin },
  { path: '/planner', label: 'AI Block Planner', icon: Layers, badge: 'CP-SAT' },
  { path: '/simulator', label: 'What-If Simulator', icon: SlidersHorizontal },
  { path: '/pn', label: 'Digital PN Workflow', icon: KeyRound },
  { path: '/analytics', label: 'Analytics & KPIs', icon: BarChart3 },
  { path: '/audit', label: 'Audit Logs', icon: ScrollText },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen">
      {/* Branding */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-sky-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-sky-500/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wider bg-gradient-to-r from-sky-400 to-blue-200 bg-clip-text text-transparent">
            RETRACK
          </h1>
          <p className="text-[10px] text-sky-400/80 font-mono tracking-widest uppercase font-semibold">
            RailSync-AI • SIH 26027
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase font-mono">
          Operations Controls
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-inner'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 rounded border border-sky-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-500">
        <div className="flex items-center space-x-2 text-slate-400 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px]">Hackathon Prototype</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Decision Support System for Indian Railways operations.
        </p>
      </div>
    </aside>
  );
};

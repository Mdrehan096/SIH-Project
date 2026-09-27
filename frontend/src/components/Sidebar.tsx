import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  TrainTrack,
  Layers,
  BarChart3,
  ScrollText,
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Database,
  Sliders,
  AlertTriangle,
  Cpu,
  Bot,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  TrainFront,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trains', label: 'Train Operations', icon: TrainTrack },
  { path: '/requests', label: 'Maintenance Requests', icon: Wrench },
  { path: '/assets', label: 'Asset Management', icon: Database },
  { path: '/analytics', label: 'AI Risk Analysis', icon: BarChart3 },
  { path: '/planner', label: 'Block Planning', icon: Layers, badge: 'CP-SAT' },
  { path: '/map', label: 'Conflict Detection', icon: AlertTriangle },
  { path: '/planner', label: 'Optimization', icon: Cpu },
  { path: '/pn', label: 'Controller Review', icon: ShieldCheck },
  { path: '#retrackai', label: 'RETRACKAI', icon: Bot, isAi: true },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/audit', label: 'Audit Logs', icon: ScrollText },
  { path: '/profile', label: 'Officer Profile', icon: UserCheck },
  { path: '/appearance', label: 'Settings', icon: Sliders },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-22' : 'w-64 sm:w-72'
      } bg-white border-r border-slate-200 flex flex-col min-h-screen transition-all duration-300 z-20 shadow-xs flex-shrink-0`}
    >
      {/* Top Branding Section */}
      <div className="h-16 sm:h-20 bg-[#092b4c] text-white flex items-center justify-between px-4 border-b border-[#14385f]">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <TrainFront className="w-5 h-5 text-slate-950" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-black text-base sm:text-lg tracking-wider text-white truncate">RETRACK</h1>
              <p className="text-xs text-slate-200 tracking-tight font-medium truncate">
                AI Block Planning
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-[#061c32] hover:bg-[#1b3d68] text-slate-200 hover:text-white transition-colors cursor-pointer"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              title={collapsed ? item.label : undefined}
              onClick={(e) => {
                if (item.isAi) {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-retrackai'));
                }
              }}
              className={({ isActive }) =>
                `flex items-center ${
                  collapsed ? 'justify-center' : 'justify-between'
                } px-3.5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-150 ${
                  isActive && !item.isAi
                    ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
                    item.isAi ? 'text-blue-600' : 'text-slate-600'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!collapsed && item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold bg-[#ea580c] text-white rounded-md flex-shrink-0 ml-1">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status & Profile */}
      {!collapsed && (
        <div className="border-t border-slate-200 bg-slate-50/70 p-2">
          {/* System Status Indicator */}
          <div className="px-3.5 py-2 flex items-center space-x-2.5 border-b border-slate-200/80">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
            <div>
              <p className="text-xs text-slate-500 font-medium leading-none">System Status</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-700 leading-tight mt-0.5">● Operational</p>
            </div>
          </div>

          {/* User Profile Strip */}
          <div className="px-3 py-2.5 flex items-center justify-between hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors mt-1">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'SE'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name || 'Senior Engineer'}</p>
                <p className="text-xs text-slate-600 truncate">{user?.role || 'Railway Operations'}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

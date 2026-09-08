import React, { useEffect, useState } from 'react';
import { fetchAnalyticsDashboard } from '../services/api';
import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalyticsDashboard().then(setData).catch(() => {});
  }, []);

  const deptData = data?.department_distribution ? [
    { name: 'Civil (P-Way)', value: data.department_distribution.CIVIL, color: '#0284c7' },
    { name: 'Electrical (OHE)', value: data.department_distribution.ELECTRICAL, color: '#f59e0b' },
    { name: 'S&T (Signals)', value: data.department_distribution.SIGNAL_TELECOM, color: '#a855f7' },
  ] : [];

  const riskData = data?.risk_distribution ? [
    { category: 'LOW', count: data.risk_distribution.LOW, fill: '#10b981' },
    { category: 'MEDIUM', count: data.risk_distribution.MEDIUM, fill: '#0284c7' },
    { category: 'HIGH', count: data.risk_distribution.HIGH, fill: '#f59e0b' },
    { category: 'CRITICAL', count: data.risk_distribution.CRITICAL, fill: '#ef4444' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          <span>Operational Analytics & Performance Metrics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical maintenance trends, asset availability index, delay reduction statistics, and department breakdown.
        </p>
      </div>

      {/* KPI Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-500 uppercase font-mono">Asset Availability Index</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {data?.asset_availability_index || 94.8}%
          </div>
          <span className="text-[10px] text-slate-400">+2.4% vs last month</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-500 uppercase font-mono">Train Delays Avoided</span>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            {data?.train_delays_avoided_minutes || 145} mins
          </div>
          <span className="text-[10px] text-slate-400">Current block window</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-500 uppercase font-mono">Tasks Bundled</span>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
            {data?.tasks_bundled_count || 42} Jobs
          </div>
          <span className="text-[10px] text-slate-400">Joint possession windows</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-500 uppercase font-mono">Avg Block Duration</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {data?.avg_block_duration_minutes || 58.5} mins
          </div>
          <span className="text-[10px] text-slate-400">High efficiency target</span>
        </div>
      </div>

      {/* Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-slate-200 text-sm">Department-wise Maintenance Share</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-slate-200 text-sm">Asset Health Risk Score Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

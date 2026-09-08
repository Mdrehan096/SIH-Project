import React from 'react';
import { KpiCard } from '../components/KpiCard';
import {
  TrainTrack,
  Wrench,
  Layers,
  Clock,
  Zap,
  CheckCircle2,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner / System State */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-800/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                SIH 2026 • PS 26027
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Phase 1 Active</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
              RailSync-AI Operations Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Multi-source maintenance synchronization system for Indian Railways. Aggregates requests from TMS, TDMS, and SMMS, matches COA train paths, and optimizes joint 5 km possession windows via CP-SAT solver.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/planner"
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg shadow-sky-500/25 transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch CP-SAT Planner</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Trains (COA)"
          value="48"
          subtitle="42 On Time, 6 Delayed"
          icon={TrainTrack}
          color="sky"
          trend="+4 vs avg"
        />
        <KpiCard
          title="Pending Requests"
          value="18"
          subtitle="TMS: 8 | TDMS: 6 | SMMS: 4"
          icon={Wrench}
          color="amber"
        />
        <KpiCard
          title="Optimal 5km Bundles"
          value="3 Bundles"
          subtitle="7 Tasks Compatible"
          icon={Layers}
          color="emerald"
          trend="84% Efficiency"
        />
        <KpiCard
          title="Train Delays Avoided"
          value="145 min"
          subtitle="Saved in current window"
          icon={Clock}
          color="purple"
          trend="Zero Conflict"
        />
      </div>

      {/* Main Grid: Data Sources Status + AI Recommendation Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Source System Aggregation Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center space-x-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Multi-Source Ingestion Feeds</span>
            </h3>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40">
              ALL ONLINE
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">TMS Feed (Track Mgmt)</p>
                <p className="text-[11px] text-slate-400">Civil & Track Repair Jobs</p>
              </div>
              <span className="text-xs font-mono text-sky-400 font-bold bg-sky-950/60 px-2 py-1 rounded border border-sky-800/40">
                8 Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">TDMS Feed (Track Defects)</p>
                <p className="text-[11px] text-slate-400">Defects & Machine Operations</p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40">
                6 Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">SMMS Feed (S&T / OHE)</p>
                <p className="text-[11px] text-slate-400">Electrical OHE & Signal Maintenance</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
                4 Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">COA Feed (Control Office App)</p>
                <p className="text-[11px] text-slate-400">Live Train Schedules & Dynamic Paths</p>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950/60 px-2 py-1 rounded border border-purple-800/40">
                500+ Paths
              </span>
            </div>
          </div>
        </div>

        {/* Center & Right Column: AI Block Optimization Preview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-slate-200 text-sm flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>AI Recommended Maintenance Block (CP-SAT Model)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Spatial candidate block generated for Corridor NDLS-AGC (KM 120.0 - 128.5)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              RECOMMENDED
            </span>
          </div>

          {/* Block Card Preview */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Block ID</span>
                <span className="font-mono font-bold text-sky-400">BLK-2026-081</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Time Window</span>
                <span className="font-mono font-bold text-slate-200">02:00 - 03:00 AM</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Spatial Range</span>
                <span className="font-mono font-bold text-slate-200">KM 120.0 to 128.5 (8.5 km)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Tasks Bundled</span>
                <span className="font-mono font-bold text-emerald-400">7 Compatible Jobs</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Departments:</span>
                <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono text-[11px] border border-sky-800/50">CIVIL</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[11px] border border-amber-800/50">ELECTRICAL</span>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[11px] border border-purple-800/50">SIGNAL & TELECOM</span>
              </div>
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-slate-400">Optimization Score:</span>
                <span className="text-emerald-400 font-bold">94.5 / 100</span>
              </div>
            </div>
          </div>

          {/* Quick Actions / Safety Status */}
          <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-sky-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Safety Constraint Engine: Zero active train path conflicts detected for 02:00-03:00 window.</span>
            </div>
            <Link
              to="/planner"
              className="text-sky-400 font-semibold hover:underline flex items-center space-x-1"
            >
              <span>Review Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

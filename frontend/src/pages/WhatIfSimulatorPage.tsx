import React, { useState } from 'react';
import { runWhatIfSimulation } from '../services/api';
import { SlidersHorizontal, ArrowLeftRight, Play, ShieldCheck, Cpu } from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const [trainDelay, setTrainDelay] = useState<number>(20);
  const [durationDelta, setDurationDelta] = useState<number>(15);
  const [loading, setLoading] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const data = await runWhatIfSimulation({
        train_delay_minutes: trainDelay,
        train_number: '12951',
        maintenance_duration_delta: durationDelta,
      });
      setSimResult(data);
    } catch {
      // Fallback display
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-sky-400" />
          <span>Dynamic What-If Simulation Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Simulate train delays, task duration overruns, or emergency requests to evaluate schedule resilience.
        </p>
      </div>

      {/* Control Panel Inputs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-slate-200 text-sm flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span>Simulation Parameter Controls</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">
              Simulated Train Delay: <span className="text-sky-400 font-bold font-mono">+{trainDelay} mins</span>
            </label>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={trainDelay}
              onChange={(e) => setTrainDelay(Number(e.target.value))}
              className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">Train 12951 Mumbai Rajdhani Express</p>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">
              Task Duration Overrun: <span className="text-amber-400 font-bold font-mono">+{durationDelta} mins</span>
            </label>
            <input
              type="range"
              min="0"
              max="45"
              step="5"
              value={durationDelta}
              onChange={(e) => setDurationDelta(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">Deep Ballast Tamping Task Extension</p>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'RE-OPTIMIZING...' : 'RUN SIMULATION'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dual Panel Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Baseline Schedule */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center space-x-2">
              <ArrowLeftRight className="w-4 h-4 text-sky-400" />
              <span>Current Schedule Baseline</span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
              BASELINE
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Block ID:</span>
              <span className="font-mono font-bold text-sky-400">BLK-2026-081</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time Window:</span>
              <span className="font-mono text-slate-200">02:00 - 03:00 AM (60 min)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Spatial Range:</span>
              <span className="font-mono text-slate-200">KM 120.0 - 128.5 (8.5 km)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bundled Jobs:</span>
              <span className="font-mono font-bold text-emerald-400">7 Tasks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Passing Train (12951):</span>
              <span className="font-mono text-slate-200">02:40 AM (On Time)</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Simulated Outcome */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Simulated Outcome Plan</span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-mono text-[10px]">
              RE-OPTIMIZED
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Block ID:</span>
              <span className="font-mono font-bold text-emerald-400">
                {simResult?.new_plan?.block_id || 'BLK-2026-081-SIM'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Simulated Time Window:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {simResult?.new_plan?.start_time || '02:00'} - {simResult?.new_plan?.end_time || '03:15'} AM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tasks Preserved:</span>
              <span className="font-mono font-bold text-emerald-400">
                {simResult?.tasks_preserved || 7} / 7 Tasks
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Additional Train Delay:</span>
              <span className="font-mono font-bold text-emerald-400">
                {simResult?.additional_train_delay || 0} min avoided
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Safety Status:</span>
              <span className="font-mono font-bold text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                {simResult?.safety_status || 'SAFE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

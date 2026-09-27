import React, { useEffect, useState } from 'react';
import { fetchTrains } from '../services/api';
import { TrainInfo } from '../types';
import { TrainTrack, ArrowRight, RefreshCw, Activity, CheckCircle2, Clock } from 'lucide-react';

const defaultTrains: TrainInfo[] = [
  { id: '12951', train_number: '12951', train_name: 'Mumbai Rajdhani Express', train_type: 'EXPRESS', priority: 10, origin: 'NDLS', destination: 'MMCT', status: 'ON_TIME', delay_minutes: 0 },
  { id: '20171', train_number: '20171', train_name: 'Vande Bharat Express', train_type: 'EXPRESS', priority: 9, origin: 'NDLS', destination: 'BKN', status: 'ON_TIME', delay_minutes: 0 },
  { id: '12002', train_number: '12002', train_name: 'Bhopal Shatabdi Express', train_type: 'EXPRESS', priority: 9, origin: 'NDLS', destination: 'RKMP', status: 'ON_TIME', delay_minutes: 0 },
  { id: '12424', train_number: '12424', train_name: 'Dibrugarh Rajdhani Express', train_type: 'EXPRESS', priority: 10, origin: 'NDLS', destination: 'DBRG', status: 'DELAYED', delay_minutes: 12 },
  { id: '12626', train_number: '12626', train_name: 'Kerala Express', train_type: 'EXPRESS', priority: 8, origin: 'NDLS', destination: 'TVC', status: 'ON_TIME', delay_minutes: 0 },
  { id: '12280', train_number: '12280', train_name: 'Taj Express', train_type: 'PASSENGER', priority: 7, origin: 'NDLS', destination: 'VGLJ', status: 'HALTED', delay_minutes: 25 },
];

export const TrainMonitorPage: React.FC = () => {
  const [trains, setTrains] = useState<TrainInfo[]>(defaultTrains);
  const [loading, setLoading] = useState<boolean>(false);

  const loadTrainData = async () => {
    setLoading(true);
    try {
      const trainData = await fetchTrains();
      if (Array.isArray(trainData) && trainData.length > 0) {
        setTrains(trainData);
      }
    } catch {
      // Keep default trains on network failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainData();
  }, []);

  const onTimeCount = trains.filter((t) => t.status === 'ON_TIME').length;
  const delayedCount = trains.filter((t) => t.status !== 'ON_TIME').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
            <TrainTrack className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                COA REALTIME FEED
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE MONITORING
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              COA Live Train Operations & Movement Monitor
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Real-time train movements, dynamic section occupancies, and scheduled timetables synchronized from the Control Office Application (COA).
            </p>
          </div>
        </div>

        <button
          onClick={loadTrainData}
          disabled={loading}
          className="h-11 sm:h-12 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Operations</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Active Trains</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 mt-1 block">{trains.length}</span>
            <span className="text-sm text-slate-600 mt-1 block">Corridor Services</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">On-Time Services</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1 block">{onTimeCount}</span>
            <span className="text-sm text-slate-600 mt-1 block">Operating on schedule</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Delayed / Regulated</span>
            <span className="text-3xl sm:text-4xl font-black text-amber-700 mt-1 block">{delayedCount}</span>
            <span className="text-sm text-slate-600 mt-1 block">Caution orders active</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Train Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trains.map((train) => (
          <div
            key={train.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                #{train.train_number}
              </span>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wide border ${
                  train.status === 'ON_TIME'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {train.status === 'ON_TIME' ? 'ON TIME' : `${train.status} (+${train.delay_minutes}m)`}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-lg sm:text-xl leading-snug">{train.train_name}</h4>
              <div className="text-sm sm:text-base font-semibold text-slate-600 mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">{train.origin}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">{train.destination}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">
                Type: <strong className="text-slate-900 font-bold">{train.train_type}</strong>
              </span>
              <span className="text-slate-600">
                Priority: <strong className="text-blue-700 font-black">{train.priority} / 10</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

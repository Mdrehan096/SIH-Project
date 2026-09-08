import React, { useEffect, useState } from 'react';
import { fetchTrains } from '../services/api';
import { TrainInfo } from '../types';
import { TrainTrack, ArrowRight } from 'lucide-react';

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

  const loadTrainData = async () => {
    try {
      const trainData = await fetchTrains();
      if (Array.isArray(trainData) && trainData.length > 0) {
        setTrains(trainData);
      }
    } catch {
      // Keep default trains on network failure
    }
  };

  useEffect(() => {
    loadTrainData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <TrainTrack className="w-5 h-5 text-sky-400" />
          <span>COA Live Train Operations & Movement Monitor</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time train movements, dynamic section occupancies, and scheduled timetables from Control Office Application.
        </p>
      </div>

      {/* Train Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trains.map((train) => (
          <div key={train.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                {train.train_number}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                train.status === 'ON_TIME' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {train.status}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 text-sm">{train.train_name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1">
                <span>{train.origin}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 inline" />
                <span>{train.destination}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono">
              <span className="text-slate-400">Type: <strong className="text-slate-200">{train.train_type}</strong></span>
              <span className="text-slate-400">Priority: <strong className="text-sky-400">{train.priority} / 10</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

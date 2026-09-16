import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface DivisionItem {
  id: string;
  code: string;
  name: string;
  zone: string;
  headquarters: string;
  total_route_km: number;
  active_blocks: number;
  trains_running: number;
  critical_assets: number;
  risk_score: number;
  avg_delay_min: number;
  workload_index: string;
}

const MOCK_DIVISIONS: DivisionItem[] = [
  { id: 'DIV-NDLS', code: 'DLI', name: 'Delhi Division', zone: 'Northern Railway (NR)', headquarters: 'New Delhi', total_route_km: 1420.5, active_blocks: 4, trains_running: 128, critical_assets: 12, risk_score: 38.4, avg_delay_min: 8.2, workload_index: 'HIGH' },
  { id: 'DIV-PRYJ', code: 'PRYJ', name: 'Prayagraj Division', zone: 'North Central Railway (NCR)', headquarters: 'Prayagraj', total_route_km: 1280.0, active_blocks: 3, trains_running: 94, critical_assets: 8, risk_score: 42.1, avg_delay_min: 11.5, workload_index: 'MEDIUM' },
  { id: 'DIV-LKO', code: 'LKO', name: 'Lucknow Division', zone: 'Northern Railway (NR)', headquarters: 'Lucknow', total_route_km: 1155.2, active_blocks: 2, trains_running: 76, critical_assets: 5, risk_score: 29.8, avg_delay_min: 6.0, workload_index: 'MEDIUM' },
  { id: 'DIV-UMB', code: 'UMB', name: 'Ambala Division', zone: 'Northern Railway (NR)', headquarters: 'Ambala Cantt', total_route_km: 1040.8, active_blocks: 1, trains_running: 62, critical_assets: 4, risk_score: 21.5, avg_delay_min: 4.5, workload_index: 'LOW' },
  { id: 'DIV-MB', code: 'MB', name: 'Moradabad Division', zone: 'Northern Railway (NR)', headquarters: 'Moradabad', total_route_km: 980.4, active_blocks: 2, trains_running: 54, critical_assets: 6, risk_score: 34.0, avg_delay_min: 9.1, workload_index: 'MEDIUM' },
];

export const DivisionsPage: React.FC = () => {
  const [divisions, setDivisions] = useState<DivisionItem[]>(MOCK_DIVISIONS);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/divisions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDivisions(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-sky-400" />
          <span>Railway Division-Wise Operations & Distance Module</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Division route distance metrics, active maintenance workload, train density, and operational risk indexes.
        </p>
      </div>

      {/* Divisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {divisions.map((div) => (
          <div key={div.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                  {div.code}
                </span>
                <h3 className="font-bold text-white text-sm mt-1">{div.name}</h3>
                <p className="text-[11px] text-slate-400">{div.zone}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                div.workload_index === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {div.workload_index} WORKLOAD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Route Distance</span>
                <span className="font-bold text-sky-400 text-sm">{div.total_route_km} km</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Active Blocks</span>
                <span className="font-bold text-amber-400 text-sm">{div.active_blocks} Possessions</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Trains Live</span>
                <span className="font-bold text-emerald-400 text-sm">{div.trains_running} Active</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">AI Risk Index</span>
                <span className="font-bold text-rose-400 text-sm">{div.risk_score} / 100</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>HQ: <strong className="text-slate-200">{div.headquarters}</strong></span>
              <span>Avg Delay: <strong className="text-amber-400">{div.avg_delay_min} min</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
            <MapPin className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                DIVISIONAL NETWORK
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                5 DIVISIONS ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Railway Division-Wise Operations & Distance Module
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Division route distance metrics, active maintenance workload, train density, and operational risk indexes.
            </p>
          </div>
        </div>
      </div>

      {/* Divisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisions.map((div) => (
          <div
            key={div.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {div.code}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl mt-2">{div.name}</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">{div.zone}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                  div.workload_index === 'HIGH'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {div.workload_index} WORKLOAD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Route Distance</span>
                <span className="font-mono font-black text-blue-700 text-lg mt-1 block">{div.total_route_km} km</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Active Blocks</span>
                <span className="font-mono font-black text-amber-700 text-lg mt-1 block">{div.active_blocks} Possessions</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Trains Live</span>
                <span className="font-mono font-black text-emerald-700 text-lg mt-1 block">{div.trains_running} Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">AI Risk Index</span>
                <span className="font-mono font-black text-rose-700 text-lg mt-1 block">{div.risk_score} / 100</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600">
              <span>HQ: <strong className="text-slate-900">{div.headquarters}</strong></span>
              <span>Avg Delay: <strong className="text-amber-700">{div.avg_delay_min} min</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

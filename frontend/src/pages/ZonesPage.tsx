import React, { useEffect, useState } from 'react';
import { Layers, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ZoneItem {
  id: string;
  code: string;
  name: string;
  headquarters: string;
  total_route_km: number;
  divisions_count: number;
  active_blocks: number;
  train_traffic_index: number;
  risk_level: string;
  maintenance_workload: number;
}

const MOCK_ZONES: ZoneItem[] = [
  { id: 'ZONE-NR', code: 'NR', name: 'Northern Railway', headquarters: 'New Delhi', total_route_km: 6968.0, divisions_count: 5, active_blocks: 9, train_traffic_index: 92.5, risk_level: 'MODERATE', maintenance_workload: 84 },
  { id: 'ZONE-NCR', code: 'NCR', name: 'North Central Railway', headquarters: 'Prayagraj', total_route_km: 3151.0, divisions_count: 3, active_blocks: 5, train_traffic_index: 88.0, risk_level: 'HIGH', maintenance_workload: 76 },
  { id: 'ZONE-WR', code: 'WR', name: 'Western Railway', headquarters: 'Mumbai (Churchgate)', total_route_km: 6182.0, divisions_count: 6, active_blocks: 7, train_traffic_index: 95.0, risk_level: 'LOW', maintenance_workload: 68 },
];

export const ZonesPage: React.FC = () => {
  const [zones, setZones] = useState<ZoneItem[]>(MOCK_ZONES);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/zones')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setZones(data);
      })
      .catch(() => {});
  }, []);

  const chartData = zones.map((z) => ({
    name: z.code,
    route_km: z.total_route_km,
    workload: z.maintenance_workload,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                INDIAN RAILWAYS ZONAL GRID
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                FEDERATED ARCHITECTURE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Zonal Railway Operations Analytics
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              High-level zonal performance, route kilometer coverage, and maintenance workload comparisons.
            </p>
          </div>
        </div>
      </div>

      {/* Zone Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {zones.map((z) => (
          <div key={z.id} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {z.code}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl mt-2">{z.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-700">
                {z.divisions_count} Divisions
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Headquarters:</span>
                <span className="text-slate-900 font-bold">{z.headquarters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Total Route Distance:</span>
                <span className="text-blue-700 font-mono font-bold">{z.total_route_km} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Active Maintenance Blocks:</span>
                <span className="text-amber-700 font-mono font-bold">{z.active_blocks} Blocks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Traffic Index:</span>
                <span className="text-emerald-700 font-mono font-bold">{z.train_traffic_index} / 100</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Graph */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-blue-700" />
          <span>Zonal Route Distance (km) & Maintenance Workload Comparison</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="route_km" fill="#1d4ed8" name="Route Distance (km)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

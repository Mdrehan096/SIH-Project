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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <span>Zonal Railway Operations Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          High-level zonal performance, route kilometer coverage, and maintenance workload comparisons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {zones.map((z) => (
          <div key={z.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                  {z.code}
                </span>
                <h3 className="font-bold text-white text-sm mt-1">{z.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                {z.divisions_count} Divisions
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Headquarters:</span>
                <span className="text-slate-200 font-semibold">{z.headquarters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Route Distance:</span>
                <span className="text-sky-400 font-bold">{z.total_route_km} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Maintenance Blocks:</span>
                <span className="text-amber-400 font-bold">{z.active_blocks} Blocks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Traffic Index:</span>
                <span className="text-emerald-400 font-bold">{z.train_traffic_index} / 100</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span>Zonal Route Distance (km) & Maintenance Workload Comparison</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="route_km" fill="#0284c7" name="Route Distance (km)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

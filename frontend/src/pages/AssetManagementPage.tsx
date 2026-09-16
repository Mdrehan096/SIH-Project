import React, { useEffect, useState } from 'react';
import { Database, Search } from 'lucide-react';

interface AssetItem {
  id: string;
  asset_code: string;
  name: string;
  asset_type: string;
  department_id: string;
  section_id: string;
  location_km: number;
  installation_year: number;
  health_score: number;
  status: string;
}

const MOCK_ASSETS: AssetItem[] = [
  { id: 'AST-00001', asset_code: 'TRK-KM-120-DN', name: 'Down Main Track Segment KM 120.0', asset_type: 'TRACK', department_id: 'CIVIL', section_id: 'SEC-NDLS-AGC-01', location_km: 120.0, installation_year: 2018, health_score: 72.5, status: 'MAINTENANCE_REQUIRED' },
  { id: 'AST-00002', asset_code: 'TRK-KM-122-DN', name: 'Down Main Track Segment KM 122.0', asset_type: 'TRACK', department_id: 'CIVIL', section_id: 'SEC-NDLS-AGC-01', location_km: 122.0, installation_year: 2017, health_score: 68.0, status: 'MAINTENANCE_REQUIRED' },
  { id: 'AST-00003', asset_code: 'TRK-KM-124-DN', name: 'Down Main Track Segment KM 124.5', asset_type: 'TRACK', department_id: 'CIVIL', section_id: 'SEC-NDLS-AGC-01', location_km: 124.5, installation_year: 2015, health_score: 54.0, status: 'DEGRADED' },
  { id: 'AST-00004', asset_code: 'OHE-KM-124-MAIN', name: 'OHE Portal & Catenary Line KM 124.2', asset_type: 'OHE', department_id: 'ELECTRICAL', section_id: 'SEC-NDLS-AGC-01', location_km: 124.2, installation_year: 2016, health_score: 81.0, status: 'MAINTENANCE_REQUIRED' },
  { id: 'AST-00005', asset_code: 'SIG-KM-125-INT', name: 'Automatic Signal Interlocking Box 125-B', asset_type: 'SIGNAL', department_id: 'SIGNAL_TELECOM', section_id: 'SEC-NDLS-AGC-01', location_km: 125.0, installation_year: 2019, health_score: 88.0, status: 'OPERATIONAL' },
  { id: 'AST-00006', asset_code: 'TRK-KM-126-DN', name: 'Down Main Track Segment KM 126.0', asset_type: 'TRACK', department_id: 'CIVIL', section_id: 'SEC-NDLS-AGC-01', location_km: 126.0, installation_year: 2016, health_score: 75.0, status: 'OPERATIONAL' },
];

export const AssetManagementPage: React.FC = () => {
  const [assets, setAssets] = useState<AssetItem[]>(MOCK_ASSETS);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/assets')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAssets(data);
      })
      .catch(() => {});
  }, []);

  const filtered = assets.filter(
    (a) =>
      a.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.asset_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Database className="w-5 h-5 text-sky-400" />
            <span>Railway Asset Health & Inventory Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track, OHE, Signal, Turnout, Bridge, and Point Machine asset condition monitoring.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search asset code, type, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500 w-full font-mono"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">Total Indexed: {filtered.length} Assets</span>
      </div>

      {/* Asset Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Asset Code</th>
                <th className="p-3.5">Asset Description</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Health Score</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((ast) => (
                <tr key={ast.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-sky-400">{ast.asset_code}</td>
                  <td className="p-3.5 text-slate-200 font-sans font-medium">{ast.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {ast.asset_type}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{ast.department_id}</td>
                  <td className="p-3.5 text-sky-300">KM {ast.location_km}</td>
                  <td className="p-3.5 font-bold text-emerald-400">{ast.health_score} / 100</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ast.status === 'OPERATIONAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {ast.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

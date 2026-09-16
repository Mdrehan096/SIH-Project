import React, { useState } from 'react';
import { Route, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';

export const DistancePage: React.FC = () => {
  const [origin, setOrigin] = useState<string>('NDLS');
  const [destination, setDestination] = useState<string>('AGC');
  const [result, setResult] = useState<any>({
    origin: { code: 'NDLS', name: 'New Delhi', division: 'Delhi Division' },
    destination: { code: 'AGC', name: 'Agra Cantt', division: 'Agra Division' },
    straight_line_km: 178.4,
    railway_route_km: 210.5,
    estimated_travel_hours: 2.6,
    calculation_method: 'Geographical Haversine + Railway Track Curvature Factor (1.18x)',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/distance/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin_code: origin, destination_code: destination }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch {
      // Keep result
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Route className="w-5 h-5 text-sky-400" />
          <span>Railway Route & Distance Analysis Module</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Geographical Haversine distance & railway track curvature distance calculation service.
        </p>
      </div>

      {/* Control Selection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-slate-200 text-sm flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-sky-400" />
          <span>Station-to-Station Distance Selector</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Origin Station:</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono font-bold"
            >
              <option value="NDLS">NDLS - New Delhi Station</option>
              <option value="GZB">GZB - Ghaziabad Junction</option>
              <option value="ALJN">ALJN - Aligarh Junction</option>
              <option value="TDL">TDL - Tundla Junction</option>
              <option value="AGC">AGC - Agra Cantt Station</option>
              <option value="CNB">CNB - Kanpur Central</option>
              <option value="PRYJ">PRYJ - Prayagraj Junction</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Destination Station:</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono font-bold"
            >
              <option value="AGC">AGC - Agra Cantt Station</option>
              <option value="NDLS">NDLS - New Delhi Station</option>
              <option value="GZB">GZB - Ghaziabad Junction</option>
              <option value="ALJN">ALJN - Aligarh Junction</option>
              <option value="CNB">CNB - Kanpur Central</option>
              <option value="PRYJ">PRYJ - Prayagraj Junction</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/20"
            >
              <Navigation className="w-4 h-4" />
              <span>{loading ? 'CALCULATING...' : 'CALCULATE ROUTE DISTANCE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Result Metrics Grid */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                {result.origin.code}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {result.destination.code}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {result.origin.name} ({result.origin.division}) to {result.destination.name} ({result.destination.division})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Straight Line Geo Distance</span>
              <div className="text-2xl font-bold font-mono text-slate-200">{result.straight_line_km} km</div>
              <p className="text-[10px] text-slate-500">Haversine spherical coordinates</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Railway Route Track Distance</span>
              <div className="text-2xl font-bold font-mono text-sky-400">{result.railway_route_km} km</div>
              <p className="text-[10px] text-sky-400/80">Adjusted for track curvature</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Est. Train Transit Time</span>
              <div className="text-2xl font-bold font-mono text-amber-400">{result.estimated_travel_hours} hours</div>
              <p className="text-[10px] text-slate-500">Based on 80 km/h average speed</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/30 text-xs text-sky-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Calculation Method: {result.calculation_method}</span>
          </div>
        </div>
      )}
    </div>
  );
};

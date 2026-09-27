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
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
            <Route className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                HAVERSINE + TRACK CURVATURE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                REALTIME ROUTE CALCULATOR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Railway Route & Distance Analysis Module
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Geographical Haversine distance & railway track curvature distance calculation service.
            </p>
          </div>
        </div>
      </div>

      {/* Control Selection Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2.5">
          <Navigation className="w-5 h-5 text-blue-700" />
          <span>Station-to-Station Distance Selector</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
              Origin Station:
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full h-11 sm:h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-blue-600 cursor-pointer"
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

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
              Destination Station:
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full h-11 sm:h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-blue-600 cursor-pointer"
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
              className="w-full h-11 sm:h-12 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Navigation className="w-5 h-5" />
              <span>{loading ? 'CALCULATING...' : 'CALCULATE ROUTE DISTANCE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Result Metrics Grid */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {result.origin.code}
              </span>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <span className="px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {result.destination.code}
              </span>
            </div>
            <span className="text-sm sm:text-base text-slate-700 font-semibold">
              {result.origin.name} ({result.origin.division}) to {result.destination.name} ({result.destination.division})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Geo Distance</span>
              <div className="text-3xl font-black font-mono text-slate-900 mt-1">{result.straight_line_km} km</div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Haversine spherical coordinates</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Route Track Distance</span>
              <div className="text-3xl font-black font-mono text-blue-700 mt-1">{result.railway_route_km} km</div>
              <p className="text-xs sm:text-sm text-blue-800 font-medium">Adjusted for track curvature</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Est. Transit Time</span>
              <div className="text-3xl font-black font-mono text-amber-700 mt-1">{result.estimated_travel_hours} hours</div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Based on 80 km/h average speed</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs sm:text-sm text-blue-950 font-semibold flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>Calculation Method: {result.calculation_method}</span>
          </div>
        </div>
      )}
    </div>
  );
};

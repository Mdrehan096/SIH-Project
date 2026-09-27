import React, { useState } from 'react';
import { MapPin, TrainTrack, Wrench, Info } from 'lucide-react';

interface MapMarker {
  id: string;
  name: string;
  department: 'CIVIL' | 'ELECTRICAL' | 'SIGNAL_TELECOM' | 'TRAIN';
  location_km: number;
  priority: string;
  risk_score: number;
  duration_minutes?: number;
  status: string;
  details: string;
}

const mapMarkers: MapMarker[] = [
  { id: 'TMS-001', name: 'Track Rail Replacement', department: 'CIVIL', location_km: 120.0, priority: 'HIGH', risk_score: 78, duration_minutes: 45, status: 'PENDING', details: 'Replace worn down main line rails at KM 120.0.' },
  { id: 'TDMS-002', name: 'Ultrasonic Flaw Repair', department: 'CIVIL', location_km: 122.0, priority: 'MEDIUM', risk_score: 62, duration_minutes: 30, status: 'PENDING', details: 'Ultrasonic flaw detection micro-crack repair.' },
  { id: 'SMMS-003', name: 'OHE Catenary Wire Check', department: 'ELECTRICAL', location_km: 124.2, priority: 'HIGH', risk_score: 82, duration_minutes: 40, status: 'PENDING', details: 'Overhead Equipment tensioning & bracket alignment.' },
  { id: 'TMS-004', name: 'Deep Ballast Tamping', department: 'CIVIL', location_km: 124.5, priority: 'CRITICAL', risk_score: 90, duration_minutes: 60, status: 'PENDING', details: 'Ballast tamping machine operation.' },
  { id: 'SMMS-005', name: 'Signal Relay Box Test', department: 'SIGNAL_TELECOM', location_km: 125.0, priority: 'MEDIUM', risk_score: 55, duration_minutes: 30, status: 'PENDING', details: 'Automatic signaling relay testing.' },
  { id: 'TMS-006', name: 'Sleeper Bolt Fastening', department: 'CIVIL', location_km: 126.0, priority: 'LOW', risk_score: 35, duration_minutes: 25, status: 'PENDING', details: 'Sleeper fastening bolt tightening.' },
  { id: 'TDMS-007', name: 'Weld Defect Rectification', department: 'CIVIL', location_km: 128.5, priority: 'HIGH', risk_score: 74, duration_minutes: 35, status: 'PENDING', details: 'Alumino-thermic weld defect grinding.' },
  { id: 'TRN-12951', name: 'Mumbai Rajdhani (12951)', department: 'TRAIN', location_km: 118.0, priority: '10', risk_score: 0, status: 'ON_TIME', details: 'Passing Express Train (Scheduled 02:40 AM).' },
  { id: 'TRN-20171', name: 'Vande Bharat (20171)', department: 'TRAIN', location_km: 132.0, priority: '9', risk_score: 0, status: 'ON_TIME', details: 'Passing Express Train (Scheduled 03:25 AM).' },
];

export const RailwayMapPage: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(mapMarkers[0]);

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
                CORRIDOR SPATIAL ENGINE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                5 KM BUNDLING ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Northern Railway Corridor Interactive Spatial Map
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Interactive corridor map (NDLS - AGC, KM 0.0 to 200.0) showing 5 km spatial bundling zones, active maintenance jobs, and train paths.
            </p>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block shadow-xs" />
              <span className="text-slate-700">Civil Track</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block shadow-xs" />
              <span className="text-slate-700">Electrical (OHE)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-purple-600 inline-block shadow-xs" />
              <span className="text-slate-700">S&T Signals</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block shadow-xs" />
              <span className="text-slate-700">Active Trains</span>
            </span>
          </div>

          <div className="text-xs sm:text-sm font-mono font-bold bg-blue-50 text-blue-800 px-4 py-1.5 rounded-xl border border-blue-200">
            5 KM Spatial Bundle Active: KM 120.0 - 128.5
          </div>
        </div>

        {/* Railway Corridor Track Graphic */}
        <div className="relative py-14 px-8 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-inner">
          {/* Corridor Track Lines */}
          <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-slate-300 -translate-y-2.5 rounded-full" />
          <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-slate-300 translate-y-2.5 rounded-full" />

          {/* Spatial Bundle Highlight Zone (KM 120 - 128.5) */}
          <div
            className="absolute top-4 bottom-4 bg-blue-100/70 border-2 border-dashed border-blue-400 rounded-2xl pointer-events-none transition-all duration-300"
            style={{ left: '55%', width: '22%' }}
          >
            <span className="absolute top-2 left-3 text-xs font-mono text-blue-900 font-extrabold bg-white px-2 py-0.5 rounded-lg border border-blue-300 shadow-xs">
              5 KM JOINT BUNDLE ZONE
            </span>
          </div>

          {/* Kilometer Ticks */}
          <div className="flex justify-between text-xs font-mono font-bold text-slate-500 mb-10">
            <span>KM 0 (NDLS)</span>
            <span>KM 50</span>
            <span>KM 100</span>
            <span className="text-blue-700 font-black">KM 120-128 (BUNDLE)</span>
            <span>KM 160</span>
            <span>KM 200 (AGC)</span>
          </div>

          {/* Interactive Markers */}
          <div className="relative h-16 flex items-center">
            {mapMarkers.map((marker) => {
              const leftPercent = Math.min(Math.max((marker.location_km / 200) * 100, 2), 96);
              const isSelected = selectedMarker?.id === marker.id;

              const bgMap = {
                CIVIL: 'bg-blue-600 text-white',
                ELECTRICAL: 'bg-amber-500 text-white',
                SIGNAL_TELECOM: 'bg-purple-600 text-white',
                TRAIN: 'bg-emerald-600 text-white animate-pulse',
              };

              return (
                <button
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker)}
                  style={{ left: `${leftPercent}%` }}
                  className={`absolute transform -translate-x-1/2 p-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer ${
                    bgMap[marker.department]
                  } ${isSelected ? 'ring-4 ring-blue-400 scale-125 z-20' : 'hover:scale-110 z-10'}`}
                  title={`${marker.name} (KM ${marker.location_km})`}
                >
                  {marker.department === 'TRAIN' ? (
                    <TrainTrack className="w-5 h-5" />
                  ) : (
                    <Wrench className="w-5 h-5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Details Inspector */}
        {selectedMarker && (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {selectedMarker.id}
                </span>
                <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">{selectedMarker.name}</h4>
              </div>
              <span className="text-sm font-mono text-slate-600">
                Location: <strong className="text-blue-700 font-bold font-mono">KM {selectedMarker.location_km}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Department</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">{selectedMarker.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Priority</span>
                <span
                  className={`font-mono font-black mt-0.5 block ${
                    selectedMarker.priority === 'CRITICAL' ? 'text-rose-700' : 'text-amber-700'
                  }`}
                >
                  {selectedMarker.priority}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">AI Risk Score</span>
                <span className="font-mono font-black text-blue-700 mt-0.5 block">{selectedMarker.risk_score} / 100</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Est. Duration</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">
                  {selectedMarker.duration_minutes || 30} mins
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 pt-3 border-t border-slate-200 flex items-start gap-2 font-medium">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>{selectedMarker.details}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

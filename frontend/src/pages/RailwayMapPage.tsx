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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-sky-400" />
          <span>Northern Railway Corridor Interactive Spatial Map</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Interactive corridor map (NDLS - AGC, KM 0.0 to 200.0) showing 5 km spatial bundling zones, active maintenance jobs, and train paths.
        </p>
      </div>

      {/* Main Map Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
              <span className="text-slate-300">Civil Tasks</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="text-slate-300">Electrical (OHE)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
              <span className="text-slate-300">S&T Signals</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-300">Active Trains</span>
            </span>
          </div>

          <div className="text-xs font-mono bg-sky-950/60 text-sky-300 px-3 py-1 rounded-lg border border-sky-800/40">
            5 KM Spatial Bundle Active: KM 120.0 - 128.5
          </div>
        </div>

        {/* Railway Corridor Track Graphic */}
        <div className="relative py-12 px-6 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          {/* Corridor Track Lines */}
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-800 -translate-y-2" />
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-800 translate-y-2" />
          
          {/* Spatial Bundle Highlight Zone (KM 120 - 128.5) */}
          <div
            className="absolute top-4 bottom-4 bg-sky-500/10 border-2 border-dashed border-sky-500/40 rounded-xl pointer-events-none transition-all duration-300"
            style={{ left: '55%', width: '22%' }}
          >
            <span className="absolute top-2 left-2 text-[10px] font-mono text-sky-300 font-bold bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800/50">
              5 KM JOINT BUNDLE ZONE
            </span>
          </div>

          {/* Kilometer Ticks */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-8">
            <span>KM 0 (NDLS)</span>
            <span>KM 50</span>
            <span>KM 100</span>
            <span className="text-sky-400 font-bold">KM 120-128 (BUNDLE)</span>
            <span>KM 160</span>
            <span>KM 200 (AGC)</span>
          </div>

          {/* Interactive Markers */}
          <div className="relative h-16 flex items-center">
            {mapMarkers.map((marker) => {
              // Convert KM 0-200 to percentage
              const leftPercent = Math.min(Math.max((marker.location_km / 200) * 100, 2), 96);
              const isSelected = selectedMarker?.id === marker.id;

              const bgMap = {
                CIVIL: 'bg-sky-500 text-slate-950',
                ELECTRICAL: 'bg-amber-500 text-slate-950',
                SIGNAL_TELECOM: 'bg-purple-500 text-slate-950',
                TRAIN: 'bg-emerald-500 text-slate-950 animate-pulse',
              };

              return (
                <button
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker)}
                  style={{ left: `${leftPercent}%` }}
                  className={`absolute transform -translate-x-1/2 p-2 rounded-full shadow-lg transition-all duration-200 ${
                    bgMap[marker.department]
                  } ${isSelected ? 'ring-4 ring-white scale-125 z-20' : 'hover:scale-110 z-10'}`}
                  title={`${marker.name} (KM ${marker.location_km})`}
                >
                  {marker.department === 'TRAIN' ? (
                    <TrainTrack className="w-4 h-4" />
                  ) : (
                    <Wrench className="w-4 h-4" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Details Inspector */}
        {selectedMarker && (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                  {selectedMarker.id}
                </span>
                <h4 className="font-bold text-slate-200 text-sm">{selectedMarker.name}</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Location: <strong className="text-sky-400">KM {selectedMarker.location_km}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Department</span>
                <span className="font-mono font-semibold text-slate-200">{selectedMarker.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Priority</span>
                <span className={`font-mono font-bold ${selectedMarker.priority === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {selectedMarker.priority}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">AI Risk Score</span>
                <span className="font-mono font-bold text-sky-400">{selectedMarker.risk_score} / 100</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Est. Duration</span>
                <span className="font-mono font-semibold text-slate-200">{selectedMarker.duration_minutes || 30} mins</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <Info className="w-3.5 h-3.5 text-sky-400 inline mr-1.5" />
              {selectedMarker.details}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

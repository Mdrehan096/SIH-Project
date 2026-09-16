import React, { useState } from 'react';
import { Search, X, TrainTrack, MapPin, Wrench, Layers, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  category: 'Train' | 'Station' | 'Division' | 'Block' | 'Report';
  subtitle: string;
  path: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  { id: '12951', title: 'Train 12951 • Mumbai Rajdhani Express', category: 'Train', subtitle: 'NDLS to MMCT • Speed 82 km/h • On Time', path: '/trains' },
  { id: '20171', title: 'Train 20171 • Vande Bharat Express', category: 'Train', subtitle: 'NDLS to BKN • Speed 110 km/h • On Time', path: '/trains' },
  { id: '12424', title: 'Train 12424 • Dibrugarh Rajdhani Express', category: 'Train', subtitle: 'NDLS to DBRG • Delayed +12 min', path: '/trains' },
  { id: 'DLI', title: 'Delhi Division (NR)', category: 'Division', subtitle: 'HQ New Delhi • 1,420 km Route • 4 Active Blocks', path: '/divisions' },
  { id: 'PRYJ', title: 'Prayagraj Division (NCR)', category: 'Division', subtitle: 'HQ Prayagraj • 1,280 km Route • 3 Active Blocks', path: '/divisions' },
  { id: 'NDLS', title: 'New Delhi Railway Station (NDLS)', category: 'Station', subtitle: 'KM 0.0 • Northern Railway • Major Junction', path: '/distance' },
  { id: 'AGC', title: 'Agra Cantt Station (AGC)', category: 'Station', subtitle: 'KM 200.0 • Agra Division', path: '/distance' },
  { id: 'BLK-081', title: 'Block BLK-2026-081 (5 km Possession)', category: 'Block', subtitle: 'KM 120.0-128.5 • 02:00-03:00 AM • Recommended', path: '/planner' },
  { id: 'RPT-01', title: 'Maintenance Block Utilization Report', category: 'Report', subtitle: 'PDF / CSV Exportable Operations Audit', path: '/reports' },
];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');

  if (!isOpen) return null;

  const results = query.trim()
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_DATABASE.slice(0, 5);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Train': return <TrainTrack className="w-4 h-4 text-sky-400" />;
      case 'Division': return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'Station': return <MapPin className="w-4 h-4 text-amber-400" />;
      case 'Block': return <Layers className="w-4 h-4 text-purple-400" />;
      case 'Report': return <FileText className="w-4 h-4 text-blue-400" />;
      default: return <Wrench className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl space-y-0">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-sky-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search trains, stations, divisions, maintenance blocks, reports..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 focus:outline-none placeholder-slate-500 font-sans"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/60">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No matching railway operational records found for "{query}".
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>RETRACK Global Indian Railways Database Search</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

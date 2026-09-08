import React, { useEffect, useState } from 'react';
import { checkSystemHealth } from '../services/api';
import { SystemHealth } from '../types';
import { RefreshCw, Radio, UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await checkSystemHealth();
      setHealth(data);
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Division / Zone Title */}
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <span>Northern Railway Zone</span>
            <span className="text-slate-600">•</span>
            <span className="text-sky-400 font-mono">Section: NDLS - AGC (KM 0 - 200)</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Section Controller Console • Multi-Source Joint Block Planning Engine
          </p>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center space-x-5">
        {/* Backend Health Badge */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Radio
            className={`w-3.5 h-3.5 ${
              health?.status === 'healthy'
                ? 'text-emerald-400 animate-pulse'
                : 'text-rose-500'
            }`}
          />
          <span className="text-xs font-mono text-slate-300">
            FastAPI:{' '}
            {loading ? (
              <span className="text-slate-500">checking...</span>
            ) : health?.status === 'healthy' ? (
              <span className="text-emerald-400 font-semibold">HEALTHY v1.0</span>
            ) : (
              <span className="text-rose-400 font-semibold">OFFLINE</span>
            )}
          </span>
          <button
            onClick={fetchHealth}
            title="Refresh System Health"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Live Clock */}
        <div className="font-mono text-xs text-sky-300 bg-sky-950/40 px-3 py-1.5 rounded-lg border border-sky-800/40">
          {currentTime || '00:00:00 IST'}
        </div>

        {/* Controller Profile */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold text-xs">
            SC
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-medium text-slate-200">Section Controller</p>
            <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <UserCheck className="w-2.5 h-2.5 inline mr-0.5" />
              <span>CONTROLLER Role</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

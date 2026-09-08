import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'sky' | 'emerald' | 'amber' | 'rose' | 'purple';
  trend?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'sky',
  trend,
}) => {
  const colorMap = {
    sky: 'from-sky-500/10 to-sky-600/5 text-sky-400 border-sky-500/30 icon-sky',
    emerald: 'from-emerald-500/10 to-emerald-600/5 text-emerald-400 border-emerald-500/30 icon-emerald',
    amber: 'from-amber-500/10 to-amber-600/5 text-amber-400 border-amber-500/30 icon-amber',
    rose: 'from-rose-500/10 to-rose-600/5 text-rose-400 border-rose-500/30 icon-rose',
    purple: 'from-purple-500/10 to-purple-600/5 text-purple-400 border-purple-500/30 icon-purple',
  };

  const iconBgMap = {
    sky: 'bg-sky-500/20 text-sky-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/20 text-rose-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className={`p-4 rounded-xl bg-slate-900 border border-slate-800 bg-gradient-to-br ${colorMap[color]} shadow-sm hover:border-slate-700 transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconBgMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold font-mono text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-[11px] text-slate-400 truncate">{subtitle}</p>
      )}
    </div>
  );
};

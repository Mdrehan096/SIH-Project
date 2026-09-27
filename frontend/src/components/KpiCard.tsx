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
  const iconThemeMap = {
    sky: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm sm:text-base font-bold text-slate-700 leading-tight">
          {title}
        </span>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${iconThemeMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs sm:text-sm font-bold font-mono text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg border border-emerald-300">
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-2 text-sm font-medium text-slate-600 truncate">{subtitle}</p>
      )}
    </div>
  );
};

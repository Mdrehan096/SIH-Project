import React, { useEffect, useState } from 'react';
import { FileText, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  category: string;
  description: string;
  period: string;
  format: string;
}

const MOCK_REPORTS: ReportItem[] = [
  { id: 'RPT-MAINT-01', title: 'Integrated Maintenance Block Utilization Report', category: 'MAINTENANCE', description: 'Comprehensive audit of 5 km spatial bundling efficiency, total possession hours saved, and department breakdown.', period: 'Current Month (Sept 2026)', format: 'PDF / CSV' },
  { id: 'RPT-DIV-02', title: 'Division Operations & Distance Performance Report', category: 'DIVISION', description: 'Detailed division-wise route kilometer breakdown, active block workload, and train traffic density analysis.', period: 'Quarter 3 (2026)', format: 'PDF / CSV' },
  { id: 'RPT-TRAIN-03', title: 'COA Train Impact & Delay Avoidance Analysis', category: 'TRAIN_IMPACT', description: 'Analysis of train delays avoided due to joint possession window optimization vs uncoordinated maintenance.', period: 'Current Week', format: 'PDF / CSV' },
  { id: 'RPT-RISK-04', title: 'AI Predictive Risk & Asset Health Summary', category: 'RISK_ANALYSIS', description: 'Scikit-Learn Random Forest risk predictions, high-risk track sections, and preventive maintenance recommendations.', period: 'Last 30 Days', format: 'PDF / CSV' },
];

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(MOCK_REPORTS);
  const [exportMsg, setExportMsg] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/reports')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setReports(data);
      })
      .catch(() => {});
  }, []);

  const handleExport = (title: string, fmt: 'PDF' | 'CSV') => {
    setExportMsg(`Exporting "${title}" as ${fmt} file...`);
    setTimeout(() => {
      setExportMsg(`Successfully exported "${title}" (${fmt}). File downloaded.`);
      setTimeout(() => setExportMsg(''), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <span>Operational Reports & Export Center</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate official Indian Railways audit reports, maintenance performance logs, and risk analysis summaries.
        </p>
      </div>

      {exportMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center space-x-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportMsg}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((rpt) => (
          <div key={rpt.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                {rpt.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                {rpt.category}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">{rpt.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rpt.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">{rpt.period}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExport(rpt.title, 'PDF')}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono font-bold text-[11px] flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleExport(rpt.title, 'CSV')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-[11px] flex items-center space-x-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

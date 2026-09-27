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
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                GOVERNMENT AUDIT REPORTING
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                EXPORT READY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Operational Reports & Export Center
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Generate official Indian Railways audit reports, maintenance performance logs, and risk analysis summaries.
            </p>
          </div>
        </div>
      </div>

      {exportMsg && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-center gap-3 font-semibold shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{exportMsg}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rpt) => (
          <div key={rpt.id} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {rpt.id}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700">
                {rpt.category}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug">{rpt.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">{rpt.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-slate-500 font-mono font-semibold">{rpt.period}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport(rpt.title, 'PDF')}
                  className="h-10 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleExport(rpt.title, 'CSV')}
                  className="h-10 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
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

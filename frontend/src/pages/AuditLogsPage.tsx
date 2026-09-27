import React from 'react';
import { ScrollText } from 'lucide-react';

const mockAuditLogs = [
  { id: 'LOG-001', action: 'BLOCK_APPROVED', user: 'Section Controller (NDLS-AGC)', entity: 'BLK-2026-081', timestamp: '2026-09-06 18:35:10 IST', details: 'Approved recommended 5 km joint possession block window 02:00-03:00.' },
  { id: 'LOG-002', action: 'PN_GENERATED', user: 'Section Controller (NDLS-AGC)', entity: 'PN-847291', timestamp: '2026-09-06 18:35:12 IST', details: 'Generated cryptographic Private Number for Block BLK-2026-081.' },
  { id: 'LOG-003', action: 'PN_VERIFIED', user: 'Station Master (New Delhi)', entity: 'PN-847291', timestamp: '2026-09-06 18:35:45 IST', details: 'Station Master verified PN Code. Block possession authorized ACTIVE.' },
  { id: 'LOG-004', action: 'RISK_SCORING_RUN', user: 'System Risk Engine', entity: 'TRK-124', timestamp: '2026-09-06 18:49:31 IST', details: 'Evaluated predictive risk score 78.5 (HIGH risk category).' },
];

export const AuditLogsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
            <ScrollText className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                IMMUTABLE COMPLIANCE LEDGER
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                AUDIT TRAIL ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              System Audit Trail & Operational Compliance Logs
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Immutable audit record of block creations, PN authorizations, controller overrides, and risk predictions across railway divisions.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-4 px-4 sm:px-5">Log ID</th>
                <th className="py-4 px-4 sm:px-5">Action Event</th>
                <th className="py-4 px-4 sm:px-5">User Role</th>
                <th className="py-4 px-4 sm:px-5">Entity Reference</th>
                <th className="py-4 px-4 sm:px-5">Timestamp</th>
                <th className="py-4 px-4 sm:px-5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 text-sm font-semibold">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-4 px-4 sm:px-5 font-mono font-bold text-blue-700">{log.id}</td>
                  <td className="py-4 px-4 sm:px-5">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-mono text-xs font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-5 text-slate-900 font-medium">{log.user}</td>
                  <td className="py-4 px-4 sm:px-5 text-emerald-800 font-mono font-bold">{log.entity}</td>
                  <td className="py-4 px-4 sm:px-5 text-slate-500 font-mono text-xs sm:text-sm">{log.timestamp}</td>
                  <td className="py-4 px-4 sm:px-5 text-slate-700 font-medium">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

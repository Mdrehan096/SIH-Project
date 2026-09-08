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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <ScrollText className="w-5 h-5 text-sky-400" />
          <span>System Audit Trail & Operational Compliance Logs</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Immutable audit record of block creations, PN authorizations, controller overrides, and risk predictions.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3.5">Log ID</th>
              <th className="p-3.5">Action Event</th>
              <th className="p-3.5">User Role</th>
              <th className="p-3.5">Entity Reference</th>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {mockAuditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 text-sky-400 font-bold">{log.id}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40 text-[10px]">
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5 text-slate-200">{log.user}</td>
                <td className="p-3.5 text-emerald-400">{log.entity}</td>
                <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                <td className="p-3.5 text-slate-300 font-sans">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

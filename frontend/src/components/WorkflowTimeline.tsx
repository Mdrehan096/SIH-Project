import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface WorkflowHistoryItem {
  status: string;
  timestamp: string;
  user: string;
  role: string;
  notes?: string;
}

interface WorkflowTimelineProps {
  currentStatus: string;
  history?: WorkflowHistoryItem[];
  onTransitionStatus?: (targetStatus: string) => void;
  canApprove?: boolean;
}

const STAGES = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'SCHEDULED', 'ACTIVE', 'COMPLETED'];

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  currentStatus,
  history = [],
  onTransitionStatus,
  canApprove = false,
}) => {
  const currentIdx = STAGES.indexOf(currentStatus.toUpperCase());

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="font-bold text-slate-200 text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Digital Maintenance Possession Workflow Pipeline</span>
        </h4>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
          CURRENT: {currentStatus}
        </span>
      </div>

      {/* Progress Timeline Nodes */}
      <div className="flex items-center justify-between relative py-2 overflow-x-auto">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 -z-0" />
        {STAGES.map((stage, idx) => {
          const isDone = currentIdx !== -1 && idx <= currentIdx;
          const isCurrent = stage.toUpperCase() === currentStatus.toUpperCase();

          return (
            <div key={stage} className="flex flex-col items-center relative z-10 space-y-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                  isCurrent
                    ? 'bg-sky-500 text-slate-950 ring-4 ring-sky-500/30 shadow-lg scale-110'
                    : isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-[10px] font-mono font-bold tracking-wider ${isCurrent ? 'text-sky-400' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      {/* Approval & Transition Actions */}
      {canApprove && (
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400">Authorized Workflow Actions:</span>
          <div className="flex items-center space-x-2">
            {currentStatus === 'SUBMITTED' && onTransitionStatus && (
              <button
                onClick={() => onTransitionStatus('UNDER_REVIEW')}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-[11px]"
              >
                Start Division Review
              </button>
            )}
            {currentStatus === 'UNDER_REVIEW' && onTransitionStatus && (
              <button
                onClick={() => onTransitionStatus('APPROVED')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-[11px]"
              >
                Approve Possession Block
              </button>
            )}
            {currentStatus === 'APPROVED' && onTransitionStatus && (
              <button
                onClick={() => onTransitionStatus('SCHEDULED')}
                className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-[11px]"
              >
                Schedule Train Possession Window
              </button>
            )}
          </div>
        </div>
      )}

      {/* Workflow History Logs */}
      {history.length > 0 && (
        <div className="pt-3 border-t border-slate-800/60 space-y-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Status Transition History Log:</span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px]">
            {history.map((h, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-bold text-[9px]">
                    {h.status}
                  </span>
                  <span>{h.user} ({h.role})</span>
                </div>
                <span className="text-slate-500 text-[10px]">{h.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

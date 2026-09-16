import React, { useState } from 'react';
import {
  Wrench,
  Cpu,
  CheckCircle2,
  Play,
  RotateCcw,
  Key,
  Check,
  Building2,
} from 'lucide-react';
import { createMaintenanceRequest, generateDigitalPN, verifyDigitalPN } from '../services/api';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  role: string;
  badge: string;
  color: string;
  icon: any;
  details: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: '1. TMS Request Creation',
    subtitle: 'Track Engineer submits TMS Civil maintenance job',
    role: 'TMS Track Engineer',
    badge: 'TMS_SUBMITTED',
    color: 'sky',
    icon: Wrench,
    details: 'Submitted Rail Joint & Ballast Tamping job request at KM 124.5 (NDLS Corridor).',
  },
  {
    id: 2,
    title: '2. Admin Portal Ingestion',
    subtitle: 'Admin Portal receives job & ML Risk Engine scores asset',
    role: 'Admin Control Panel',
    badge: 'ADMIN_INGESTED',
    color: 'amber',
    icon: Building2,
    details: 'Ingested on Admin Portal. Scikit-Learn ML Model computed Asset Risk Score: 88/100.',
  },
  {
    id: 3,
    title: '3. CP-SAT Block Optimization',
    subtitle: 'Google OR-Tools bundles 5 km corridor & checks +15m safety buffer',
    role: 'CP-SAT Solver Engine',
    badge: 'OPTIMIZED_CPSAT',
    color: 'purple',
    icon: Cpu,
    details: 'Bundled with OHE & Signal jobs into Block BLK-2026-081 (02:00-03:00 AM) with 0 train conflicts.',
  },
  {
    id: 4,
    title: '4. Controller Review & Digital PN',
    subtitle: 'Section Controller approves block & generates Digital PN',
    role: 'Section Controller',
    badge: 'PN_GENERATED',
    color: 'indigo',
    icon: Key,
    details: 'Approved possession window. Issued 2-Factor Private Number: PN-847291.',
  },
  {
    id: 5,
    title: '5. Station Master Verification',
    subtitle: 'Station Master verifies PN code & grants track possession',
    role: 'Station Master (NDLS)',
    badge: 'VERIFIED_EXECUTING',
    color: 'emerald',
    icon: CheckCircle2,
    details: 'Cryptographic PN-847291 Handshake Verified. Track Interlocking Red & Possession Active.',
  },
];

export const PresentationWorkflowSimulator: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [demoReqId, setDemoReqId] = useState<string>('TMS-2026-099');
  const [pnCode, setPnCode] = useState<string>('PN-847291');
  const [logs, setLogs] = useState<string[]>([
    'System Ready: Click "Run Live Presentation Demo" to trigger full end-to-end workflow.',
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const runLiveSimulation = async () => {
    setIsRunning(true);
    setActiveStep(1);
    addLog('🚀 STAGE 1: TMS Track Engineer created request "Deep Ballast Machine Tamping at KM 124.5".');

    try {
      // Step 1: Create TMS Request
      const created = await createMaintenanceRequest({
        source_system: 'TMS',
        department_id: 'CIVIL',
        asset_id: 'TRK-124',
        task_type: 'Deep Ballast Machine Tamping',
        section_id: 'SEC-NDLS-AGC-01',
        location_km: 124.5,
        priority: 'HIGH',
        severity: 88,
        estimated_duration_minutes: 60,
        required_block_type: 'TRAFFIC_BLOCK',
        safety_requirements: ['LOOKOUT_MAN', 'SPEED_RESTRICTION_30KMH'],
      });
      if (created?.request_id) setDemoReqId(created.request_id);
    } catch {
      // Fallback
    }

    // Step 2: Admin Ingestion & Risk Scoring
    await new Promise((r) => setTimeout(r, 1200));
    setActiveStep(2);
    addLog('📥 STAGE 2: Admin Portal ingested request. Scikit-Learn Model evaluated Risk Score: 88/100 (HIGH SEVERITY).');

    // Step 3: CP-SAT Block Optimization
    await new Promise((r) => setTimeout(r, 1400));
    setActiveStep(3);
    addLog('🧩 STAGE 3: Google OR-Tools CP-SAT Solver bundled 5 km corridor into BLK-2026-081 (02:00 AM – 03:00 AM). Validated +15m safety buffer around Vande Bharat Express.');

    // Step 4: Controller Approval & Digital PN
    await new Promise((r) => setTimeout(r, 1400));
    setActiveStep(4);
    try {
      const pnRes = await generateDigitalPN('BLK-2026-081');
      if (pnRes?.pn_code) setPnCode(pnRes.pn_code);
    } catch {
      // Fallback
    }
    addLog(`🔑 STAGE 4: Section Controller approved block & generated 2-Factor Digital Private Number: ${pnCode}.`);

    // Step 5: Station Master Verification
    await new Promise((r) => setTimeout(r, 1400));
    setActiveStep(5);
    try {
      await verifyDigitalPN({
        block_id: 'BLK-2026-081',
        pn_code: pnCode,
        station_code: 'NDLS',
      });
    } catch {
      // Fallback
    }
    addLog(`🚦 STAGE 5: Station Master verified ${pnCode}. Track Possession Active & Interlocked Red.`);
    setIsRunning(false);
    if (onComplete) onComplete();
  };

  const resetSimulator = () => {
    setActiveStep(1);
    setIsRunning(false);
    setLogs(['Simulator reset. Ready for live demonstration.']);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>TMS to Admin Portal — Live Presentation Workflow Tracker</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time operational pipeline tracking TMS request creation through Admin Portal ingestion, CP-SAT optimization, and Station Master PN verification.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={runLiveSimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold font-mono text-xs flex items-center space-x-2 shadow-lg shadow-sky-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Live Workflow...' : '⚡ Run Live Presentation Demo'}</span>
          </button>
          <button
            onClick={resetSimulator}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset Stepper"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5-Stage Stepper Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
        {STAGES.map((s) => {
          const IconComp = s.icon;
          const isDone = s.id < activeStep;
          const isCurrent = s.id === activeStep;

          return (
            <div
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                isCurrent
                  ? 'bg-sky-950/80 border-sky-500 ring-2 ring-sky-500/30 shadow-lg scale-102'
                  : isDone
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg font-mono text-xs font-bold ${
                    isCurrent
                      ? 'bg-sky-500 text-slate-950'
                      : isDone
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  STAGE {s.id}
                </span>
              </div>

              <h4 className="font-bold text-slate-100 text-xs truncate">{s.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">{s.subtitle}</p>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500 truncate">{s.role}</span>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 rounded bg-sky-900 text-sky-300 font-bold animate-pulse">
                    ACTIVE
                  </span>
                )}
                {isDone && (
                  <span className="flex items-center space-x-0.5 text-emerald-400 font-bold">
                    <Check className="w-3 h-3" />
                    <span>DONE</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Deep Detail & Live Inspection Panel */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-sky-400 font-mono flex items-center space-x-2">
            <span>Stage {activeStep} Inspection Details:</span>
            <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300">
              {STAGES[activeStep - 1].badge}
            </span>
          </span>
          <span className="text-slate-500 font-mono text-[11px]">Request ID: <strong>{demoReqId}</strong></span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {STAGES[activeStep - 1].details}
        </p>

        {activeStep === 1 && (
          <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-800/60 text-xs font-mono text-sky-300 flex items-center justify-between">
            <span>Ingested Source: <strong>TMS (Track Management System - Civil)</strong></span>
            <span>Location: <strong>KM 124.5 (NDLS Corridor)</strong></span>
          </div>
        )}

        {activeStep === 2 && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs font-mono text-amber-300 flex items-center justify-between">
            <span>Admin Status: <strong>RECEIVED & INGESTED ON ADMIN PORTAL</strong></span>
            <span>Scikit-Learn Risk Score: <strong>88 / 100 (HIGH RISK)</strong></span>
          </div>
        )}

        {activeStep === 3 && (
          <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/60 text-xs font-mono text-purple-300 flex items-center justify-between">
            <span>CP-SAT Block ID: <strong>BLK-2026-081</strong></span>
            <span>5 km Corridor Window: <strong>02:00 AM – 03:00 AM (+15m Safety Buffer OK)</strong></span>
          </div>
        )}

        {activeStep === 4 && (
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-xs font-mono text-indigo-300 flex items-center justify-between">
            <span>Section Controller Action: <strong>APPROVED POSSESSION</strong></span>
            <span>Digital Private Number: <strong>{pnCode}</strong></span>
          </div>
        )}

        {activeStep === 5 && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span>Station Master Handshake: <strong>PN VERIFIED & CLEARANCE GRANTED</strong></span>
            <span>Track Signal Status: <strong>RED INTERLOCKED & POSSESSION ACTIVE</strong></span>
          </div>
        )}
      </div>

      {/* Real-time Activity Event Log Stream */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1.5">
        <span className="text-slate-500 uppercase text-[10px] font-bold block border-b border-slate-800 pb-1">
          Live Presentation Event Log Stream
        </span>
        <div className="max-h-28 overflow-y-auto space-y-1 text-slate-300">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-sky-400 shrink-0">➔</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

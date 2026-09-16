import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('admin@retrack.gov.in');
  const [password, setPassword] = useState<string>('admin123');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/');
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans text-slate-100 relative overflow-hidden">
      {/* Background Decorator Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top NIC / Government Branding Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-sky-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-sky-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-white flex items-center space-x-2">
              <span>RETRACK – RailSync-AI</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
                GOVT ENTERPRISE PORTAL
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Indian Railways Operations & Maintenance Command Platform • SIH PS 26027
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NIC Standard Security Enforced</span>
        </div>
      </header>

      {/* Main Form Center Panel */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl w-full">
          {/* Left Welcome Info */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Multi-Department Joint Maintenance Possession System
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centralized decision-support platform aggregating Civil (TMS), Track Defects (TDMS), and Electrical/S&T (SMMS) maintenance requests with Google OR-Tools CP-SAT block optimization and Mapbox live train tracking.
              </p>
            </div>

            {/* Quick Demo Credentials Selection Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-sky-400" />
                <span>Select Demo Officer Account:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@retrack.gov.in', 'admin123')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-800 text-left transition-all"
                >
                  <div className="font-bold text-sky-400">Chief Admin (IRHQ)</div>
                  <div className="text-[10px] text-slate-500">admin@retrack.gov.in</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('officer@retrack.gov.in', 'officer123')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-800 text-left transition-all"
                >
                  <div className="font-bold text-amber-400">Divisional Manager</div>
                  <div className="text-[10px] text-slate-500">officer@retrack.gov.in</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('engineer@retrack.gov.in', 'engineer123')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-800 text-left transition-all"
                >
                  <div className="font-bold text-emerald-400">Track Engineer</div>
                  <div className="text-[10px] text-slate-500">engineer@retrack.gov.in</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('viewer@retrack.gov.in', 'viewer123')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-800 text-left transition-all"
                >
                  <div className="font-bold text-purple-400">Auditor (Viewer)</div>
                  <div className="text-[10px] text-slate-500">viewer@retrack.gov.in</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Login Card */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Officer Authentication Portal</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your official Railway Credentials to log in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Government Email / Employee ID:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                    placeholder="officer@retrack.gov.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Password:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'AUTHENTICATING...' : 'SECURE OFFICER LOGIN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-8 py-3 text-center text-[11px] text-slate-500 font-mono z-10">
        RETRACK – RailSync-AI Decision Support System • Ministry of Railways Government Enterprise Application • Version 1.0.0
      </footer>
    </div>
  );
};

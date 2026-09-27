import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, TrainTrack } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 relative">
      {/* Top NIC / Government Header Bar */}
      <header className="bg-[#092b4c] border-b-4 border-amber-500 px-6 sm:px-10 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2.5 rounded-2xl border border-white/20 text-white shrink-0 shadow-xs">
            <TrainTrack className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-black text-xl sm:text-2xl tracking-wide text-white">
                RETRACK
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950">
                GOVT PORTAL
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              Ministry of Railways • Centralized Possession Decision-Support Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/60 px-4 py-1.5 rounded-xl border border-emerald-700/50 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>NIC Certified Security</span>
        </div>
      </header>

      {/* Main Form Center Panel */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl w-full items-center">
          {/* Left Welcome Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 inline-block">
                GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                AI-Powered Automatic Block Planning System
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Integrated decision-support platform aggregating Civil (TMS), Track Defects (TDMS), and Electrical/S&T (SMMS) maintenance requests with Google OR-Tools CP-SAT block optimization and 2-factor Digital PN handshakes.
              </p>
            </div>

            {/* Quick Demo Credentials Selection Box */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <UserCheck className="w-5 h-5 text-blue-700" />
                <span>Quick Fill Demo Officer Credentials:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@retrack.gov.in', 'admin123')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all cursor-pointer shadow-2xs"
                >
                  <div className="font-bold text-blue-900 text-sm">Chief Admin (IRHQ)</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">admin@retrack.gov.in</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('officer@retrack.gov.in', 'officer123')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all cursor-pointer shadow-2xs"
                >
                  <div className="font-bold text-amber-900 text-sm">Divisional Manager</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">officer@retrack.gov.in</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('engineer@retrack.gov.in', 'engineer123')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all cursor-pointer shadow-2xs"
                >
                  <div className="font-bold text-emerald-900 text-sm">Track Engineer</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">engineer@retrack.gov.in</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('viewer@retrack.gov.in', 'viewer123')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left transition-all cursor-pointer shadow-2xs"
                >
                  <div className="font-bold text-purple-900 text-sm">Auditor (Viewer)</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">viewer@retrack.gov.in</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Login Card */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-2xl font-extrabold text-slate-900">Officer Secure Login</h3>
              <p className="text-sm text-slate-600 mt-1 font-medium">Enter your official Railway credentials to access the console.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Government Email / ID:
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm sm:text-base font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    placeholder="officer@retrack.gov.in"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Password:
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm sm:text-base font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-13 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer active:scale-98"
              >
                <span>{loading ? 'AUTHENTICATING...' : 'SECURE OFFICER LOGIN'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-slate-200 px-8 py-5 text-center text-xs text-slate-600 font-semibold z-10">
        RETRACK – RailSync-AI Decision Support System • Ministry of Railways Government Enterprise Application • Compliant with GIGW 3.0 & STQC
      </footer>
    </div>
  );
};

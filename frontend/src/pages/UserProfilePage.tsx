import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, ShieldCheck, Mail, Building, MapPin, BadgeCheck, Lock } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ACTIVE CREDENTIAL
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                OFFICIAL RAILWAY PORTAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Railway Officer Profile & Security Credentials
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Official Railway Enterprise User Profile, Role Permissions, and Divisional Assignment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Officer Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5 text-center shadow-xs">
          <div className="w-24 h-24 rounded-full bg-blue-700 text-white font-black text-3xl mx-auto flex items-center justify-center shadow-md">
            {user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{user.full_name}</h3>
            <p className="text-sm sm:text-base text-blue-700 font-mono font-bold mt-1">{user.employee_id}</p>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
            {user.role}
          </span>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2.5">
              <BadgeCheck className="w-6 h-6 text-blue-700" />
              <span>Official Assignment Credentials</span>
            </h4>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
              ACTIVE ACCOUNT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block">Government Email</span>
                <span className="font-mono font-bold text-slate-900 text-sm sm:text-base block mt-0.5">{user.email}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block">Department</span>
                <span className="font-mono font-bold text-slate-900 text-sm sm:text-base block mt-0.5">{user.department_id}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block">Zone & Division</span>
                <span className="font-mono font-bold text-slate-900 text-sm sm:text-base block mt-0.5">{user.zone} • {user.division}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block">Station Code</span>
                <span className="font-mono font-bold text-blue-800 text-sm sm:text-base block mt-0.5">{user.station_code}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-sm text-blue-950 font-semibold flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0" />
            <span>Role Permissions Verified: Full authorization for Maintenance Planning, CP-SAT Solver, PN Handshake & Audit Logs.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

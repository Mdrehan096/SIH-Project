import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, ShieldCheck, Mail, Building, MapPin, BadgeCheck, Lock } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-sky-400" />
          <span>Railway Officer Profile & Security Credentials</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Official Railway Enterprise User Profile, Role Permissions, and Divisional Assignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Officer Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 border-4 border-slate-800 mx-auto flex items-center justify-center text-white font-extrabold text-2xl shadow-xl">
            {user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{user.full_name}</h3>
            <p className="text-xs text-sky-400 font-mono mt-0.5">{user.employee_id}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block">
            {user.role}
          </span>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-slate-200 text-sm flex items-center space-x-2">
              <BadgeCheck className="w-4 h-4 text-sky-400" />
              <span>Official Assignment Credentials</span>
            </h4>
            <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
              ACTIVE ACCOUNT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Government Email</span>
                <span className="font-mono font-semibold text-slate-200">{user.email}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <Building className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Department</span>
                <span className="font-mono font-semibold text-slate-200">{user.department_id}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Zone & Division</span>
                <span className="font-mono font-semibold text-slate-200">{user.zone} • {user.division}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <Lock className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Station Code</span>
                <span className="font-mono font-semibold text-sky-400">{user.station_code}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-800/30 text-xs text-sky-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role Permissions Verified: Access authorized for Maintenance Planning, CP-SAT Solver, PN Handshake & Audit Logs.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">403 – Access Denied</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
          Your officer role (<strong className="text-amber-400 font-mono">{user.role}</strong>) does not have authorization to view or execute actions on this portal module.
        </p>
        <div className="pt-2 text-[11px] font-mono text-slate-500">
          Required permissions: {allowedRoles.join(', ')}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

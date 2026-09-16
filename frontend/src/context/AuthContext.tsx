import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department_id: string;
  zone: string;
  division: string;
  employee_id: string;
  station_code: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (allowedRoles: string[]) => boolean;
}

const DEFAULT_USER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@retrack.gov.in',
  full_name: 'Chief Operations Admin (IRHQ)',
  role: 'SUPER_ADMIN',
  department_id: 'CIVIL',
  zone: 'NR',
  division: 'Delhi Division',
  employee_id: 'IR-SUPER-001',
  station_code: 'HQ-NDLS',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  token: null,
  login: async () => false,
  logout: () => {},
  hasRole: () => true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('retrack_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('retrack_token') || 'demo-access-token';
  });

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (response.ok) {
        const data = await response.json();
        const userObj: UserProfile = {
          id: data.user?.id || '001',
          email: data.user?.email || email,
          full_name: data.user?.full_name || 'Railway Officer',
          role: data.user?.role || 'RAILWAY_OFFICER',
          department_id: data.user?.department_id || 'CIVIL',
          zone: data.user?.zone || 'NR',
          division: data.user?.division || 'Delhi Division',
          employee_id: data.user?.employee_id || 'IR-OFF-101',
          station_code: data.user?.station_code || 'NDLS',
        };

        setUser(userObj);
        setToken(data.access_token || 'access-token');
        localStorage.setItem('retrack_user', JSON.stringify(userObj));
        localStorage.setItem('retrack_token', data.access_token || 'access-token');
        return true;
      }
    } catch {
      // Fallback local authentication for hackathon demo credentials
    }

    // Demo fallback check
    let demoRole = 'RAILWAY_OFFICER';
    let demoName = 'Railway Operations Officer';

    if (email.includes('admin')) {
      demoRole = 'SUPER_ADMIN';
      demoName = 'Chief Operations Admin (IRHQ)';
    } else if (email.includes('zone')) {
      demoRole = 'ZONE_ADMIN';
      demoName = 'Zonal Principal Engineer (NR)';
    } else if (email.includes('officer')) {
      demoRole = 'DIVISION_ADMIN';
      demoName = 'Senior Divisional Operations Manager';
    } else if (email.includes('engineer')) {
      demoRole = 'ENGINEER';
      demoName = 'Senior Track & P-Way Engineer';
    } else if (email.includes('viewer')) {
      demoRole = 'VIEWER';
      demoName = 'Auditor & Operations Inspector';
    }

    const demoUser: UserProfile = {
      id: '00000000-0000-0000-0000-000000000001',
      email,
      full_name: demoName,
      role: demoRole,
      department_id: 'CIVIL',
      zone: 'NR',
      division: 'Delhi Division',
      employee_id: 'IR-DEMO-001',
      station_code: 'NDLS',
    };

    setUser(demoUser);
    setToken('demo-token');
    localStorage.setItem('retrack_user', JSON.stringify(demoUser));
    localStorage.setItem('retrack_token', 'demo-token');
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('retrack_user');
    localStorage.removeItem('retrack_token');
  };

  const hasRole = (allowedRoles: string[]) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

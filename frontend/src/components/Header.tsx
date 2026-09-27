import React, { useEffect, useState, useRef } from 'react';
import {
  Search,
  Bell,
  User,
  LogOut,
  Sliders,
  ShieldCheck,
  ChevronDown,
  Calendar,
  TrainFront,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalSearch } from './GlobalSearch';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState<boolean>(false);
  const [zoneMenuOpen, setZoneMenuOpen] = useState<boolean>(false);
  const [divMenuOpen, setDivMenuOpen] = useState<boolean>(false);

  const [selectedZone, setSelectedZone] = useState<string>('North Central Railway');
  const [selectedDiv, setSelectedDiv] = useState<string>('Delhi Division');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (zoneRef.current && !zoneRef.current.contains(event.target as Node)) {
        setZoneMenuOpen(false);
      }
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setDivMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time live IST clock updating every 1000ms
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const zonesList = [
    'North Central Railway',
    'Northern Railway',
    'Western Railway',
    'East Central Railway',
    'Southern Railway',
  ];

  const divisionsList = [
    'Delhi Division',
    'Agra Division',
    'Jhansi Division',
    'Prayagraj Division',
    'Ambala Division',
  ];

  // Sample recent alerts for high-visibility notification dropdown
  const headerAlerts = [
    {
      id: 'A1',
      title: 'Critical Asset Risk Warning',
      desc: 'Asset TRK-124 (KM 124.5) exceeded 75.0 risk score threshold.',
      time: '10m ago',
      type: 'CRITICAL',
    },
    {
      id: 'A2',
      title: 'Block Approval Requested',
      desc: 'Block BLK-2026-081 awaiting Divisional Operations Manager review.',
      time: '25m ago',
      type: 'WARNING',
    },
    {
      id: 'A3',
      title: 'Digital PN-847291 Verified',
      desc: 'Station Master verified Works Possession for Worksite #3.',
      time: '1h ago',
      type: 'SUCCESS',
    },
  ];

  return (
    <>
      <header className="h-18 sm:h-20 bg-[#092b4c] border-b border-[#14385f] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md select-none">
        {/* Left: Train Brand Mark + RETRACK + Divider + Portal Name */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 text-left group focus:outline-none cursor-pointer"
          >
            <TrainFront className="w-8 h-8 text-amber-500 flex-shrink-0 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-white tracking-wider leading-none">
                RETRACK
              </span>
              <span className="text-xs sm:text-sm text-slate-200 font-medium leading-tight truncate mt-0.5">
                AI-Powered Automatic Block Planning
              </span>
            </div>
          </button>

          {/* Vertical Separator */}
          <div className="h-8 w-px bg-slate-400/40 hidden md:block flex-shrink-0" />

          {/* Indian Railways · Operations Portal */}
          <div className="hidden md:flex items-center">
            <span className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
              Indian Railways · Operations Portal
            </span>
          </div>
        </div>

        {/* Right Section: Zone Pill + Division Pill + Date/Clock Pill + Search Pill + Bell + Avatar */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
          {/* Zone Selector Pill */}
          <div className="relative hidden xl:block" ref={zoneRef}>
            <button
              onClick={() => setZoneMenuOpen(!zoneMenuOpen)}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-800 h-11 px-4 rounded-lg text-sm font-semibold border border-slate-200 shadow-xs cursor-pointer transition-colors"
            >
              <span className="truncate max-w-[140px]">{selectedZone}</span>
              <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </button>

            {zoneMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-sm animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  Select Railway Zone
                </div>
                {zonesList.map((z) => (
                  <button
                    key={z}
                    onClick={() => {
                      setSelectedZone(z);
                      setZoneMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between text-sm ${
                      selectedZone === z ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{z}</span>
                    {selectedZone === z && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Division Selector Pill */}
          <div className="relative hidden lg:block" ref={divRef}>
            <button
              onClick={() => setDivMenuOpen(!divMenuOpen)}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-800 h-11 px-4 rounded-lg text-sm font-semibold border border-slate-200 shadow-xs cursor-pointer transition-colors"
            >
              <span className="truncate max-w-[120px]">{selectedDiv}</span>
              <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </button>

            {divMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-sm animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  Select Division
                </div>
                {divisionsList.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDiv(d);
                      setDivMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between text-sm ${
                      selectedDiv === d ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{d}</span>
                    {selectedDiv === d && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time Live Clock Pill */}
          <div className="hidden sm:flex items-center space-x-2 bg-white text-slate-800 h-11 px-4 rounded-lg text-sm border border-slate-200 shadow-xs">
            <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span className="text-slate-800 font-sans font-medium whitespace-nowrap text-sm">
              {currentDate || '18 Sep 2026'}
            </span>
            <span className="text-slate-300 font-light px-1">|</span>
            <span className="text-[#092b4c] font-bold font-mono text-sm whitespace-nowrap">
              {currentTime || '13:38'}
            </span>
          </div>

          {/* Global Search Pill */}
          <div
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-2.5 bg-white text-slate-500 hover:text-slate-700 h-11 px-4 rounded-lg border border-slate-200 text-sm w-44 sm:w-60 md:w-72 cursor-pointer shadow-xs transition-colors"
          >
            <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="truncate text-slate-500 text-xs sm:text-sm font-medium">
              Search trains, blocks, assets...
            </span>
          </div>

          {/* Notification Bell with Crimson Red 3 Badge */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="relative p-2.5 rounded-lg hover:bg-white/10 text-white transition-colors flex items-center justify-center cursor-pointer focus:outline-none"
              title="Operational Alerts"
            >
              <Bell className="w-6 h-6 text-white" />
              {/* Crimson Red High-Visibility Badge */}
              <span className="absolute 1 top-0 right-0 w-5 h-5 bg-red-600 text-white font-black text-[10px] rounded-full flex items-center justify-center font-mono shadow-md">
                3
              </span>
            </button>

            {/* Notification Popover Drawer */}
            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Popover Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">Operational Alerts</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                      3 New
                    </span>
                  </div>
                  <button
                    onClick={() => setNotifMenuOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Popover List */}
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {headerAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setNotifMenuOpen(false);
                        navigate('/notifications');
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start space-x-3"
                    >
                      <div
                        className={`p-1.5 rounded-md flex-shrink-0 mt-0.5 ${
                          alert.type === 'CRITICAL'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : alert.type === 'WARNING'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {alert.type === 'CRITICAL' ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : alert.type === 'WARNING' ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-slate-900 truncate">{alert.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                          {alert.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Popover Footer */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                  <button
                    onClick={() => {
                      setNotifMenuOpen(false);
                      navigate('/notifications');
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <span>View All Operational Notifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Officer Circular Avatar SE */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 focus:outline-none"
              title={`${user?.full_name || 'Senior Engineer'} (${user?.role || 'Operations'})`}
            >
              {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'SE'}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-sm text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-slate-900 text-base">{user?.full_name || 'Senior Engineer'}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email || 'operations@nr.railnet.gov.in'}</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center space-x-3 text-slate-700 font-medium"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Officer Profile</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/appearance');
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center space-x-3 text-slate-700 font-medium"
                >
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  <span>Settings</span>
                </button>
                {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full px-4 py-2.5 text-left text-amber-700 hover:bg-amber-50/50 flex items-center space-x-3 font-bold"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Governance Panel</span>
                  </button>
                ) : null}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full px-4 py-2.5 text-left text-rose-600 hover:bg-rose-50/50 flex items-center space-x-3 border-t border-slate-100 mt-1 pt-2.5 font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;

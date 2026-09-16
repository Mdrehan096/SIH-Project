import React, { useEffect, useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Trash2,
  CheckCheck,
  PlusCircle,
  X,
  Send,
  Radio,
  ShieldAlert,
  Info,
  Layers,
} from 'lucide-react';
import { apiClient } from '../services/api';

export interface NotificationItem {
  id: string;
  category: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  department?: string;
}

const INITIAL_NOTIFS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    category: 'CRITICAL_RISK',
    title: 'Critical Asset Risk Warning — NDLS Track #4',
    message: 'Asset TRK-124 (KM 124.5) exceeded 75.0 risk score threshold (84.2/100). Joint possession recommended for immediate rail grinding.',
    timestamp: '10 mins ago',
    read: false,
    severity: 'CRITICAL',
    department: 'CIVIL',
  },
  {
    id: 'NOTIF-002',
    category: 'BLOCK_APPROVAL',
    title: 'Block Approval Requested — SEC-NDLS-AGC-01',
    message: 'Block BLK-2026-081 (02:00 AM - 04:00 AM IST) submitted by S&T Dept requires Divisional Operations Manager signoff.',
    timestamp: '25 mins ago',
    read: false,
    severity: 'WARNING',
    department: 'SIGNAL_TELECOM',
  },
  {
    id: 'NOTIF-003',
    category: 'TRAIN_DELAY',
    title: 'Express Train Delay Advisory',
    message: 'Train 12424 (Dibrugarh Rajdhani) delayed by +12 mins due to automated signal testing at Ghaziabad Junction.',
    timestamp: '45 mins ago',
    read: true,
    severity: 'INFO',
    department: 'OPERATIONS',
  },
  {
    id: 'NOTIF-004',
    category: 'SYSTEM_SECURITY',
    title: 'Digital Private Number (PN) Verified',
    message: 'PN-847291 successfully verified by Station Master (NDLS). Worksite #3 Block is officially ACTIVE.',
    timestamp: '1 hour ago',
    read: true,
    severity: 'SUCCESS',
    department: 'ELECTRICAL',
  },
  {
    id: 'NOTIF-005',
    category: 'WEATHER_ALERT',
    title: 'Dense Fog & Low Visibility Protocol',
    message: 'Fog safety protocol enabled for Delhi-Mathura section. Max permitted speed capped at 60 km/h for freight trains.',
    timestamp: '2 hours ago',
    read: false,
    severity: 'WARNING',
    department: 'OPERATIONS',
  },
  {
    id: 'NOTIF-006',
    category: 'MAINTENANCE_COMPLETE',
    title: 'OHE Catenary Wire Replacement Completed',
    message: 'Electrical Department completed scheduled 90-min power block on Track Line 2 (Tughlakabad yards). Line energized.',
    timestamp: '3 hours ago',
    read: true,
    severity: 'SUCCESS',
    department: 'ELECTRICAL',
  },
];

export const NotificationsPage: React.FC = () => {
  const [notifs, setNotifs] = useState<NotificationItem[]>(INITIAL_NOTIFS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Alert Form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('OPERATIONAL_ALERT');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS'>('WARNING');
  const [newDept, setNewDept] = useState<string>('CIVIL');

  useEffect(() => {
    // Fetch notifications from backend route if available
    apiClient
      .get('/notifications')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Merge server notifications with mock if needed
          const serverNotifs: NotificationItem[] = res.data.map((item: any) => ({
            id: item.id || `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
            category: item.category || 'SYSTEM',
            title: item.title || 'System Notification',
            message: item.message || '',
            timestamp: item.timestamp || 'Just now',
            read: item.read ?? false,
            severity: item.severity || 'INFO',
            department: item.department || 'OPERATIONS',
          }));
          setNotifs(serverNotifs);
        }
      })
      .catch(() => {
        // Fallback to local default state
      });
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifs = () => {
    setNotifs([]);
  };

  const toggleReadStatus = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotif = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCreateNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const created: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      category: newCategory,
      title: newTitle,
      message: newMessage,
      timestamp: 'Just now',
      read: false,
      severity: newSeverity,
      department: newDept,
    };

    setNotifs([created, ...notifs]);
    setNewTitle('');
    setNewMessage('');
    setShowCreateModal(false);
  };

  const filteredNotifs = notifs.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'CRITICAL') return n.severity === 'CRITICAL';
    if (activeFilter === 'WARNING') return n.severity === 'WARNING';
    if (activeFilter === 'INFO') return n.severity === 'INFO';
    if (activeFilter === 'SUCCESS') return n.severity === 'SUCCESS';
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 border border-rose-800 text-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>CRITICAL</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-800 text-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>WARNING</span>
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>RESOLVED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950/80 border border-sky-800 text-sky-300">
            <Info className="w-3 h-3 text-sky-400" />
            <span>ADVISORY</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg backdrop-blur">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-950 border border-sky-800 rounded-xl text-sky-400 shadow">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
                <span>Operational Notification Center</span>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-slate-950 text-xs font-mono font-extrabold shadow">
                    {unreadCount} NEW
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time operational alerts, AI safety triggers, block approval requests, and line status events.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue Alert</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifs.length > 0 && (
            <button
              onClick={clearAllNotifs}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          <span className="text-slate-400 text-xs font-mono px-2 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>Filter:</span>
          </span>
          {[
            { id: 'ALL', label: 'All Alerts', count: notifs.length },
            { id: 'UNREAD', label: 'Unread', count: unreadCount },
            { id: 'CRITICAL', label: 'Critical Risk', count: notifs.filter((n) => n.severity === 'CRITICAL').length },
            { id: 'WARNING', label: 'Warnings', count: notifs.filter((n) => n.severity === 'WARNING').length },
            { id: 'INFO', label: 'Advisories', count: notifs.filter((n) => n.severity === 'INFO').length },
            { id: 'SUCCESS', label: 'Resolved', count: notifs.filter((n) => n.severity === 'SUCCESS').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeFilter === tab.id
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  activeFilter === tab.id ? 'bg-slate-950 text-sky-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-slate-400 px-2 hidden md:block">
          Active Feed: <span className="text-sky-400 font-bold">{filteredNotifs.length} Items</span>
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg divide-y divide-slate-800/80">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No Notifications Match Selected Filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All clear in this category! Check back when operational events occur or issue a custom notification.
            </p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                n.read ? 'bg-slate-900/60 hover:bg-slate-800/40' : 'bg-slate-950 border-l-4 border-sky-500 hover:bg-slate-950/80'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {/* Severity Icon Box */}
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 border ${
                    n.severity === 'CRITICAL'
                      ? 'bg-rose-950/90 border-rose-800 text-rose-400 shadow-rose-950/50 shadow'
                      : n.severity === 'WARNING'
                      ? 'bg-amber-950/90 border-amber-800 text-amber-400 shadow-amber-950/50 shadow'
                      : n.severity === 'SUCCESS'
                      ? 'bg-emerald-950/90 border-emerald-800 text-emerald-400 shadow-emerald-950/50 shadow'
                      : 'bg-sky-950/90 border-sky-800 text-sky-400 shadow-sky-950/50 shadow'
                  }`}
                >
                  {n.severity === 'CRITICAL' ? (
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  ) : n.severity === 'WARNING' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : n.severity === 'SUCCESS' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Radio className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{n.title}</span>
                    {getSeverityBadge(n.severity)}
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {n.category}
                    </span>
                    {n.department && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-950 text-sky-300 border border-sky-800/60 flex items-center space-x-1">
                        <Layers className="w-2.5 h-2.5" />
                        <span>{n.department}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{n.message}</p>

                  <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-400 pt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{n.timestamp}</span>
                    </div>
                    <span>•</span>
                    <span className="text-slate-400 font-mono">ID: {n.id}</span>
                  </div>
                </div>
              </div>

              {/* Individual Notification Actions */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-start">
                <button
                  onClick={() => toggleReadStatus(n.id)}
                  title={n.read ? 'Mark as Unread' : 'Mark as Read'}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    n.read
                      ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      : 'bg-sky-950 border-sky-800 text-sky-400 hover:bg-sky-900'
                  }`}
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNotif(n.id)}
                  title="Delete Notification"
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Issue Custom Operational Alert */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Send className="w-4 h-4 text-sky-400" />
                <span>Issue Operational Broadcast Alert</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotif} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Signal Testing at Ghaziabad"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e: any) => setNewSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="WARNING">WARNING</option>
                    <option value="INFO">INFO / ADVISORY</option>
                    <option value="SUCCESS">RESOLVED / SUCCESS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="CIVIL">CIVIL (Engineering)</option>
                    <option value="SIGNAL_TELECOM">SIGNAL & TELECOM</option>
                    <option value="ELECTRICAL">ELECTRICAL (TRD)</option>
                    <option value="OPERATIONS">OPERATIONS CONTROL</option>
                    <option value="SAFETY">SAFETY CELL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Code</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail operational guidelines, speed limits, or block requirements..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

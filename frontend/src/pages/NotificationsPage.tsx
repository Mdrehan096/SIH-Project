import React, { useState } from 'react';
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
];

export const NotificationsPage: React.FC = () => {
  const [notifs, setNotifs] = useState<NotificationItem[]>(INITIAL_NOTIFS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State for Custom Notification
  const [newTitle, setNewTitle] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS'>('WARNING');
  const [newDept, setNewDept] = useState<string>('OPERATIONS');
  const [newCategory] = useState<string>('OPERATIONAL_ALERT');

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifs = () => {
    setNotifs([]);
  };

  const toggleReadStatus = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-bold bg-rose-50 border border-rose-200 text-rose-800">
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>CRITICAL</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-bold bg-amber-50 border border-amber-200 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>WARNING</span>
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>RESOLVED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 border border-blue-200 text-blue-800">
            <Info className="w-4 h-4 text-blue-600" />
            <span>ADVISORY</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 text-slate-800">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Operational Notification Center
              </h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs sm:text-sm font-mono font-black shadow-xs">
                  {unreadCount} UNREAD
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Real-time operational alerts, AI safety triggers, block approval requests, and line status events.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="h-11 sm:h-12 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Issue Alert</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="h-11 sm:h-12 px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifs.length > 0 && (
            <button
              onClick={clearAllNotifs}
              className="h-11 sm:h-12 px-5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-slate-600 text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter className="w-4 h-4 text-blue-700" />
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
              className={`h-10 sm:h-11 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
                  activeFilter === tab.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="text-sm font-mono text-slate-500 font-semibold hidden md:block">
          Active Feed: <span className="text-blue-700 font-bold">{filteredNotifs.length} Items</span>
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
        {filteredNotifs.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Notifications Match Selected Filter</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              All clear in this category! Check back when operational events occur or issue a custom notification.
            </p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-5 transition-colors ${
                n.severity === 'CRITICAL'
                  ? 'bg-rose-50/40 hover:bg-rose-50/70 border-l-4 border-l-rose-600'
                  : n.severity === 'WARNING'
                  ? 'bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-amber-500'
                  : n.severity === 'SUCCESS'
                  ? 'bg-emerald-50/40 hover:bg-emerald-50/70 border-l-4 border-l-emerald-600'
                  : 'bg-blue-50/40 hover:bg-blue-50/70 border-l-4 border-l-blue-600'
              } ${n.read ? 'opacity-80' : 'font-semibold'}`}
            >
              <div className="flex items-start gap-4">
                {/* Severity Icon Box */}
                <div
                  className={`w-12 h-12 rounded-xl shrink-0 mt-0.5 border flex items-center justify-center shadow-xs ${
                    n.severity === 'CRITICAL'
                      ? 'bg-rose-100 border-rose-200 text-rose-700'
                      : n.severity === 'WARNING'
                      ? 'bg-amber-100 border-amber-200 text-amber-700'
                      : n.severity === 'SUCCESS'
                      ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
                      : 'bg-blue-100 border-blue-200 text-blue-700'
                  }`}
                >
                  {n.severity === 'CRITICAL' ? (
                    <ShieldAlert className="w-6 h-6" />
                  ) : n.severity === 'WARNING' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : n.severity === 'SUCCESS' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Radio className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-extrabold text-slate-900 text-base sm:text-lg">{n.title}</span>
                    {getSeverityBadge(n.severity)}
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {n.category}
                    </span>
                    {n.department && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{n.department}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">{n.message}</p>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{n.timestamp}</span>
                    </span>
                    <span>•</span>
                    <span>Ref: {n.id}</span>
                  </div>
                </div>
              </div>

              {/* Read / Unread Toggle Button */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0 self-end sm:self-start">
                <button
                  onClick={() => toggleReadStatus(n.id)}
                  className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-colors shadow-xs cursor-pointer ${
                    n.read
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      : 'bg-blue-700 hover:bg-blue-800 text-white border-blue-700'
                  }`}
                >
                  {n.read ? 'Mark Unread' : 'Mark as Read'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Issue Custom Alert */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5 font-extrabold text-lg sm:text-xl">
                <PlusCircle className="w-6 h-6 text-blue-700" />
                <span>Issue Operational Advisory / Alert</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateNotif} className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alert Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Joint Track & Signal Possession Required"
                  className="w-full h-11 sm:h-12 bg-white border border-slate-300 rounded-xl px-4 text-slate-900 font-semibold text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Severity Level
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e: any) => setNewSeverity(e.target.value)}
                    className="w-full h-11 sm:h-12 bg-white border border-slate-300 rounded-xl px-4 text-slate-900 font-semibold text-sm focus:outline-none focus:border-blue-600"
                  >
                    <option value="CRITICAL">CRITICAL RISK</option>
                    <option value="WARNING">OPERATIONAL WARNING</option>
                    <option value="INFO">GENERAL ADVISORY</option>
                    <option value="SUCCESS">RESOLVED / COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full h-11 sm:h-12 bg-white border border-slate-300 rounded-xl px-4 text-slate-900 font-semibold text-sm focus:outline-none focus:border-blue-600"
                  >
                    <option value="OPERATIONS">OPERATIONS</option>
                    <option value="CIVIL">CIVIL (TRACK)</option>
                    <option value="ELECTRICAL">ELECTRICAL (OHE)</option>
                    <option value="SIGNAL_TELECOM">S&T (SIGNALLING)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alert Message / Instruction
                </label>
                <textarea
                  required
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Detailed context, location KM, affected train numbers, speed restriction requirements..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-900 font-semibold text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-11 px-5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

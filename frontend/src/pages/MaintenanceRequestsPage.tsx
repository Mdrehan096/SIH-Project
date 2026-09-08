import React, { useEffect, useState } from 'react';
import { fetchMaintenanceRequests, createMaintenanceRequest } from '../services/api';
import { MaintenanceRequest, Department } from '../types';
import { Wrench, Plus, Filter, Search, X, Check } from 'lucide-react';

const defaultRequests: MaintenanceRequest[] = [
  { id: '1', request_id: 'TMS-001', source_system: 'TMS', department_id: 'CIVIL', asset_id: 'TRK-120', task_type: 'Mainline Rail Joint Replacement', location_km: 120.0, priority: 'HIGH', severity: 78, estimated_duration_minutes: 45, required_block_type: 'TRAFFIC_BLOCK', safety_requirements: ['SPEED_RESTRICTION_30KMH'], status: 'BUNDLED', created_at: '2026-09-06T10:00:00Z' },
  { id: '2', request_id: 'TDMS-002', source_system: 'TDMS', department_id: 'CIVIL', asset_id: 'TRK-122', task_type: 'Ultrasonic Micro-Crack Grind', location_km: 122.0, priority: 'MEDIUM', severity: 62, estimated_duration_minutes: 30, required_block_type: 'TRAFFIC_BLOCK', safety_requirements: ['LOOKOUT_MAN'], status: 'BUNDLED', created_at: '2026-09-06T10:15:00Z' },
  { id: '3', request_id: 'SMMS-003', source_system: 'SMMS', department_id: 'ELECTRICAL', asset_id: 'OHE-124', task_type: 'OHE Catenary Wire Tension Check', location_km: 124.2, priority: 'HIGH', severity: 82, estimated_duration_minutes: 40, required_block_type: 'POWER_BLOCK', safety_requirements: ['DISCONNECT_OHE_FEED'], status: 'BUNDLED', created_at: '2026-09-06T10:30:00Z' },
  { id: '4', request_id: 'TMS-004', source_system: 'TMS', department_id: 'CIVIL', asset_id: 'TRK-124', task_type: 'Deep Ballast Machine Tamping', location_km: 124.5, priority: 'CRITICAL', severity: 90, estimated_duration_minutes: 60, required_block_type: 'INTEGRATED_BLOCK', safety_requirements: ['TRACK_BLOCK', 'POWER_BLOCK'], status: 'BUNDLED', created_at: '2026-09-06T11:00:00Z' },
  { id: '5', request_id: 'SMMS-005', source_system: 'SMMS', department_id: 'SIGNAL_TELECOM', asset_id: 'SIG-125', task_type: 'Automatic Signal Relay Inspection', location_km: 125.0, priority: 'MEDIUM', severity: 55, estimated_duration_minutes: 30, required_block_type: 'TRAFFIC_BLOCK', safety_requirements: ['MANUAL_SIGNALLING'], status: 'BUNDLED', created_at: '2026-09-06T11:20:00Z' },
  { id: '6', request_id: 'TMS-006', source_system: 'TMS', department_id: 'CIVIL', asset_id: 'TRK-126', task_type: 'Sleeper Bolt Fastening & Alignment', location_km: 126.0, priority: 'LOW', severity: 35, estimated_duration_minutes: 25, required_block_type: 'TRAFFIC_BLOCK', safety_requirements: ['NONE'], status: 'BUNDLED', created_at: '2026-09-06T11:45:00Z' },
  { id: '7', request_id: 'TDMS-007', source_system: 'TDMS', department_id: 'CIVIL', asset_id: 'TRK-128', task_type: 'Alumino-Thermic Weld Grinding', location_km: 128.5, priority: 'HIGH', severity: 74, estimated_duration_minutes: 35, required_block_type: 'TRAFFIC_BLOCK', safety_requirements: ['PROTECTIVE_GEAR'], status: 'BUNDLED', created_at: '2026-09-06T12:00:00Z' },
];

export const MaintenanceRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(defaultRequests);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form state
  const [sourceSystem, setSourceSystem] = useState<'TMS' | 'TDMS' | 'SMMS'>('TMS');
  const [departmentId, setDepartmentId] = useState<Department>('CIVIL');
  const [assetId, setAssetId] = useState<string>('TRK-124');
  const [taskType, setTaskType] = useState<string>('Rail Weld Grinding');
  const [locationKm, setLocationKm] = useState<number>(124.5);
  const [priority, setPriority] = useState<string>('HIGH');
  const [duration] = useState<number>(45);

  const loadRequests = async () => {
    try {
      const data = await fetchMaintenanceRequests(selectedDept);
      if (Array.isArray(data) && data.length > 0) {
        setRequests(data);
      }
    } catch {
      // Keep default requests on network failure
    }
  };

  useEffect(() => {
    loadRequests();
  }, [selectedDept]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMaintenanceRequest({
        source_system: sourceSystem,
        department_id: departmentId,
        asset_id: assetId,
        task_type: taskType,
        section_id: 'SEC-NDLS-AGC-01',
        location_km: locationKm,
        priority: priority,
        severity: priority === 'CRITICAL' ? 90 : (priority === 'HIGH' ? 75 : 50),
        estimated_duration_minutes: duration,
        required_block_type: 'TRAFFIC_BLOCK',
        safety_requirements: ['TRACK_CAUTION'],
      });
      setShowModal(false);
      loadRequests();
    } catch {
      setShowModal(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesDept = selectedDept === 'ALL' || r.department_id === selectedDept || r.department === selectedDept;
    const matchesSearch = r.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.task_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.asset_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-sky-400" />
            <span>Multi-Department Maintenance Requests</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ingested maintenance work items from TMS (Civil), TDMS (Track Defects), and SMMS (S&T / Electrical).
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-300 font-medium mr-1">Department:</span>
          {['ALL', 'CIVIL', 'ELECTRICAL', 'SIGNAL_TELECOM'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedDept === dept
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request ID, asset, task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500 w-64"
          />
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Request ID</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Asset ID</th>
                <th className="p-3.5">Task Description</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-sky-400">{req.request_id}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300">
                      {req.source_system}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">{req.department_id || req.department}</td>
                  <td className="p-3.5 font-mono font-medium text-slate-200">{req.asset_id}</td>
                  <td className="p-3.5 font-medium text-slate-200">{req.task_type}</td>
                  <td className="p-3.5 font-mono text-sky-300">KM {req.location_km}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      req.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' :
                      req.priority === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                      'bg-sky-950 text-sky-300 border border-sky-800/50'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">{req.estimated_duration_minutes} min</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-mono text-[10px]">
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Create Maintenance Request</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Source System:</label>
                <select
                  value={sourceSystem}
                  onChange={(e: any) => setSourceSystem(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="TMS">TMS (Track Management System)</option>
                  <option value="TDMS">TDMS (Track Defect System)</option>
                  <option value="SMMS">SMMS (S&T / OHE System)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Department:</label>
                <select
                  value={departmentId}
                  onChange={(e: any) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="CIVIL">CIVIL (Permanent Way)</option>
                  <option value="ELECTRICAL">ELECTRICAL (OHE Traction)</option>
                  <option value="SIGNAL_TELECOM">SIGNAL_TELECOM (S&T Signaling)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Asset ID:</label>
                <input
                  type="text"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Task Type Description:</label>
                <input
                  type="text"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Location KM:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={locationKm}
                    onChange={(e) => setLocationKm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

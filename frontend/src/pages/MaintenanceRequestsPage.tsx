import React, { useEffect, useState } from 'react';
import { fetchMaintenanceRequests, createMaintenanceRequest, updateMaintenanceRequest } from '../services/api';
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

  const handleStatusChange = async (reqId: string, newStatus: string) => {
    try {
      await updateMaintenanceRequest(reqId, { status: newStatus });
      setRequests((prev) =>
        prev.map((r) => (r.request_id === reqId || r.id === reqId ? { ...r, status: newStatus as any } : r))
      );
    } catch {
      setRequests((prev) =>
        prev.map((r) => (r.request_id === reqId || r.id === reqId ? { ...r, status: newStatus as any } : r))
      );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 flex items-center space-x-3 tracking-tight">
            <Wrench className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <span>Multi-Department Maintenance Requests</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
            Ingested maintenance work items from TMS (Civil), TDMS (Track Defects), and SMMS (S&T / Electrical).
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center space-x-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          <Filter className="w-5 h-5 text-slate-500 flex-shrink-0" />
          <span className="text-sm font-bold text-slate-700 mr-1">Department:</span>
          {['ALL', 'CIVIL', 'ELECTRICAL', 'SIGNAL_TELECOM'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {dept === 'SIGNAL_TELECOM' ? 'S&T (Signal & Telecom)' : dept}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request ID, asset, task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-80"
          />
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Request ID</th>
                <th className="py-4 px-4">Source</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Asset ID</th>
                <th className="py-4 px-4">Task Description</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Duration</th>
                <th className="py-4 px-4">Department Work Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-blue-700 text-sm">{req.request_id}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700 border border-slate-200">
                      {req.source_system}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{req.department_id || req.department}</td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">{req.asset_id}</td>
                  <td className="py-4 px-4 font-medium text-slate-800">{req.task_type}</td>
                  <td className="py-4 px-4 font-mono text-blue-700 font-bold">KM {req.location_km}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-xs ${
                      req.priority === 'CRITICAL' ? 'bg-rose-600' :
                      req.priority === 'HIGH' ? 'bg-rose-500' :
                      req.priority === 'MEDIUM' ? 'bg-amber-600' :
                      'bg-emerald-600'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-slate-700">{req.estimated_duration_minutes} min</td>
                  <td className="py-4 px-4">
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.request_id || req.id, e.target.value)}
                      className={`h-10 px-3 rounded-xl font-mono text-xs sm:text-sm font-bold border cursor-pointer focus:outline-none shadow-xs ${
                        req.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : req.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="BUNDLED">BUNDLED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">Create Maintenance Request</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Source System:</label>
                <select
                  value={sourceSystem}
                  onChange={(e: any) => setSourceSystem(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="TMS">TMS (Track Management System)</option>
                  <option value="TDMS">TDMS (Track Defect System)</option>
                  <option value="SMMS">SMMS (S&T / OHE System)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Department:</label>
                <select
                  value={departmentId}
                  onChange={(e: any) => setDepartmentId(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="CIVIL">CIVIL (Permanent Way)</option>
                  <option value="ELECTRICAL">ELECTRICAL (OHE Traction)</option>
                  <option value="SIGNAL_TELECOM">SIGNAL_TELECOM (S&T Signaling)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Asset ID:</label>
                <input
                  type="text"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Task Type Description:</label>
                <input
                  type="text"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Location KM:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={locationKm}
                    onChange={(e) => setLocationKm(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
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

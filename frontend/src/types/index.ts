export interface SystemHealth {
  success: boolean;
  status: string;
  service: string;
  version: string;
  sih_problem_statement_id: string;
  timestamp: string;
  modules: Record<string, string>;
}

export type Department = 'CIVIL' | 'ELECTRICAL' | 'SIGNAL_TELECOM';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RequestStatus = 'PENDING' | 'VALIDATED' | 'BUNDLED' | 'SCHEDULED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export interface MaintenanceRequest {
  id: string;
  request_id: string;
  source_system: 'TMS' | 'TDMS' | 'SMMS';
  department_id: Department;
  department?: Department;
  asset_id: string;
  task_type: string;
  location_km: number;
  latitude?: number;
  longitude?: number;
  priority: Priority;
  severity: number; // 0-100
  estimated_duration_minutes: number; // minutes
  estimated_duration?: number;
  required_block_type: string;
  safety_requirements: string[];
  status: RequestStatus;
  risk_score?: number;
  created_at: string;
}

export interface TrainInfo {
  id: string;
  train_number: string;
  train_name: string;
  train_type: 'EXPRESS' | 'PASSENGER' | 'FREIGHT' | 'SPECIAL';
  priority: number;
  origin: string;
  destination: string;
  status: 'ON_TIME' | 'DELAYED' | 'HALTED';
  delay_minutes: number;
}

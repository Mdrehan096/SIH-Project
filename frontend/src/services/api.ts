import axios from 'axios';
import {
  SystemHealth,
  MaintenanceRequest,
  TrainInfo,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('retrack_token') || 'demo-access-token';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const checkSystemHealth = async (): Promise<SystemHealth> => {
  const response = await apiClient.get<SystemHealth>('/health');
  return response.data;
};

export const fetchMaintenanceRequests = async (department?: string): Promise<MaintenanceRequest[]> => {
  const params = department && department !== 'ALL' ? { department } : {};
  const response = await apiClient.get<MaintenanceRequest[]>('/maintenance', { params });
  return response.data;
};

export const createMaintenanceRequest = async (payload: any): Promise<MaintenanceRequest> => {
  const response = await apiClient.post<MaintenanceRequest>('/maintenance', payload);
  return response.data;
};

export const updateMaintenanceRequest = async (requestId: string, payload: { status?: string; priority?: string }): Promise<MaintenanceRequest> => {
  const response = await apiClient.patch<MaintenanceRequest>(`/maintenance/${requestId}`, payload);
  return response.data;
};

export const fetchTrains = async (): Promise<TrainInfo[]> => {
  const response = await apiClient.get<TrainInfo[]>('/trains');
  return response.data;
};

export const fetchTrainPaths = async (): Promise<any[]> => {
  const response = await apiClient.get<any[]>('/trains/paths');
  return response.data;
};

export const runBlockOptimizer = async (payload?: any): Promise<any> => {
  const reqBody = payload || {
    section_id: 'SEC-NDLS-AGC-01',
    start_time_window: '2026-09-07T00:00:00Z',
    end_time_window: '2026-09-07T08:00:00Z',
    max_bundling_distance_km: 5.0,
    max_block_duration_minutes: 60,
    solver_time_limit_seconds: 10,
    department_filters: ['CIVIL', 'ELECTRICAL', 'SIGNAL_TELECOM'],
  };
  const response = await apiClient.post('/optimizer/optimize', reqBody);
  return response.data;
};

export const approveBlock = async (blockId: string): Promise<any> => {
  const response = await apiClient.post(`/blocks/${blockId}/approve`);
  return response.data;
};

export const rejectBlock = async (blockId: string): Promise<any> => {
  const response = await apiClient.post(`/blocks/${blockId}/reject`);
  return response.data;
};

export const generateDigitalPN = async (blockId: string): Promise<any> => {
  const response = await apiClient.post('/pn/generate', { block_id: blockId });
  return response.data;
};

export const verifyDigitalPN = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/pn/verify', payload);
  return response.data;
};

export const fetchAnalyticsDashboard = async (): Promise<any> => {
  const response = await apiClient.get('/analytics/dashboard');
  return response.data;
};

export const calculateRiskScore = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/risk/score', payload);
  return response.data;
};

export const fetchAssets = async (): Promise<any[]> => {
  const response = await apiClient.get<any[]>('/assets');
  return response.data;
};

export const fetchAssetById = async (assetId: string): Promise<any> => {
  const response = await apiClient.get<any>(`/assets/${assetId}`);
  return response.data;
};

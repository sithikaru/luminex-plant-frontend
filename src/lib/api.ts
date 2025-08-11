import axios, { AxiosResponse, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';
import { 
  ApiResponse, 
  PaginatedResponse, 
  ApiError,
  Batch,
  Species,
  Zone,
  Bed,
  Measurement,
  User,
  Notification,
  Task,
  DashboardStats,
  GrowthAnalytics,
  ZoneUtilization,
  CreateBatchForm,
  CreateMeasurementForm,
  CreateSpeciesForm,
  CreateUserForm,
  CreateZoneForm,
  CreateBedForm,
  BatchFilters,
  UserFilters,
  MeasurementFilters
} from '@/types/domain';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = (session?.user as any)?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const msg = error?.response?.data?.error || error.message || 'Request failed';
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid - handled by NextAuth
      console.warn('Unauthorized access detected');
    }
    
    return Promise.reject(new Error(msg));
  }
);

// Generic API methods
const get = async <T>(url: string, params?: object): Promise<T> => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

const post = async <T>(url: string, data?: object): Promise<T> => {
  const response = await api.post<T>(url, data);
  return response.data;
};

const put = async <T>(url: string, data?: object): Promise<T> => {
  const response = await api.put<T>(url, data);
  return response.data;
};

const del = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);
  return response.data;
};

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials),
  
  register: (userData: CreateUserForm) =>
    post<ApiResponse<User>>('/auth/register', userData),
  
  logout: () =>
    post<ApiResponse<null>>('/auth/logout'),
  
  getProfile: () =>
    get<ApiResponse<User>>('/auth/profile'),
  
  refreshToken: () =>
    post<ApiResponse<{ token: string }>>('/auth/refresh'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    get<ApiResponse<DashboardStats>>('/dashboard/stats'),
  
  getRecentActivity: () =>
    get<ApiResponse<any[]>>('/dashboard/activity'),
  
  getGrowthAnalytics: (batchId?: string) =>
    get<ApiResponse<GrowthAnalytics[]>>('/dashboard/growth-analytics', { batchId }),
  
  getZoneUtilization: () =>
    get<ApiResponse<ZoneUtilization[]>>('/dashboard/zone-utilization'),
};

// Batch API
export const batchApi = {
  getBatches: (filters?: BatchFilters, page = 1, limit = 10) =>
    get<PaginatedResponse<Batch>>('/batches', { ...filters, page, limit }),
  
  getBatch: (id: string) =>
    get<ApiResponse<Batch>>(`/batches/${id}`),
  
  createBatch: (data: CreateBatchForm) =>
    post<ApiResponse<Batch>>('/batches', data),
  
  updateBatch: (id: string, data: Partial<Batch>) =>
    put<ApiResponse<Batch>>(`/batches/${id}`, data),
  
  deleteBatch: (id: string) =>
    del<ApiResponse<null>>(`/batches/${id}`),
  
  moveBatchStage: (id: string, data: { toStage: string; quantity: number; notes?: string }) =>
    post<ApiResponse<Batch>>(`/batches/${id}/move-stage`, data),
  
  markReady: (id: string, isReady: boolean) =>
    put<ApiResponse<Batch>>(`/batches/${id}/ready`, { isReady }),
  
  recordLoss: (id: string, data: { quantity: number; reason: string }) =>
    post<ApiResponse<Batch>>(`/batches/${id}/loss`, data),
  
  getBatchHistory: (id: string) =>
    get<ApiResponse<any[]>>(`/batches/${id}/history`),
};

// Species API
export const speciesApi = {
  getSpecies: (page = 1, limit = 10, search?: string) =>
    get<PaginatedResponse<Species>>('/species', { page, limit, search }),
  
  getSpeciesById: (id: string) =>
    get<ApiResponse<Species>>(`/species/${id}`),
  
  createSpecies: (data: CreateSpeciesForm) =>
    post<ApiResponse<Species>>('/species', data),
  
  updateSpecies: (id: string, data: Partial<Species>) =>
    put<ApiResponse<Species>>(`/species/${id}`, data),
  
  deleteSpecies: (id: string) =>
    del<ApiResponse<null>>(`/species/${id}`),
  
  getAllSpecies: () =>
    get<ApiResponse<Species[]>>('/species/all'),
};

// Zone API
export const zoneApi = {
  getZones: (page = 1, limit = 10) =>
    get<PaginatedResponse<Zone>>('/zones', { page, limit }),
  
  getZone: (id: string) =>
    get<ApiResponse<Zone>>(`/zones/${id}`),
  
  createZone: (data: CreateZoneForm) =>
    post<ApiResponse<Zone>>('/zones', data),
  
  updateZone: (id: string, data: Partial<Zone>) =>
    put<ApiResponse<Zone>>(`/zones/${id}`, data),
  
  deleteZone: (id: string) =>
    del<ApiResponse<null>>(`/zones/${id}`),
  
  getAllZones: () =>
    get<ApiResponse<Zone[]>>('/zones/all'),
  
  getZoneBeds: (zoneId: string) =>
    get<ApiResponse<Bed[]>>(`/zones/${zoneId}/beds`),
};

// Bed API
export const bedApi = {
  getBeds: (zoneId?: string, page = 1, limit = 10) =>
    get<PaginatedResponse<Bed>>('/beds', { zoneId, page, limit }),
  
  getBed: (id: string) =>
    get<ApiResponse<Bed>>(`/beds/${id}`),
  
  createBed: (data: CreateBedForm) =>
    post<ApiResponse<Bed>>('/beds', data),
  
  updateBed: (id: string, data: Partial<Bed>) =>
    put<ApiResponse<Bed>>(`/beds/${id}`, data),
  
  deleteBed: (id: string) =>
    del<ApiResponse<null>>(`/beds/${id}`),
  
  getAvailableBeds: (zoneId?: string) =>
    get<ApiResponse<Bed[]>>('/beds/available', { zoneId }),
};

// Measurement API
export const measurementApi = {
  getMeasurements: (filters?: MeasurementFilters, page = 1, limit = 10) =>
    get<PaginatedResponse<Measurement>>('/measurements', { ...filters, page, limit }),
  
  getMeasurement: (id: string) =>
    get<ApiResponse<Measurement>>(`/measurements/${id}`),
  
  createMeasurement: (data: CreateMeasurementForm) =>
    post<ApiResponse<Measurement>>('/measurements', data),
  
  updateMeasurement: (id: string, data: Partial<Measurement>) =>
    put<ApiResponse<Measurement>>(`/measurements/${id}`, data),
  
  deleteMeasurement: (id: string) =>
    del<ApiResponse<null>>(`/measurements/${id}`),
  
  getBatchMeasurements: (batchId: string) =>
    get<ApiResponse<Measurement[]>>(`/measurements/batch/${batchId}`),
};

// User API
export const userApi = {
  getUsers: (filters?: UserFilters, page = 1, limit = 10) =>
    get<PaginatedResponse<User>>('/users', { ...filters, page, limit }),
  
  getUser: (id: string) =>
    get<ApiResponse<User>>(`/users/${id}`),
  
  createUser: (data: CreateUserForm) =>
    post<ApiResponse<User>>('/users', data),
  
  updateUser: (id: string, data: Partial<User>) =>
    put<ApiResponse<User>>(`/users/${id}`, data),
  
  deleteUser: (id: string) =>
    del<ApiResponse<null>>(`/users/${id}`),
  
  toggleUserStatus: (id: string) =>
    put<ApiResponse<User>>(`/users/${id}/toggle-status`),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    put<ApiResponse<null>>('/users/change-password', data),
};

// Notification API
export const notificationApi = {
  getNotifications: (page = 1, limit = 10) =>
    get<PaginatedResponse<Notification>>('/notifications', { page, limit }),
  
  markAsRead: (id: string) =>
    put<ApiResponse<Notification>>(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    put<ApiResponse<null>>('/notifications/read-all'),
  
  getUnreadCount: () =>
    get<ApiResponse<{ count: number }>>('/notifications/unread-count'),
};

// Task API
export const taskApi = {
  getTasks: (page = 1, limit = 10, completed?: boolean) =>
    get<PaginatedResponse<Task>>('/tasks', { page, limit, completed }),
  
  getTask: (id: string) =>
    get<ApiResponse<Task>>(`/tasks/${id}`),
  
  createTask: (data: Partial<Task>) =>
    post<ApiResponse<Task>>('/tasks', data),
  
  updateTask: (id: string, data: Partial<Task>) =>
    put<ApiResponse<Task>>(`/tasks/${id}`, data),
  
  completeTask: (id: string) =>
    put<ApiResponse<Task>>(`/tasks/${id}/complete`),
  
  deleteTask: (id: string) =>
    del<ApiResponse<null>>(`/tasks/${id}`),
  
  getMyTasks: (completed?: boolean) =>
    get<ApiResponse<Task[]>>('/tasks/my-tasks', { completed }),
};

// Analytics API
export const analyticsApi = {
  getGrowthTrends: (batchId?: string, dateRange?: { start: string; end: string }) =>
    get<ApiResponse<any>>('/analytics/growth-trends', { batchId, ...dateRange }),
  
  getProductionMetrics: (dateRange?: { start: string; end: string }) =>
    get<ApiResponse<any>>('/analytics/production-metrics', dateRange),
  
  getSpeciesPerformance: () =>
    get<ApiResponse<any>>('/analytics/species-performance'),
  
  getZoneEfficiency: () =>
    get<ApiResponse<any>>('/analytics/zone-efficiency'),
  
  exportData: (type: string, filters?: object) =>
    get<Blob>(`/analytics/export/${type}`, { ...filters, responseType: 'blob' }),
};

// Export the api instance for direct use if needed
export { api };

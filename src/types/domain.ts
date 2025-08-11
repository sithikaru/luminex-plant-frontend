// User and Role types
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER", 
  FIELD_OFFICER = "FIELD_OFFICER",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Species types
export enum SpeciesCategory {
  TREE = "TREE",
  SHRUB = "SHRUB",
  HERB = "HERB",
  GRASS = "GRASS",
  FERN = "FERN",
  VINE = "VINE",
  SUCCULENT = "SUCCULENT",
  AQUATIC = "AQUATIC",
}

export interface Species {
  id: string;
  name: string;
  scientificName?: string | null;
  description?: string | null;
  category: SpeciesCategory;
  targetGirth: number;
  targetHeight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    batches: number;
  };
}

// Zone and Bed types
export interface Zone {
  id: string;
  name: string;
  capacity: number;
  occupied?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  beds?: Bed[];
  _count?: {
    beds: number;
    batches: number;
  };
}

export interface Bed {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  zoneId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  zone?: Zone;
  _count?: {
    batches: number;
  };
}

// Batch types
export interface Batch {
  id: string;
  batchNumber: string;
  customName?: string | null;
  pathway: PathwayType;
  speciesId: string;
  initialQty: number;
  currentQty: number;
  status: BatchStatus;
  stage: BatchStage;
  isReady: boolean;
  readyDate?: string | null;
  lossReason?: string | null;
  lossQty: number;
  createdById: string;
  zoneId?: string | null;
  bedId?: string | null;
  createdAt: string;
  updatedAt: string;
  species?: Species;
  createdBy?: User;
  zone?: Zone;
  bed?: Bed;
  measurements?: Measurement[];
  stageHistory?: StageHistory[];
}

export enum PathwayType {
  PURCHASING = "PURCHASING",
  SEED_GERMINATION = "SEED_GERMINATION",
  CUTTING_GERMINATION = "CUTTING_GERMINATION",
  OUT_SOURCING = "OUT_SOURCING",
}

export enum BatchStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum BatchStage {
  INITIAL = "INITIAL",
  PROPAGATION = "PROPAGATION",
  SHADE_60 = "SHADE_60",
  SHADE_80 = "SHADE_80",
  GROWING = "GROWING",
  HARDENING = "HARDENING",
  RE_POTTING = "RE_POTTING",
  PHYTOSANITARY = "PHYTOSANITARY",
}

// Measurement types
export interface Measurement {
  id: string;
  batchId: string;
  userId: string;
  girth: number;
  height: number;
  sampleSize: number;
  notes?: string | null;
  createdAt: string;
  batch?: Batch;
  user?: User;
}

export interface MeasurementRange {
  label: string;
  min: number;
  max: number;
  value: string;
}

// Stage History
export interface StageHistory {
  id: string;
  batchId: string;
  fromStage?: BatchStage | null;
  toStage: BatchStage;
  quantity: number;
  notes?: string | null;
  createdAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  user?: User;
}

export enum NotificationType {
  MEASUREMENT_DUE = "MEASUREMENT_DUE",
  BATCH_READY = "BATCH_READY",
  TASK_ASSIGNED = "TASK_ASSIGNED",
  SYSTEM_ALERT = "SYSTEM_ALERT",
}

// Task types
export interface Task {
  id: string;
  userId: string;
  type: TaskType;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string | null;
  user?: User;
  batchId?: string | null;
  zoneId?: string | null;
}

export enum TaskType {
  MEASUREMENT = "MEASUREMENT",
  STAGE_TRANSITION = "STAGE_TRANSITION",
  MAINTENANCE = "MAINTENANCE",
  INSPECTION = "INSPECTION",
}

// Analytics types
export interface GrowthAnalytics {
  batchId: string;
  avgGrowthRate: {
    girth: number;
    height: number;
  };
  projectedReadyDate?: string | null;
  isOnTrack: boolean;
  measurementCount: number;
  daysInGrowing: number;
}

export interface DashboardStats {
  totalBatches: number;
  readyBatches: number;
  inProgressBatches: number;
  totalPlants: number;
  activeSpecies: number;
  zonesUtilization: number;
  pendingTasks: number;
  weeklyMeasurements: number;
}

export interface ZoneUtilization {
  zoneId: string;
  zoneName: string;
  capacity: number;
  occupied: number;
  utilizationPercentage: number;
  activeBatches: number;
}

// Form types
export interface CreateBatchForm {
  speciesId: string;
  initialQty: number;
  pathway: PathwayType;
  customName?: string;
  zoneId?: string;
  bedId?: string;
}

export interface CreateMeasurementForm {
  batchId: string;
  girth: number;
  height: number;
  sampleSize: number;
  notes?: string;
}

export interface CreateSpeciesForm {
  name: string;
  scientificName?: string;
  targetGirth: number;
  targetHeight: number;
}

export interface CreateUserForm {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
}

export interface CreateZoneForm {
  name: string;
  capacity: number;
}

export interface CreateBedForm {
  name: string;
  capacity: number;
  zoneId: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  details?: any;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface GrowthChartData {
  date: string;
  week: number;
  girth: number;
  height: number;
  targetGirth: number;
  targetHeight: number;
}

export interface UtilizationChartData {
  zone: string;
  utilized: number;
  available: number;
  total: number;
}

// Filter and search types
export interface BatchFilters {
  status?: BatchStatus[];
  stage?: BatchStage[];
  pathway?: PathwayType[];
  speciesId?: string;
  zoneId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface UserFilters {
  role?: UserRole[];
  isActive?: boolean;
  search?: string;
}

export interface MeasurementFilters {
  batchId?: string;
  userId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Units and conversions
export enum LengthUnit {
  CM = "cm",
  MM = "mm",
  INCH = "inch",
  METER = "m",
}

export interface UnitConversion {
  value: number;
  unit: LengthUnit;
  displayValue: string;
}

export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'FIELD_OFFICER'

export type Species = {
  id: string
  name: string
  scientificName?: string | null
  targetGirth: number
  targetHeight: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Zone = {
  id: string
  name: string
  capacity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Bed = {
  id: string
  name: string
  capacity: number
  occupied: number
  zoneId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type BatchStage =
  | 'INITIAL' | 'PROPAGATION' | 'SHADE_60' | 'SHADE_80'
  | 'GROWING' | 'HARDENING' | 'RE_POTTING' | 'PHYTOSANITARY'

export type PathwayType =
  | 'PURCHASING' | 'SEED_GERMINATION' | 'CUTTING_GERMINATION' | 'OUT_SOURCING'

export type BatchStatus = 'CREATED' | 'IN_PROGRESS' | 'READY' | 'DELIVERED' | 'CANCELLED'

export type Batch = {
  id: string
  batchNumber: string
  customName?: string | null
  pathway: PathwayType
  speciesId: string
  initialQty: number
  currentQty: number
  status: BatchStatus
  stage: BatchStage
  isReady: boolean
  readyDate?: string | null
  zoneId?: string | null
  bedId?: string | null
  createdAt: string
  updatedAt: string
  species?: Species
}

export type Measurement = {
  id: string
  batchId: string
  userId: string
  girth: number
  height: number
  sampleSize: number
  notes?: string | null
  createdAt: string
}

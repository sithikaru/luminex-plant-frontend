import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const speciesSchema = z.object({
  name: z.string().min(2).max(100),
  scientificName: z.string().optional().nullable(),
  targetGirth: z.coerce.number().min(0.1).max(100),
  targetHeight: z.coerce.number().min(1).max(1000),
})

export const zoneSchema = z.object({
  name: z.string().min(1),
  capacity: z.coerce.number().int().min(1),
})

export const bedSchema = z.object({
  name: z.string().min(1),
  capacity: z.coerce.number().int().min(1),
  zoneId: z.string().uuid(),
})

export const batchSchema = z.object({
  customName: z.string().max(100).optional().nullable(),
  speciesId: z.string().uuid(),
  initialQty: z.coerce.number().int().min(1).max(10000),
  pathway: z.enum(['PURCHASING','SEED_GERMINATION','CUTTING_GERMINATION','OUT_SOURCING']),
})

export const measurementSchema = z.object({
  batchId: z.string().uuid(),
  girth: z.coerce.number().min(0.1).max(100),
  height: z.coerce.number().min(1).max(1000),
  sampleSize: z.coerce.number().int().min(1).max(100),
  notes: z.string().max(500).optional().nullable(),
})

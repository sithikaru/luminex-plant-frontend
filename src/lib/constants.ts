export const APP_NAME = 'LuminexPlant'
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api'
export const DEFAULT_PAGE_SIZE = 10
export const ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MANAGER: 'MANAGER',
  FIELD_OFFICER: 'FIELD_OFFICER'
} as const

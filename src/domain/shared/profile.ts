import type { CurrencyCode, MonthKey, TimestampedEntity } from './types'
import { createId, currentMonthKey, nowIso } from './types'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface UserProfile extends TimestampedEntity {
  displayName?: string
  currency: CurrencyCode
  activeMonth: MonthKey
  themeMode: ThemeMode
}

export function createDefaultProfile(): UserProfile {
  const timestamp = nowIso()

  return {
    id: createId('profile'),
    currency: 'BRL',
    activeMonth: currentMonthKey(),
    themeMode: 'system',
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

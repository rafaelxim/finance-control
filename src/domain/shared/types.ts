export type EntityId = string
export type IsoTimestamp = string
export type MonthKey = `${number}-${string}`
export type DecimalString = string
export type CurrencyCode = 'BRL'

export interface TimestampedEntity {
  id: EntityId
  createdAt: IsoTimestamp
  updatedAt: IsoTimestamp
}

export function createId(prefix = 'id'): EntityId {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export function nowIso(): IsoTimestamp {
  return new Date().toISOString()
}

export function currentMonthKey(date = new Date()): MonthKey {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}` as MonthKey
}

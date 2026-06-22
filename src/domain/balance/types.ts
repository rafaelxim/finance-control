import type { DecimalString, EntityId, MonthKey, TimestampedEntity } from '@/domain/shared/types'

export type BalanceItemKind = 'asset' | 'debt'

export interface BalanceSnapshot extends TimestampedEntity {
  month: MonthKey
  notes?: string
}

export interface BalanceItem extends TimestampedEntity {
  snapshotId: EntityId
  name: string
  kind: BalanceItemKind
  amount: DecimalString
  institution?: string
  notes?: string
  sortOrder: number
}

export interface BalanceDraftItemInput {
  id?: EntityId
  name: string
  kind: BalanceItemKind
  amount: DecimalString
  institution?: string
  notes?: string
  sortOrder: number
}

export interface BalanceTotals {
  assetsTotal: DecimalString
  debtsTotal: DecimalString
  netWorth: DecimalString
}

export interface BalanceSnapshotWithItems {
  snapshot: BalanceSnapshot
  items: BalanceItem[]
}

export interface FinancialEvolution extends BalanceTotals {
  month: MonthKey
  previousNetWorth?: DecimalString
  netWorthChange: DecimalString
  netWorthChangePercent?: DecimalString
}

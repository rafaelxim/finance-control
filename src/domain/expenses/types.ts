import type { DecimalString, EntityId, TimestampedEntity } from '@/domain/shared/types'

export interface Expense extends TimestampedEntity {
  budgetId: EntityId
  categoryId: EntityId
  amount: DecimalString
  date: string
  description?: string
}

export interface ExpenseDraftInput {
  id?: EntityId
  budgetId: EntityId
  categoryId: EntityId
  amount: DecimalString
  date: string
  description?: string
}

import type { DecimalString, EntityId, MonthKey, TimestampedEntity } from '@/domain/shared/types'

export type BudgetStatus = 'draft' | 'active' | 'closed'
export type AllocationType = 'fixed' | 'percentage'

export interface MonthlyBudget extends TimestampedEntity {
  month: MonthKey
  availableAmount: DecimalString
  notes?: string
  status: BudgetStatus
}

export interface BudgetCategory extends TimestampedEntity {
  budgetId: EntityId
  name: string
  allocationType: AllocationType
  allocationValue: DecimalString
  computedLimit: DecimalString
  sortOrder: number
  status: 'active' | 'archived'
}

export interface BudgetTotals {
  allocated: DecimalString
  unallocated: DecimalString
  overAllocated: DecimalString
}

export interface BudgetDraftCategoryInput {
  id?: EntityId
  name: string
  allocationType: AllocationType
  allocationValue: DecimalString
}

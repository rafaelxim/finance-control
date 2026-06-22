import type { BalanceItem, BalanceSnapshot } from '@/domain/balance/types'
import type { BudgetCategory, MonthlyBudget } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import type { UserProfile } from '@/domain/shared/profile'
import type { IsoTimestamp } from '@/domain/shared/types'

export const DATA_EXPORT_SCHEMA_VERSION = 1

export interface VisualPreferences {
  categoryVisuals?: Record<string, string>
}

export interface DataExportPayload {
  schemaVersion: typeof DATA_EXPORT_SCHEMA_VERSION
  exportedAt: IsoTimestamp
  profile: UserProfile | null
  monthlyBudgets: MonthlyBudget[]
  budgetCategories: BudgetCategory[]
  expenses: Expense[]
  balanceSnapshots: BalanceSnapshot[]
  balanceItems: BalanceItem[]
  visualPreferences: VisualPreferences
}

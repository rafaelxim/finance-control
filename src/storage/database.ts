import Dexie, { type Table } from 'dexie'

import type { BudgetCategory, MonthlyBudget } from '@/domain/budget/types'
import type { UserProfile } from '@/domain/shared/profile'

export interface FinanceDatabaseSchema {
  profiles: Table<UserProfile, string>
  monthlyBudgets: Table<MonthlyBudget, string>
  budgetCategories: Table<BudgetCategory, string>
}

export class FinanceDatabase extends Dexie implements FinanceDatabaseSchema {
  profiles!: Table<UserProfile, string>
  monthlyBudgets!: Table<MonthlyBudget, string>
  budgetCategories!: Table<BudgetCategory, string>

  constructor(name = 'finance-control') {
    super(name)

    this.version(1).stores({
      profiles: 'id, activeMonth',
      monthlyBudgets: 'id, month, status',
      budgetCategories: 'id, budgetId, [budgetId+sortOrder], status'
    })
  }
}

export const db = new FinanceDatabase()

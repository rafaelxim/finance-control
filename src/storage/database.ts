import Dexie, { type Table } from 'dexie'

import type { BalanceItem, BalanceSnapshot } from '@/domain/balance/types'
import type { BudgetCategory, MonthlyBudget } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import type { UserProfile } from '@/domain/shared/profile'

export interface FinanceDatabaseSchema {
  profiles: Table<UserProfile, string>
  monthlyBudgets: Table<MonthlyBudget, string>
  budgetCategories: Table<BudgetCategory, string>
  expenses: Table<Expense, string>
  balanceSnapshots: Table<BalanceSnapshot, string>
  balanceItems: Table<BalanceItem, string>
}

export class FinanceDatabase extends Dexie implements FinanceDatabaseSchema {
  profiles!: Table<UserProfile, string>
  monthlyBudgets!: Table<MonthlyBudget, string>
  budgetCategories!: Table<BudgetCategory, string>
  expenses!: Table<Expense, string>
  balanceSnapshots!: Table<BalanceSnapshot, string>
  balanceItems!: Table<BalanceItem, string>

  constructor(name = 'finance-control') {
    super(name)

    this.version(1).stores({
      profiles: 'id, activeMonth',
      monthlyBudgets: 'id, month, status',
      budgetCategories: 'id, budgetId, [budgetId+sortOrder], status'
    })

    this.version(2).stores({
      profiles: 'id, activeMonth',
      monthlyBudgets: 'id, month, status',
      budgetCategories: 'id, budgetId, [budgetId+sortOrder], status',
      expenses: 'id, budgetId, categoryId, date, [budgetId+date]'
    })

    this.version(3).stores({
      profiles: 'id, activeMonth',
      monthlyBudgets: 'id, month, status',
      budgetCategories: 'id, budgetId, [budgetId+sortOrder], status',
      expenses: 'id, budgetId, categoryId, date, [budgetId+date]',
      balanceSnapshots: 'id, month',
      balanceItems: 'id, snapshotId, kind, [snapshotId+sortOrder]'
    })
  }
}

export const db = new FinanceDatabase()

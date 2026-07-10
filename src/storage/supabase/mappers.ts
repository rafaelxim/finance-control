import type { BalanceItem, BalanceSnapshot } from '@/domain/balance/types'
import type { BudgetCategory, MonthlyBudget } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import type { UserProfile } from '@/domain/shared/profile'
import type { MonthKey } from '@/domain/shared/types'
import type { VisualPreferences } from '@/domain/shared/data-export'

import type { Inserts, Tables } from './database.types'

const optional = (value: string | null | undefined) => value || undefined

export function toProfileRow(profile: UserProfile): Inserts<'profiles'> {
  return {
    id: profile.id,
    display_name: profile.displayName ?? null,
    currency: profile.currency,
    active_month: profile.activeMonth,
    theme_mode: profile.themeMode,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt
  }
}

export function fromProfileRow(row: Tables<'profiles'>): UserProfile {
  return {
    id: row.id,
    displayName: optional(row.display_name),
    currency: row.currency,
    activeMonth: row.active_month as MonthKey,
    themeMode: row.theme_mode,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function toMonthlyBudgetRow(budget: MonthlyBudget): Inserts<'monthly_budgets'> {
  return {
    id: budget.id,
    month: budget.month,
    available_amount: budget.availableAmount,
    notes: budget.notes ?? null,
    status: budget.status,
    created_at: budget.createdAt,
    updated_at: budget.updatedAt
  }
}

export function fromMonthlyBudgetRow(row: Tables<'monthly_budgets'>): MonthlyBudget {
  return {
    id: row.id,
    month: row.month as MonthKey,
    availableAmount: row.available_amount,
    notes: optional(row.notes),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function toBudgetCategoryRow(category: BudgetCategory): Inserts<'budget_categories'> {
  return {
    id: category.id,
    budget_id: category.budgetId,
    name: category.name,
    allocation_type: category.allocationType,
    allocation_value: category.allocationValue,
    computed_limit: category.computedLimit,
    sort_order: category.sortOrder,
    status: category.status,
    created_at: category.createdAt,
    updated_at: category.updatedAt
  }
}

export function fromBudgetCategoryRow(row: Tables<'budget_categories'>): BudgetCategory {
  return {
    id: row.id,
    budgetId: row.budget_id,
    name: row.name,
    allocationType: row.allocation_type,
    allocationValue: row.allocation_value,
    computedLimit: row.computed_limit,
    sortOrder: row.sort_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function toExpenseRow(expense: Expense): Inserts<'expenses'> {
  return {
    id: expense.id,
    budget_id: expense.budgetId,
    category_id: expense.categoryId,
    amount: expense.amount,
    date: expense.date,
    description: expense.description ?? null,
    created_at: expense.createdAt,
    updated_at: expense.updatedAt
  }
}

export function fromExpenseRow(row: Tables<'expenses'>): Expense {
  return {
    id: row.id,
    budgetId: row.budget_id,
    categoryId: row.category_id,
    amount: row.amount,
    date: row.date,
    description: optional(row.description),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function toBalanceSnapshotRow(snapshot: BalanceSnapshot): Inserts<'balance_snapshots'> {
  return {
    id: snapshot.id,
    month: snapshot.month,
    notes: snapshot.notes ?? null,
    created_at: snapshot.createdAt,
    updated_at: snapshot.updatedAt
  }
}

export function fromBalanceSnapshotRow(row: Tables<'balance_snapshots'>): BalanceSnapshot {
  return {
    id: row.id,
    month: row.month as MonthKey,
    notes: optional(row.notes),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function toBalanceItemRow(item: BalanceItem): Inserts<'balance_items'> {
  return {
    id: item.id,
    snapshot_id: item.snapshotId,
    name: item.name,
    kind: item.kind,
    amount: item.amount,
    institution: item.institution ?? null,
    notes: item.notes ?? null,
    sort_order: item.sortOrder,
    created_at: item.createdAt,
    updated_at: item.updatedAt
  }
}

export function fromBalanceItemRow(row: Tables<'balance_items'>): BalanceItem {
  return {
    id: row.id,
    snapshotId: row.snapshot_id,
    name: row.name,
    kind: row.kind,
    amount: row.amount,
    institution: optional(row.institution),
    notes: optional(row.notes),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function toVisualPreferencesRow(
  preferences: VisualPreferences,
  timestamp: string,
  userId: string
): Inserts<'visual_preferences'> {
  return {
    id: `visual_preferences_${userId}`,
    user_id: userId,
    category_visuals: preferences.categoryVisuals ?? {},
    created_at: timestamp,
    updated_at: timestamp
  }
}

export function fromVisualPreferencesRow(row: Tables<'visual_preferences'>): VisualPreferences {
  return {
    categoryVisuals: row.category_visuals ?? {}
  }
}

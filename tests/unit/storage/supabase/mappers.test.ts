import { describe, expect, it } from 'vitest'

import type { BalanceItem, BalanceSnapshot } from '@/domain/balance/types'
import type { BudgetCategory, MonthlyBudget } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import type { UserProfile } from '@/domain/shared/profile'
import {
  fromBalanceItemRow,
  fromBalanceSnapshotRow,
  fromBudgetCategoryRow,
  fromExpenseRow,
  fromMonthlyBudgetRow,
  fromProfileRow,
  fromVisualPreferencesRow,
  toBalanceItemRow,
  toBalanceSnapshotRow,
  toBudgetCategoryRow,
  toExpenseRow,
  toMonthlyBudgetRow,
  toProfileRow,
  toVisualPreferencesRow
} from '@/storage/supabase/mappers'

const timestamp = '2026-06-26T00:00:00.000Z'

describe('Supabase mappers', () => {
  it('round trips profile rows', () => {
    const profile: UserProfile = {
      id: 'profile_1',
      displayName: 'Rafael',
      currency: 'BRL',
      activeMonth: '2026-06',
      themeMode: 'dark',
      createdAt: timestamp,
      updatedAt: timestamp
    }

    expect(fromProfileRow(toProfileRow(profile))).toEqual(profile)
  })

  it('round trips budget and category rows', () => {
    const budget: MonthlyBudget = {
      id: 'budget_1',
      month: '2026-06',
      availableAmount: '1000.00',
      notes: 'Plano',
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp
    }
    const category: BudgetCategory = {
      id: 'category_1',
      budgetId: budget.id,
      name: 'Mercado',
      allocationType: 'fixed',
      allocationValue: '400.00',
      computedLimit: '400.00',
      sortOrder: 0,
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp
    }

    expect(fromMonthlyBudgetRow(toMonthlyBudgetRow(budget))).toEqual(budget)
    expect(fromBudgetCategoryRow(toBudgetCategoryRow(category))).toEqual(category)
  })

  it('round trips expense rows', () => {
    const expense: Expense = {
      id: 'expense_1',
      budgetId: 'budget_1',
      categoryId: 'category_1',
      amount: '59.90',
      date: '2026-06-26',
      description: 'Compra',
      createdAt: timestamp,
      updatedAt: timestamp
    }

    expect(fromExpenseRow(toExpenseRow(expense))).toEqual(expense)
  })

  it('round trips balance snapshot and item rows', () => {
    const snapshot: BalanceSnapshot = {
      id: 'snapshot_1',
      month: '2026-06',
      notes: 'Fechamento',
      createdAt: timestamp,
      updatedAt: timestamp
    }
    const item: BalanceItem = {
      id: 'balance_item_1',
      snapshotId: snapshot.id,
      name: 'Conta',
      kind: 'asset',
      amount: '2500.00',
      institution: 'Banco',
      notes: 'Reserva',
      sortOrder: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    expect(fromBalanceSnapshotRow(toBalanceSnapshotRow(snapshot))).toEqual(snapshot)
    expect(fromBalanceItemRow(toBalanceItemRow(item))).toEqual(item)
  })

  it('round trips visual preference rows', () => {
    const preferences = { categoryVisuals: { Mercado: 'basket' } }

    expect(fromVisualPreferencesRow(toVisualPreferencesRow(preferences, timestamp))).toEqual(
      preferences
    )
  })
})

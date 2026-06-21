import type { MonthlyBudget } from '@/domain/budget/types'
import type { Expense, ExpenseDraftInput } from '@/domain/expenses/types'
import { toMoneyString } from '@/domain/shared/money'
import type { EntityId, MonthKey } from '@/domain/shared/types'
import { createEntityBase, touchEntity } from '@/storage/repository'

import { db } from './database'

export async function getExpensesByBudgetId(budgetId: EntityId): Promise<Expense[]> {
  return (await db.expenses.where('budgetId').equals(budgetId).toArray()).sort((left, right) =>
    right.date.localeCompare(left.date)
  )
}

export async function getExpensesByMonth(month: MonthKey): Promise<Expense[]> {
  const budget = await db.monthlyBudgets.where('month').equals(month).first()
  if (!budget) return []

  return getExpensesByBudgetId(budget.id)
}

export async function saveExpense(input: ExpenseDraftInput): Promise<Expense> {
  const existing = input.id ? await db.expenses.get(input.id) : undefined
  const base = existing ? touchEntity(existing) : createEntityBase('expense')
  const expense: Expense = {
    ...base,
    budgetId: input.budgetId,
    categoryId: input.categoryId,
    amount: toMoneyString(input.amount),
    date: input.date,
    description: input.description?.trim() || undefined
  }

  await db.expenses.put(expense)
  return expense
}

export async function deleteExpense(id: EntityId): Promise<void> {
  await db.expenses.delete(id)
}

export async function getBudgetForExpenseMonth(month: MonthKey): Promise<MonthlyBudget | null> {
  return (await db.monthlyBudgets.where('month').equals(month).first()) ?? null
}

import type { MonthlyBudget } from '@/domain/budget/types'
import type { Expense, ExpenseDraftInput } from '@/domain/expenses/types'
import { toMoneyString } from '@/domain/shared/money'
import type { EntityId, MonthKey } from '@/domain/shared/types'
import { createEntityBase, touchEntity } from '@/storage/repository'

import {
  fromExpenseRow,
  fromMonthlyBudgetRow,
  toExpenseRow
} from './supabase/mappers'
import { assertRemoteSuccess, supabaseClient } from './supabase/query-helpers'

export async function getExpensesByBudgetId(budgetId: EntityId): Promise<Expense[]> {
  const { data, error } = await supabaseClient()
    .from('expenses')
    .select('*')
    .eq('budget_id', budgetId)
    .order('date', { ascending: false })
  assertRemoteSuccess(error, 'Falha ao carregar despesas')
  return (data ?? []).map(fromExpenseRow)
}

export async function getExpensesByMonth(month: MonthKey): Promise<Expense[]> {
  const budget = await getBudgetForExpenseMonth(month)
  if (!budget) return []

  return getExpensesByBudgetId(budget.id)
}

export async function saveExpense(input: ExpenseDraftInput): Promise<Expense> {
  const client = supabaseClient()
  const existing = input.id
    ? await client.from('expenses').select('*').eq('id', input.id).maybeSingle()
    : null
  if (existing) assertRemoteSuccess(existing.error, 'Falha ao carregar despesa')

  const existingExpense = existing?.data ? fromExpenseRow(existing.data) : undefined
  const base = existingExpense ? touchEntity(existingExpense) : createEntityBase('expense')
  const expense: Expense = {
    ...base,
    budgetId: input.budgetId,
    categoryId: input.categoryId,
    amount: toMoneyString(input.amount),
    date: input.date,
    description: input.description?.trim() || undefined
  }

  const { error } = await client.from('expenses').upsert(toExpenseRow(expense), { onConflict: 'id' })
  assertRemoteSuccess(error, 'Falha ao salvar despesa')
  return expense
}

export async function deleteExpense(id: EntityId): Promise<void> {
  const { error } = await supabaseClient().from('expenses').delete().eq('id', id)
  assertRemoteSuccess(error, 'Falha ao excluir despesa')
}

export async function getBudgetForExpenseMonth(month: MonthKey): Promise<MonthlyBudget | null> {
  const { data, error } = await supabaseClient()
    .from('monthly_budgets')
    .select('*')
    .eq('month', month)
    .maybeSingle()
  assertRemoteSuccess(error, 'Falha ao carregar orçamento da despesa')
  return data ? fromMonthlyBudgetRow(data) : null
}

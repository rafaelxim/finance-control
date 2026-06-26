import type { MonthKey } from '@/domain/shared/types'
import { createEntityBase, touchEntity } from '@/storage/repository'

import { computeCategoryLimit } from '@/domain/budget/allocation'
import type { BudgetCategory, BudgetDraftCategoryInput, MonthlyBudget } from '@/domain/budget/types'

import {
  fromBudgetCategoryRow,
  fromMonthlyBudgetRow,
  toBudgetCategoryRow,
  toMonthlyBudgetRow
} from './supabase/mappers'
import { assertRemoteSuccess, supabaseClient } from './supabase/query-helpers'

export async function getBudgetByMonth(month: MonthKey) {
  const client = supabaseClient()
  const { data: budgetRow, error: budgetError } = await client
    .from('monthly_budgets')
    .select('*')
    .eq('month', month)
    .maybeSingle()
  assertRemoteSuccess(budgetError, 'Falha ao carregar orçamento')

  const budget = budgetRow ? fromMonthlyBudgetRow(budgetRow) : null
  if (!budget) return { budget: null, categories: [] as BudgetCategory[] }

  const { data: categoryRows, error: categoriesError } = await client
    .from('budget_categories')
    .select('*')
    .eq('budget_id', budget.id)
    .order('sort_order', { ascending: true })
  assertRemoteSuccess(categoriesError, 'Falha ao carregar categorias')

  const categories = (categoryRows ?? []).map(fromBudgetCategoryRow)

  return { budget, categories }
}

export async function saveBudgetWithCategories(input: {
  month: MonthKey
  availableAmount: string
  categories: BudgetDraftCategoryInput[]
}): Promise<{ budget: MonthlyBudget; categories: BudgetCategory[] }> {
  const client = supabaseClient()
  const { budget: existing, categories: existingCategories } = await getBudgetByMonth(input.month)
  const budget: MonthlyBudget = existing
    ? touchEntity({
        ...existing,
        availableAmount: input.availableAmount,
        status: 'active'
      })
    : {
        ...createEntityBase('budget'),
        month: input.month,
        availableAmount: input.availableAmount,
        status: 'active'
      }

  const { error: budgetError } = await client
    .from('monthly_budgets')
    .upsert(toMonthlyBudgetRow(budget), { onConflict: 'id' })
  assertRemoteSuccess(budgetError, 'Falha ao salvar orçamento')

  const byId = new Map(existingCategories.map((category) => [category.id, category]))
  const categories: BudgetCategory[] = input.categories.map((category, index) => {
    const existingCategory = category.id ? byId.get(category.id) : undefined
    const computedLimit = computeCategoryLimit(input.availableAmount, category)
    const base = existingCategory ? touchEntity(existingCategory) : createEntityBase('category')

    return {
      ...base,
      budgetId: budget.id,
      name: category.name.trim(),
      allocationType: category.allocationType,
      allocationValue: category.allocationValue,
      computedLimit,
      sortOrder: index,
      status: 'active'
    }
  })

  const nextIds = new Set(categories.map((category) => category.id))
  const archived = existingCategories
    .filter((category) => !nextIds.has(category.id))
    .map((category) => touchEntity({ ...category, status: 'archived' as const }))

  const rows = [...categories, ...archived].map(toBudgetCategoryRow)
  if (rows.length) {
    const { error: categoriesError } = await client
      .from('budget_categories')
      .upsert(rows, { onConflict: 'id' })
    assertRemoteSuccess(categoriesError, 'Falha ao salvar categorias')
  }

  return { budget, categories }
}

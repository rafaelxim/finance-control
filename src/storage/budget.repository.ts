import type { MonthKey } from '@/domain/shared/types'
import { createEntityBase, touchEntity } from '@/storage/repository'

import { computeCategoryLimit } from '@/domain/budget/allocation'
import type { BudgetCategory, BudgetDraftCategoryInput, MonthlyBudget } from '@/domain/budget/types'

import { db } from './database'

export async function getBudgetByMonth(month: MonthKey) {
  const budget = await db.monthlyBudgets.where('month').equals(month).first()
  if (!budget) return { budget: null, categories: [] as BudgetCategory[] }

  const categories = (await db.budgetCategories.where('budgetId').equals(budget.id).toArray()).sort(
    (left, right) => left.sortOrder - right.sortOrder
  )

  return { budget, categories }
}

export async function saveBudgetWithCategories(input: {
  month: MonthKey
  availableAmount: string
  categories: BudgetDraftCategoryInput[]
}): Promise<{ budget: MonthlyBudget; categories: BudgetCategory[] }> {
  return db.transaction('rw', db.monthlyBudgets, db.budgetCategories, async () => {
    const existing = await db.monthlyBudgets.where('month').equals(input.month).first()
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

    await db.monthlyBudgets.put(budget)

    const existingCategories = existing
      ? await db.budgetCategories.where('budgetId').equals(existing.id).toArray()
      : []
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

    await db.budgetCategories.bulkPut([...categories, ...archived])

    return { budget, categories }
  })
}

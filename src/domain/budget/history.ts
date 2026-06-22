import type { BudgetCategory, BudgetDraftCategoryInput } from '@/domain/budget/types'

export function createHistoricalBudgetCopy(
  categories: BudgetCategory[]
): BudgetDraftCategoryInput[] {
  return categories
    .filter((category) => category.status === 'active')
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((category) => ({
      name: category.name,
      allocationType: category.allocationType,
      allocationValue: category.allocationValue
    }))
}

export function archiveCategoryForHistory(category: BudgetCategory): BudgetCategory {
  return {
    ...category,
    status: 'archived'
  }
}

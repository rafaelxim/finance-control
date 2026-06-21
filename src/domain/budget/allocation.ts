import Decimal from 'decimal.js'

import {
  addMoney,
  compareMoney,
  percentOf,
  subtractMoney,
  toMoneyString
} from '@/domain/shared/money'

import type { BudgetCategory, BudgetDraftCategoryInput, BudgetTotals } from './types'

export function computeCategoryLimit(
  availableAmount: string,
  category: Pick<BudgetCategory | BudgetDraftCategoryInput, 'allocationType' | 'allocationValue'>
): string {
  if (category.allocationType === 'percentage') {
    return percentOf(availableAmount, category.allocationValue)
  }

  return toMoneyString(category.allocationValue)
}

export function withComputedLimits<T extends BudgetCategory | BudgetDraftCategoryInput>(
  availableAmount: string,
  categories: T[]
): Array<T & { computedLimit: string }> {
  return categories.map((category) => ({
    ...category,
    computedLimit: computeCategoryLimit(availableAmount, category)
  }))
}

export function calculateBudgetTotals(
  availableAmount: string,
  categories: Array<Pick<BudgetCategory, 'computedLimit' | 'status'>>
): BudgetTotals {
  const allocated = addMoney(
    categories
      .filter((category) => category.status === 'active')
      .map((category) => category.computedLimit)
  )
  const remaining = subtractMoney(availableAmount, allocated)

  if (compareMoney(remaining, 0) >= 0) {
    return {
      allocated,
      unallocated: remaining,
      overAllocated: '0.00'
    }
  }

  return {
    allocated,
    unallocated: '0.00',
    overAllocated: toMoneyString(new Decimal(remaining).abs())
  }
}

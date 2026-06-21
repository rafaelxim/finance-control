import Decimal from 'decimal.js'

import type { BudgetCategory } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import { addMoney, subtractMoney, toDecimal, toMoneyString } from '@/domain/shared/money'
import type { DecimalString, EntityId } from '@/domain/shared/types'

export type CategoryProgressState = 'safe' | 'warning' | 'limitReached' | 'overLimit'

export interface CategoryProgress {
  categoryId: EntityId
  categoryName: string
  limit: DecimalString
  spent: DecimalString
  remaining: DecimalString
  usagePercent: DecimalString
  state: CategoryProgressState
}

export function getProgressState(limit: string, spent: string): CategoryProgressState {
  const limitValue = toDecimal(limit)
  const spentValue = toDecimal(spent)

  if (limitValue.eq(0)) {
    return spentValue.gt(0) ? 'overLimit' : 'safe'
  }

  const usage = spentValue.div(limitValue).times(100)

  if (usage.gt(100)) return 'overLimit'
  if (usage.eq(100)) return 'limitReached'
  if (usage.gte(75)) return 'warning'
  return 'safe'
}

export function calculateUsagePercent(limit: string, spent: string): DecimalString {
  const limitValue = toDecimal(limit)
  const spentValue = toDecimal(spent)

  if (limitValue.eq(0)) {
    return spentValue.gt(0) ? '100.00' : '0.00'
  }

  return toMoneyString(spentValue.div(limitValue).times(100))
}

export function calculateCategoryProgress(
  categories: BudgetCategory[],
  expenses: Expense[]
): CategoryProgress[] {
  const spentByCategory = new Map<EntityId, Decimal>()

  for (const expense of expenses) {
    const current = spentByCategory.get(expense.categoryId) ?? new Decimal(0)
    spentByCategory.set(expense.categoryId, current.plus(toDecimal(expense.amount)))
  }

  return categories
    .filter((category) => category.status === 'active')
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((category) => {
      const spent = toMoneyString(spentByCategory.get(category.id) ?? 0)
      const remaining = subtractMoney(category.computedLimit, spent)

      return {
        categoryId: category.id,
        categoryName: category.name,
        limit: category.computedLimit,
        spent,
        remaining,
        usagePercent: calculateUsagePercent(category.computedLimit, spent),
        state: getProgressState(category.computedLimit, spent)
      }
    })
}

export function calculateTotalSpent(expenses: Expense[]): DecimalString {
  return addMoney(expenses.map((expense) => expense.amount))
}

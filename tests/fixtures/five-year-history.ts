import type { Page } from '@playwright/test'

import type { DataExportPayload } from '@/domain/shared/data-export'

export const FIVE_YEAR_CURRENT_MONTH = '2026-06'
export const FIVE_YEAR_FIRST_CATEGORY_NAME = 'Categoria 01'

const MONTH_COUNT = 60
const CATEGORIES_PER_MONTH = 20
const EXPENSE_COUNT = 5000
const BALANCE_ITEMS_PER_MONTH = 20
const START_YEAR = 2021
const START_MONTH_INDEX = 6
const CREATED_AT = '2026-06-22T00:00:00.000Z'

function monthKey(index: number) {
  const absoluteMonth = START_YEAR * 12 + START_MONTH_INDEX + index
  const year = Math.floor(absoluteMonth / 12)
  const month = (absoluteMonth % 12) + 1
  return `${year}-${String(month).padStart(2, '0')}`
}

function dateFor(month: string, daySeed: number) {
  return `${month}-${String((daySeed % 28) + 1).padStart(2, '0')}`
}

function money(amount: number) {
  return amount.toFixed(2)
}

const monthlyBudgets = Array.from({ length: MONTH_COUNT }, (_, monthIndex) => {
  const month = monthKey(monthIndex)

  return {
    id: `budget_${month}`,
    month,
    availableAmount: money(9000 + monthIndex * 25),
    status: 'active' as const,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  }
})

const budgetCategories = monthlyBudgets.flatMap((budget) =>
  Array.from({ length: CATEGORIES_PER_MONTH }, (_, categoryIndex) => ({
    id: `category_${budget.month}_${categoryIndex}`,
    budgetId: budget.id,
    name: `Categoria ${String(categoryIndex + 1).padStart(2, '0')}`,
    allocationType: 'fixed' as const,
    allocationValue: money(150 + categoryIndex * 10),
    computedLimit: money(150 + categoryIndex * 10),
    sortOrder: categoryIndex,
    status: 'active' as const,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  }))
)

const expenses = Array.from({ length: EXPENSE_COUNT }, (_, expenseIndex) => {
  const monthIndex = expenseIndex % MONTH_COUNT
  const categoryIndex = expenseIndex % CATEGORIES_PER_MONTH
  const budget = monthlyBudgets[monthIndex]

  return {
    id: `expense_${expenseIndex}`,
    budgetId: budget.id,
    categoryId: `category_${budget.month}_${categoryIndex}`,
    amount: money(5 + (expenseIndex % 37)),
    date: dateFor(budget.month, expenseIndex),
    description: `Despesa ${expenseIndex + 1}`,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  }
})

const balanceSnapshots = monthlyBudgets.map((budget) => ({
  id: `snapshot_${budget.month}`,
  month: budget.month,
  notes: 'Fixture de performance',
  createdAt: CREATED_AT,
  updatedAt: CREATED_AT
}))

const balanceItems = balanceSnapshots.flatMap((snapshot, monthIndex) =>
  Array.from({ length: BALANCE_ITEMS_PER_MONTH }, (_, itemIndex) => {
    const kind = itemIndex < 12 ? 'asset' : 'debt'
    const baseAmount = kind === 'asset' ? 1200 + itemIndex * 140 : 250 + itemIndex * 30

    return {
      id: `balance_item_${snapshot.month}_${itemIndex}`,
      snapshotId: snapshot.id,
      name: `${kind === 'asset' ? 'Ativo' : 'Divida'} ${String(itemIndex + 1).padStart(2, '0')}`,
      kind,
      amount: money(baseAmount + monthIndex * 20),
      institution: `Instituicao ${String(itemIndex + 1).padStart(2, '0')}`,
      sortOrder: itemIndex,
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT
    }
  })
)

export const fiveYearHistoryPayload: DataExportPayload = {
  schemaVersion: 1,
  exportedAt: CREATED_AT,
  profile: {
    id: 'local-user',
    currency: 'BRL',
    activeMonth: FIVE_YEAR_CURRENT_MONTH,
    themeMode: 'system',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT
  },
  monthlyBudgets,
  budgetCategories,
  expenses,
  balanceSnapshots,
  balanceItems,
  visualPreferences: {
    categoryVisuals: {
      [FIVE_YEAR_FIRST_CATEGORY_NAME]: '#fcd535'
    }
  }
}

export async function seedFiveYearHistory(page: Page) {
  await page.goto('/configuracoes')
  await page.locator('#import-json').fill(JSON.stringify(fiveYearHistoryPayload))
  await page.getByRole('button', { name: 'Importar JSON' }).click()
  await page.getByText('Importação concluída.').waitFor()
}

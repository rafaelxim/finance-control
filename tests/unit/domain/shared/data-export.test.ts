import { describe, expect, it } from 'vitest'

import { DATA_EXPORT_SCHEMA_VERSION, type DataExportPayload } from '@/domain/shared/data-export'
import { validateDataExportPayload } from '@/domain/shared/data-export.validation'

function basePayload(): DataExportPayload {
  return {
    schemaVersion: DATA_EXPORT_SCHEMA_VERSION,
    exportedAt: '2026-06-22T00:00:00.000Z',
    profile: null,
    monthlyBudgets: [
      {
        id: 'budget_1',
        month: '2026-06',
        availableAmount: '1000.00',
        status: 'active',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z'
      }
    ],
    budgetCategories: [
      {
        id: 'category_1',
        budgetId: 'budget_1',
        name: 'Comida',
        allocationType: 'fixed',
        allocationValue: '300.00',
        computedLimit: '300.00',
        sortOrder: 0,
        status: 'active',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z'
      }
    ],
    expenses: [],
    balanceSnapshots: [],
    balanceItems: [],
    visualPreferences: {}
  }
}

describe('data export validation', () => {
  it('accepts a complete export payload', () => {
    expect(validateDataExportPayload(basePayload())).toEqual([])
  })

  it('reports missing references before import', () => {
    const payload = basePayload()
    payload.expenses.push({
      id: 'expense_1',
      budgetId: 'budget_missing',
      categoryId: 'category_missing',
      amount: '10.00',
      date: '2026-06-02',
      createdAt: '2026-06-02T00:00:00.000Z',
      updatedAt: '2026-06-02T00:00:00.000Z'
    })

    expect(validateDataExportPayload(payload)).toEqual([
      'Despesa expense_1 referencia orçamento inexistente',
      'Despesa expense_1 referencia categoria inexistente'
    ])
  })
})

import { describe, expect, it } from 'vitest'

import { DATA_EXPORT_SCHEMA_VERSION } from '@/domain/shared/data-export'
import { db } from '@/storage/database'
import { exportLocalData, importLocalData } from '@/storage/data-export.repository'

describe('local data export/import', () => {
  it('round trips local finance data through JSON payload', async () => {
    await db.delete()
    await db.open()

    await db.monthlyBudgets.put({
      id: 'budget_1',
      month: '2026-06',
      availableAmount: '1000.00',
      status: 'active',
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-01T00:00:00.000Z'
    })
    await db.budgetCategories.put({
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
    })

    const payload = await exportLocalData()
    expect(payload.schemaVersion).toBe(DATA_EXPORT_SCHEMA_VERSION)
    expect(payload.budgetCategories).toHaveLength(1)

    await db.monthlyBudgets.clear()
    await db.budgetCategories.clear()
    await importLocalData(JSON.parse(JSON.stringify(payload)))

    expect(await db.monthlyBudgets.count()).toBe(1)
    expect(await db.budgetCategories.count()).toBe(1)
  })
})

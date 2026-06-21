import { describe, expect, it } from 'vitest'

import { FinanceDatabase } from '@/storage/database'

describe('FinanceDatabase', () => {
  it('declares required IndexedDB tables', async () => {
    const database = new FinanceDatabase('finance-control-schema-test')
    await database.open()

    expect(database.tables.map((table) => table.name).sort()).toEqual([
      'budgetCategories',
      'expenses',
      'monthlyBudgets',
      'profiles'
    ])

    database.close()
    await database.delete()
  })
})

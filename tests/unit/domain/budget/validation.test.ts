import { describe, expect, it } from 'vitest'

import { budgetCategorySchema, monthlyBudgetSchema } from '@/domain/budget/schemas'

describe('budget validation', () => {
  it('accepts valid monthly budgets and categories', () => {
    expect(
      monthlyBudgetSchema.safeParse({
        month: '2026-06',
        availableAmount: '1000.00',
        status: 'active'
      }).success
    ).toBe(true)

    expect(
      budgetCategorySchema.safeParse({
        name: 'Comida',
        allocationType: 'percentage',
        allocationValue: '30'
      }).success
    ).toBe(true)
  })

  it('rejects negative values and invalid percentages', () => {
    expect(
      monthlyBudgetSchema.safeParse({
        month: '2026-06',
        availableAmount: '-1.00',
        status: 'active'
      }).success
    ).toBe(false)

    expect(
      budgetCategorySchema.safeParse({
        name: 'Comida',
        allocationType: 'percentage',
        allocationValue: '120'
      }).success
    ).toBe(false)
  })
})

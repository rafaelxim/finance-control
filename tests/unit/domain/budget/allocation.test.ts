import { describe, expect, it } from 'vitest'

import {
  calculateBudgetTotals,
  computeCategoryLimit,
  withComputedLimits
} from '@/domain/budget/allocation'

describe('budget allocation', () => {
  it('computes fixed and percentage category limits', () => {
    expect(
      computeCategoryLimit('1000.00', { allocationType: 'fixed', allocationValue: '400.00' })
    ).toBe('400.00')
    expect(
      computeCategoryLimit('1500.00', { allocationType: 'percentage', allocationValue: '10' })
    ).toBe('150.00')
  })

  it('calculates allocated and unallocated totals', () => {
    const categories = withComputedLimits('1000.00', [
      { name: 'Aluguel', allocationType: 'fixed', allocationValue: '400.00' },
      { name: 'Comida', allocationType: 'fixed', allocationValue: '300.00' },
      { name: 'Lazer', allocationType: 'fixed', allocationValue: '100.00' }
    ]).map((category) => ({ ...category, status: 'active' as const }))

    expect(calculateBudgetTotals('1000.00', categories)).toEqual({
      allocated: '800.00',
      unallocated: '200.00',
      overAllocated: '0.00'
    })
  })

  it('reports over-allocation when category limits exceed available amount', () => {
    expect(
      calculateBudgetTotals('1000.00', [
        { computedLimit: '700.00', status: 'active' },
        { computedLimit: '500.00', status: 'active' }
      ])
    ).toEqual({
      allocated: '1200.00',
      unallocated: '0.00',
      overAllocated: '200.00'
    })
  })
})

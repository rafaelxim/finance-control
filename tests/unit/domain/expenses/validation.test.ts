import { describe, expect, it } from 'vitest'

import { validateExpenseForBudget } from '@/domain/expenses/schemas'

const budget = {
  id: 'budget_1',
  month: '2026-06' as const
}

const categories = [
  {
    id: 'category_food',
    budgetId: 'budget_1',
    status: 'active' as const
  }
]

describe('expense validation', () => {
  it('accepts a positive expense assigned to a category in the same budget month', () => {
    const errors = validateExpenseForBudget(
      {
        budgetId: 'budget_1',
        categoryId: 'category_food',
        amount: '75.00',
        date: '2026-06-21',
        description: 'Mercado'
      },
      budget,
      categories
    )

    expect(errors).toEqual([])
  })

  it('rejects negative amounts, cross-month dates, and categories from another budget', () => {
    const errors = validateExpenseForBudget(
      {
        budgetId: 'budget_1',
        categoryId: 'category_other',
        amount: '-10.00',
        date: '2026-07-01'
      },
      budget,
      [
        {
          id: 'category_other',
          budgetId: 'budget_2',
          status: 'active'
        }
      ]
    )

    expect(errors).toContain('Informe um valor maior que zero')
    expect(errors).toContain('Data da despesa deve estar dentro do mês do orçamento')
    expect(errors).toContain('Categoria deve pertencer ao mesmo orçamento da despesa')
  })
})

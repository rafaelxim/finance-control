import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ExpenseForm from '@/components/finance/ExpenseForm.vue'
import type { BudgetCategory } from '@/domain/budget/types'

const categories: BudgetCategory[] = [
  {
    id: 'category_food',
    budgetId: 'budget_1',
    name: 'Comida',
    allocationType: 'fixed',
    allocationValue: '300.00',
    computedLimit: '300.00',
    sortOrder: 0,
    status: 'active',
    createdAt: '2026-06-21T00:00:00.000Z',
    updatedAt: '2026-06-21T00:00:00.000Z'
  }
]

describe('ExpenseForm', () => {
  it('validates required fields before emitting submit', async () => {
    const wrapper = mount(ExpenseForm, {
      props: {
        budgetId: 'budget_1',
        categories,
        defaultDate: '2026-06-21'
      }
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Informe um valor')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('emits expense data and exposes category creation shortcut', async () => {
    const wrapper = mount(ExpenseForm, {
      props: {
        budgetId: 'budget_1',
        categories,
        defaultDate: '2026-06-21'
      }
    })

    await wrapper.get('#expense-amount').setValue('75,00')
    await wrapper.get('#expense-description').setValue('Mercado')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]).toEqual([
      {
        budgetId: 'budget_1',
        categoryId: 'category_food',
        amount: '75,00',
        date: '2026-06-21',
        description: 'Mercado'
      }
    ])

    await wrapper.get('[data-test="create-category"]').trigger('click')
    expect(wrapper.emitted('create-category')).toHaveLength(1)
  })
})

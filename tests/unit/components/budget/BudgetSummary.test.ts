import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BudgetSummary from '@/components/budget/BudgetSummary.vue'

describe('BudgetSummary', () => {
  it('renders budget totals and over-allocation state', () => {
    const wrapper = mount(BudgetSummary, {
      props: {
        availableAmount: '1000.00',
        allocated: '1200.00',
        unallocated: '0.00',
        overAllocated: '200.00'
      }
    })

    expect(wrapper.text()).toContain('Disponível')
    expect(wrapper.text()).toContain('Alocado')
    expect(wrapper.text()).toContain('Não alocado')
    expect(wrapper.text()).toContain('Excedente')
    expect(wrapper.text()).toContain('200')
    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('budget-summary-title')
    expect(wrapper.find('.danger').exists()).toBe(true)
    expect(wrapper.find('.panel--budget').exists()).toBe(true)
    expect(wrapper.findAll('.metric--featured')).toHaveLength(2)
    expect(wrapper.findAll('.money--primary').length).toBe(4)
  })

  it('renders total spent mode without allocation balance indicators', () => {
    const wrapper = mount(BudgetSummary, {
      props: {
        availableAmount: '1000.00',
        allocated: '800.00',
        unallocated: '200.00',
        overAllocated: '0.00',
        totalSpent: '350.50',
        title: 'Orçamento do mês'
      }
    })

    expect(wrapper.text()).toContain('Orçamento do mês')
    expect(wrapper.text()).toContain('Disponível')
    expect(wrapper.text()).toContain('Alocado')
    expect(wrapper.text()).toContain('Total gasto')
    expect(wrapper.text()).toContain('350')
    expect(wrapper.text()).not.toContain('Não alocado')
    expect(wrapper.text()).not.toContain('Excedente')
    expect(wrapper.find('.metric--spent').exists()).toBe(true)
    expect(wrapper.findAll('.metric--featured')).toHaveLength(1)
    expect(wrapper.findAll('.money--primary').length).toBe(3)
  })
})

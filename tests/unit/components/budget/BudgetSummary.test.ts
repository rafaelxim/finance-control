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

    expect(wrapper.text()).toContain('Valor mensal disponível')
    expect(wrapper.text()).toContain('Alocado')
    expect(wrapper.text()).toContain('Não alocado')
    expect(wrapper.text()).toContain('Excedente')
    expect(wrapper.text()).toContain('200')
    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('budget-summary-title')
    expect(wrapper.find('.danger').exists()).toBe(true)
    expect(wrapper.find('.panel--budget').exists()).toBe(true)
    expect(wrapper.findAll('.metric--featured')).toHaveLength(2)
    expect(wrapper.findAll('.money--primary').length).toBe(3)
  })

  it('renders the unallocated amount without an excess metric', () => {
    const wrapper = mount(BudgetSummary, {
      props: {
        availableAmount: '1000.00',
        allocated: '800.00',
        unallocated: '200.00',
        overAllocated: '0.00',
        title: 'Orçamento do mês'
      }
    })

    expect(wrapper.text()).toContain('Orçamento do mês')
    expect(wrapper.text()).toContain('Valor mensal disponível')
    expect(wrapper.text()).toContain('Alocado')
    expect(wrapper.text()).toContain('Não alocado')
    expect(wrapper.text()).toContain('200')
    expect(wrapper.text()).not.toContain('Total gasto')
    expect(wrapper.text()).not.toContain('Excedente')
    expect(wrapper.findAll('.metric--featured')).toHaveLength(1)
    expect(wrapper.findAll('.money--primary').length).toBe(2)
  })

  it('emits available amount edits', async () => {
    const wrapper = mount(BudgetSummary, {
      props: {
        availableAmount: '1000.00',
        allocated: '800.00',
        unallocated: '200.00',
        overAllocated: '0.00'
      }
    })

    await wrapper.get('#available-amount').setValue('2500')

    expect(wrapper.emitted('update:availableAmount')?.[0]).toEqual(['2500'])
  })
})

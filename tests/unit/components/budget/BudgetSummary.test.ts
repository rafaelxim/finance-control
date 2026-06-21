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
    expect(wrapper.text()).toContain('Excedente')
    expect(wrapper.text()).toContain('200')
  })
})

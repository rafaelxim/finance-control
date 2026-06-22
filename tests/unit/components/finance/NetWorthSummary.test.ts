import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NetWorthSummary from '@/components/finance/NetWorthSummary.vue'

describe('NetWorthSummary', () => {
  it('renders patrimony totals with positive variation state', () => {
    const wrapper = mount(NetWorthSummary, {
      props: {
        totals: {
          assetsTotal: '3000.00',
          debtsTotal: '500.00',
          netWorth: '2500.00'
        },
        change: '100.00'
      }
    })

    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('net-worth-summary-title')
    expect(wrapper.text()).toContain('Patrimônio')
    expect(wrapper.text()).toContain('Ativos')
    expect(wrapper.text()).toContain('Dívidas')
    expect(wrapper.text()).toContain('Patrimônio líquido')
    expect(wrapper.find('.positive').exists()).toBe(true)
    expect(wrapper.find('.panel--patrimony').exists()).toBe(true)
    expect(wrapper.findAll('.metric--featured')).toHaveLength(2)
  })

  it('renders negative and neutral variation states', () => {
    const negative = mount(NetWorthSummary, {
      props: {
        totals: {
          assetsTotal: '3000.00',
          debtsTotal: '500.00',
          netWorth: '2500.00'
        },
        change: '-50.00'
      }
    })

    const neutral = mount(NetWorthSummary, {
      props: {
        totals: {
          assetsTotal: '3000.00',
          debtsTotal: '500.00',
          netWorth: '2500.00'
        },
        change: '0.00'
      }
    })

    expect(negative.find('.negative').exists()).toBe(true)
    expect(neutral.text()).toMatch(/R\$\s*0,00/)
  })
})

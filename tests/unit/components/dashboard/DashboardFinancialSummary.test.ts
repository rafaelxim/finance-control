import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DashboardFinancialSummary from '@/components/finance/DashboardFinancialSummary.vue'

describe('DashboardFinancialSummary', () => {
  it('renders a balance-backed primary amount with state and comparison', () => {
    const wrapper = mount(DashboardFinancialSummary, {
      props: {
        summary: {
          label: 'Patrimônio líquido',
          primaryAmount: '12500.00',
          comparisonLabel: 'Variação mais recente',
          comparisonAmount: '-300.00',
          state: 'negative',
          source: 'balance'
        }
      }
    })

    expect(wrapper.attributes('data-state')).toBe('negative')
    expect(wrapper.text()).toContain('Patrimônio líquido')
    expect(wrapper.text()).toContain('Negativo')
    expect(wrapper.text()).toContain('-R$')
    expect(wrapper.text()).toContain('Baseado no último balanço')
  })

  it('renders a budget-backed fallback without fake balance data', () => {
    const wrapper = mount(DashboardFinancialSummary, {
      props: {
        summary: {
          label: 'Saldo disponível do mês',
          primaryAmount: '200.00',
          comparisonLabel: 'Ainda não alocado',
          comparisonAmount: '200.00',
          state: 'positive',
          source: 'budget'
        }
      }
    })

    expect(wrapper.attributes('data-state')).toBe('positive')
    expect(wrapper.text()).toContain('Saldo disponível do mês')
    expect(wrapper.text()).toContain('Positivo')
    expect(wrapper.text()).toContain('Baseado no orçamento do mês')
    expect(wrapper.text()).not.toContain('Baseado no último balanço')
  })

  it('keeps long BRL values readable in the rendered text', () => {
    const wrapper = mount(DashboardFinancialSummary, {
      props: {
        summary: {
          label: 'Patrimônio líquido',
          primaryAmount: '123456789.99',
          comparisonLabel: 'Variação mais recente',
          comparisonAmount: '9876543.21',
          state: 'positive',
          source: 'balance'
        }
      }
    })

    expect(wrapper.text()).toContain('R$')
    expect(wrapper.find('.money--hero').exists()).toBe(true)
  })
})

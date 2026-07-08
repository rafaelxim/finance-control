import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('vue-chartjs', () => ({
  Bar: {
    template: '<div data-testid="bar-chart" />'
  }
}))

import DashboardBudgetSummary from '@/components/finance/DashboardBudgetSummary.vue'

function normalizedText(wrapper: ReturnType<typeof mount>) {
  return wrapper.text().replace(/\s+/g, ' ')
}

describe('DashboardBudgetSummary', () => {
  it('computes available budget as allocated minus spent', () => {
    const wrapper = mount(DashboardBudgetSummary, {
      props: {
        allocatedAmount: '800.00',
        spentAmount: '350.50',
        overAllocatedAmount: '0.00',
        month: '2026-06',
        expenses: []
      },
      global: {
        stubs: {
          Bar: true
        }
      }
    })

    expect(normalizedText(wrapper)).toContain('Disponível')
    expect(normalizedText(wrapper)).toContain('R$ 449,50')
    expect(normalizedText(wrapper)).toContain('43,8%')
    expect(wrapper.attributes('data-state')).toBe('positive')
  })

  it('shows a negative state when spending exceeds allocated budget', () => {
    const wrapper = mount(DashboardBudgetSummary, {
      props: {
        allocatedAmount: '800.00',
        spentAmount: '1000.00',
        overAllocatedAmount: '0.00',
        month: '2026-06',
        expenses: []
      },
      global: {
        stubs: {
          Bar: true
        }
      }
    })

    expect(normalizedText(wrapper)).toContain('-R$ 200,00')
    expect(wrapper.attributes('data-state')).toBe('negative')
  })
})

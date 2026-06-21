import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MarketCategoryCard from '@/components/budget/MarketCategoryCard.vue'

describe('MarketCategoryCard', () => {
  it('renders accessible safe state with currency values', () => {
    const wrapper = mount(MarketCategoryCard, {
      props: {
        progress: {
          categoryId: 'category_food',
          categoryName: 'Comida',
          limit: '300.00',
          spent: '75.00',
          remaining: '225.00',
          usagePercent: '25.00',
          state: 'safe'
        }
      }
    })

    expect(wrapper.attributes('aria-label')).toContain('Seguro')
    expect(wrapper.text()).toContain('Comida')
    expect(wrapper.text()).toContain('Gasto')
    expect(wrapper.text()).toContain('Restante')
    expect(wrapper.text()).toContain('R$')
  })

  it('renders over-limit text state without relying only on color', () => {
    const wrapper = mount(MarketCategoryCard, {
      props: {
        progress: {
          categoryId: 'category_food',
          categoryName: 'Comida',
          limit: '300.00',
          spent: '325.00',
          remaining: '-25.00',
          usagePercent: '108.33',
          state: 'overLimit'
        }
      }
    })

    expect(wrapper.attributes('data-state')).toBe('overLimit')
    expect(wrapper.text()).toContain('Limite excedido')
    expect(wrapper.text()).toContain('-R$')
  })
})

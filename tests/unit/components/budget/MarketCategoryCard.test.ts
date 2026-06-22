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
    expect(wrapper.text()).toContain('25% usado')
    expect(wrapper.text()).toContain('R$')
  })

  it('renders warning, limit reached, and over-limit text states without relying only on color', () => {
    const warning = mount(MarketCategoryCard, {
      props: {
        progress: {
          categoryId: 'category_food',
          categoryName: 'Comida',
          limit: '300.00',
          spent: '250.00',
          remaining: '50.00',
          usagePercent: '83.33',
          state: 'warning'
        }
      }
    })
    const limitReached = mount(MarketCategoryCard, {
      props: {
        progress: {
          categoryId: 'category_food',
          categoryName: 'Comida',
          limit: '300.00',
          spent: '300.00',
          remaining: '0.00',
          usagePercent: '100.00',
          state: 'limitReached'
        }
      }
    })
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

    expect(warning.text()).toContain('Atenção')
    expect(warning.text()).toContain('83% usado')
    expect(limitReached.text()).toContain('Limite atingido')
    expect(wrapper.attributes('data-state')).toBe('overLimit')
    expect(wrapper.text()).toContain('Limite excedido')
    expect(wrapper.text()).toContain('Déficit')
    expect(wrapper.text()).toContain('108% usado')
    expect(wrapper.text()).toContain('-R$')
  })
})

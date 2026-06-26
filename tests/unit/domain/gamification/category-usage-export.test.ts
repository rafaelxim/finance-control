import { describe, expect, it } from 'vitest'

import type { CategoryProgress } from '@/domain/gamification/category-progress'
import { formatCategoryUsageForSharing } from '@/domain/gamification/category-usage-export'

describe('category usage export', () => {
  it('formats category usage as shareable plain text', () => {
    const progress: CategoryProgress[] = [
      {
        categoryId: 'category_food',
        categoryName: 'Comida',
        limit: '300.00',
        spent: '75.00',
        remaining: '225.00',
        usagePercent: '25.00',
        state: 'safe'
      },
      {
        categoryId: 'category_fun',
        categoryName: 'Lazer',
        limit: '100.00',
        spent: '125.00',
        remaining: '-25.00',
        usagePercent: '125.00',
        state: 'overLimit'
      }
    ]

    expect(formatCategoryUsageForSharing(progress, '2026-06')).toBe(
      [
        '*Uso por categoria*',
        '',
        'Mês: 2026-06',
        '',
        'Total gasto: *R$ 200,00*',
        '',
        '*Comida*',
        'Gasto: R$ 75,00 de R$ 300,00',
        'Uso: 25%',
        'Restante: R$ 225,00',
        'Status: *Seguro*',
        '',
        '*Lazer*',
        'Gasto: R$ 125,00 de R$ 100,00',
        'Uso: 125%',
        'Déficit: -R$ 25,00',
        'Status: *Limite excedido*'
      ].join('\n')
    )
  })
})

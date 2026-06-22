import { describe, expect, it } from 'vitest'

import { validateBalanceSnapshotDraft } from '@/domain/balance/schemas'

describe('balance validation', () => {
  it('accepts asset and debt items with non-negative amounts', () => {
    const errors = validateBalanceSnapshotDraft({
      month: '2026-06',
      items: [
        { name: 'Banco e investimentos', kind: 'asset', amount: '7000.00', sortOrder: 0 },
        { name: 'Cartões', kind: 'debt', amount: '1200.00', sortOrder: 1 }
      ]
    })

    expect(errors).toEqual([])
  })

  it('rejects missing item names and negative balances', () => {
    const errors = validateBalanceSnapshotDraft({
      month: '2026-06',
      items: [{ name: '', kind: 'asset', amount: '-1.00', sortOrder: 0 }]
    })

    expect(errors).toContain('Campo obrigatório')
    expect(errors).toContain('Informe um valor maior ou igual a zero')
  })
})

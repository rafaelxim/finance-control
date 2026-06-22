import { describe, expect, it } from 'vitest'

import { createBalanceCarryOverDraft } from '@/domain/balance/carry-over'
import type { BalanceItem } from '@/domain/balance/types'

function item(input: Partial<BalanceItem> & Pick<BalanceItem, 'name' | 'kind' | 'sortOrder'>) {
  return {
    id: `item_${input.sortOrder}`,
    snapshotId: 'snapshot_1',
    amount: input.amount ?? '999.00',
    createdAt: '2026-06-21T00:00:00.000Z',
    updatedAt: '2026-06-21T00:00:00.000Z',
    ...input
  }
}

describe('balance carry-over', () => {
  it('copies item identity fields into an editable draft and resets amounts', () => {
    const draft = createBalanceCarryOverDraft([
      item({
        name: 'Cartao principal',
        kind: 'debt',
        amount: '1200.00',
        institution: 'Banco A',
        notes: 'Fechamento dia 10',
        sortOrder: 1
      }),
      item({
        name: 'Conta corrente',
        kind: 'asset',
        amount: '7000.00',
        institution: 'Banco B',
        sortOrder: 0
      })
    ])

    expect(draft).toEqual([
      {
        name: 'Conta corrente',
        kind: 'asset',
        amount: '0.00',
        institution: 'Banco B',
        notes: undefined,
        sortOrder: 0
      },
      {
        name: 'Cartao principal',
        kind: 'debt',
        amount: '0.00',
        institution: 'Banco A',
        notes: 'Fechamento dia 10',
        sortOrder: 1
      }
    ])
    expect(draft.every((draftItem) => draftItem.id === undefined)).toBe(true)
  })
})

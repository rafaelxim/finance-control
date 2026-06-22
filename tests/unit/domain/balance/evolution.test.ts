import { describe, expect, it } from 'vitest'

import { calculateBalanceTotals, calculateFinancialEvolution } from '@/domain/balance/evolution'
import type { BalanceItem, BalanceSnapshotWithItems } from '@/domain/balance/types'

function item(kind: BalanceItem['kind'], amount: string): BalanceItem {
  return {
    id: `${kind}_${amount}`,
    snapshotId: 'snapshot_1',
    name: kind,
    kind,
    amount,
    sortOrder: 0,
    createdAt: '2026-06-21T00:00:00.000Z',
    updatedAt: '2026-06-21T00:00:00.000Z'
  }
}

describe('balance evolution', () => {
  it('treats assets as net-worth increases and debts as reductions', () => {
    expect(
      calculateBalanceTotals([
        item('asset', '2000.00'),
        item('asset', '5000.00'),
        item('debt', '1200.00')
      ])
    ).toEqual({
      assetsTotal: '7000.00',
      debtsTotal: '1200.00',
      netWorth: '5800.00'
    })
  })

  it('calculates month-over-month net worth variation in chronological order', () => {
    const snapshots: BalanceSnapshotWithItems[] = [
      {
        snapshot: {
          id: 'snapshot_current',
          month: '2026-06',
          createdAt: '2026-06-21T00:00:00.000Z',
          updatedAt: '2026-06-21T00:00:00.000Z'
        },
        items: [item('asset', '7000.00'), item('debt', '1200.00')]
      },
      {
        snapshot: {
          id: 'snapshot_previous',
          month: '2026-05',
          createdAt: '2026-05-21T00:00:00.000Z',
          updatedAt: '2026-05-21T00:00:00.000Z'
        },
        items: [item('asset', '5000.00')]
      }
    ]

    const evolution = calculateFinancialEvolution(snapshots)

    expect(evolution.map((entry) => entry.month)).toEqual(['2026-05', '2026-06'])
    expect(evolution[1]).toMatchObject({
      previousNetWorth: '5000.00',
      netWorth: '5800.00',
      netWorthChange: '800.00',
      netWorthChangePercent: '16.00'
    })
  })
})

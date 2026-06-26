import { afterEach, describe, expect, it } from 'vitest'

import {
  deleteBalanceItem,
  getBalanceHistory,
  getBalanceSnapshotByMonth,
  getLatestBalanceSnapshotWithItems,
  saveBalanceSnapshot
} from '@/storage/balance.repository'
import { setSupabaseClientForTests } from '@/storage/supabase/client'
import { createInMemorySupabaseClient } from '@tests/fixtures/supabase/client'

const timestamp = '2026-06-01T00:00:00.000Z'

describe('balance remote repository', () => {
  afterEach(() => setSupabaseClientForTests(null))

  it('loads monthly snapshots, latest populated snapshot, and ordered history', async () => {
    const { client } = createInMemorySupabaseClient({
      balance_snapshots: [
        { id: 'snapshot_1', month: '2026-05', notes: null, created_at: timestamp, updated_at: timestamp },
        { id: 'snapshot_2', month: '2026-06', notes: 'Atual', created_at: timestamp, updated_at: timestamp }
      ],
      balance_items: [
        {
          id: 'item_2',
          snapshot_id: 'snapshot_2',
          name: 'Cartao',
          kind: 'debt',
          amount: '200.00',
          institution: null,
          notes: null,
          sort_order: 1,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          id: 'item_1',
          snapshot_id: 'snapshot_2',
          name: 'Conta',
          kind: 'asset',
          amount: '1000.00',
          institution: 'Banco',
          notes: null,
          sort_order: 0,
          created_at: timestamp,
          updated_at: timestamp
        }
      ]
    })
    setSupabaseClientForTests(client)

    const month = await getBalanceSnapshotByMonth('2026-06')
    expect(month.items.map((item) => item.id)).toEqual(['item_1', 'item_2'])
    expect((await getLatestBalanceSnapshotWithItems())?.snapshot.id).toBe('snapshot_2')
    expect((await getBalanceHistory()).map((entry) => entry.snapshot.id)).toEqual([
      'snapshot_1',
      'snapshot_2'
    ])
  })

  it('saves snapshots and deletes removed items', async () => {
    const { client, store } = createInMemorySupabaseClient({
      balance_snapshots: [
        { id: 'snapshot_1', month: '2026-06', notes: null, created_at: timestamp, updated_at: timestamp }
      ],
      balance_items: [
        {
          id: 'item_keep',
          snapshot_id: 'snapshot_1',
          name: 'Conta',
          kind: 'asset',
          amount: '1000.00',
          institution: null,
          notes: null,
          sort_order: 0,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          id: 'item_delete',
          snapshot_id: 'snapshot_1',
          name: 'Cartao',
          kind: 'debt',
          amount: '100.00',
          institution: null,
          notes: null,
          sort_order: 1,
          created_at: timestamp,
          updated_at: timestamp
        }
      ]
    })
    setSupabaseClientForTests(client)

    await saveBalanceSnapshot({
      month: '2026-06',
      notes: 'Fechamento',
      items: [{ id: 'item_keep', name: 'Conta', kind: 'asset', amount: '1200.00', sortOrder: 0 }]
    })

    expect(store.balance_items.map((item) => item.id)).toEqual(['item_keep'])
    await deleteBalanceItem('item_keep')
    expect(store.balance_items).toHaveLength(0)
  })
})

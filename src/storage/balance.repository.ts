import type {
  BalanceDraftItemInput,
  BalanceItem,
  BalanceItemKind,
  BalanceSnapshot,
  BalanceSnapshotWithItems
} from '@/domain/balance/types'
import { toMoneyString } from '@/domain/shared/money'
import type { EntityId, MonthKey } from '@/domain/shared/types'
import { createEntityBase, touchEntity } from '@/storage/repository'

import {
  fromBalanceItemRow,
  fromBalanceSnapshotRow,
  toBalanceItemRow,
  toBalanceSnapshotRow
} from './supabase/mappers'
import { assertRemoteSuccess, supabaseClient } from './supabase/query-helpers'

function normalizeBalanceItemKind(kind: string): BalanceItemKind {
  return kind === 'debt' || kind === 'creditCard' ? 'debt' : 'asset'
}

function normalizeBalanceItem<T extends { kind: string }>(
  item: T
): Omit<T, 'kind'> & { kind: BalanceItemKind } {
  return {
    ...item,
    kind: normalizeBalanceItemKind(item.kind)
  }
}

export async function getBalanceSnapshotByMonth(
  month: MonthKey
): Promise<{ snapshot: BalanceSnapshot | null; items: BalanceItem[] }> {
  const client = supabaseClient()
  const { data: snapshotRow, error: snapshotError } = await client
    .from('balance_snapshots')
    .select('*')
    .eq('month', month)
    .maybeSingle()
  assertRemoteSuccess(snapshotError, 'Falha ao carregar balanço')

  const snapshot = snapshotRow ? fromBalanceSnapshotRow(snapshotRow) : null
  if (!snapshot) return { snapshot: null, items: [] }

  const { data: itemRows, error: itemsError } = await client
    .from('balance_items')
    .select('*')
    .eq('snapshot_id', snapshot.id)
    .order('sort_order', { ascending: true })
  assertRemoteSuccess(itemsError, 'Falha ao carregar itens do balanço')

  return {
    snapshot,
    items: (itemRows ?? []).map(fromBalanceItemRow).map(normalizeBalanceItem)
  }
}

export async function getLatestBalanceSnapshotWithItems(): Promise<BalanceSnapshotWithItems | null> {
  const client = supabaseClient()
  const { data: snapshotRows, error } = await client
    .from('balance_snapshots')
    .select('*')
    .order('month', { ascending: false })
  assertRemoteSuccess(error, 'Falha ao carregar histórico de balanço')

  for (const snapshot of (snapshotRows ?? []).map(fromBalanceSnapshotRow)) {
    const { data: itemRows, error: itemsError } = await client
      .from('balance_items')
      .select('*')
      .eq('snapshot_id', snapshot.id)
      .order('sort_order', { ascending: true })
    assertRemoteSuccess(itemsError, 'Falha ao carregar itens do balanço')

    const items = (itemRows ?? []).map(fromBalanceItemRow).map(normalizeBalanceItem)
    if (items.length) {
      return { snapshot, items }
    }
  }

  return null
}

export async function saveBalanceSnapshot(input: {
  month: MonthKey
  notes?: string
  items: BalanceDraftItemInput[]
}): Promise<{ snapshot: BalanceSnapshot; items: BalanceItem[] }> {
  const client = supabaseClient()
  const { snapshot: existing, items: existingItems } = await getBalanceSnapshotByMonth(input.month)
  const snapshot: BalanceSnapshot = existing
    ? touchEntity({
        ...existing,
        notes: input.notes?.trim() || undefined
      })
    : {
        ...createEntityBase('snapshot'),
        month: input.month,
        notes: input.notes?.trim() || undefined
      }

  const { error: snapshotError } = await client
    .from('balance_snapshots')
    .upsert(toBalanceSnapshotRow(snapshot), { onConflict: 'id' })
  assertRemoteSuccess(snapshotError, 'Falha ao salvar balanço')

  const byId = new Map(existingItems.map((item) => [item.id, item]))
  const items: BalanceItem[] = input.items
    .filter((item) => item.name.trim())
    .map((item, index) => {
      const existingItem = item.id ? byId.get(item.id) : undefined
      const base = existingItem ? touchEntity(existingItem) : createEntityBase('balance_item')

      return {
        ...base,
        snapshotId: snapshot.id,
        name: item.name.trim(),
        kind: normalizeBalanceItemKind(item.kind),
        amount: toMoneyString(item.amount || '0'),
        institution: item.institution?.trim() || undefined,
        notes: item.notes?.trim() || undefined,
        sortOrder: index
      }
    })

  const nextIds = new Set(items.map((item) => item.id))
  const deletedIds = existingItems.filter((item) => !nextIds.has(item.id)).map((item) => item.id)

  if (deletedIds.length) {
    const { error: deleteError } = await client.from('balance_items').delete().in('id', deletedIds)
    assertRemoteSuccess(deleteError, 'Falha ao remover itens do balanço')
  }

  if (items.length) {
    const { error: itemsError } = await client
      .from('balance_items')
      .upsert(items.map(toBalanceItemRow), { onConflict: 'id' })
    assertRemoteSuccess(itemsError, 'Falha ao salvar itens do balanço')
  }

  return { snapshot, items }
}

export async function deleteBalanceItem(id: EntityId): Promise<void> {
  const { error } = await supabaseClient().from('balance_items').delete().eq('id', id)
  assertRemoteSuccess(error, 'Falha ao excluir item do balanço')
}

export async function getBalanceHistory(): Promise<BalanceSnapshotWithItems[]> {
  const client = supabaseClient()
  const { data: snapshotRows, error } = await client
    .from('balance_snapshots')
    .select('*')
    .order('month', { ascending: true })
  assertRemoteSuccess(error, 'Falha ao carregar histórico de balanço')

  const entries: BalanceSnapshotWithItems[] = []
  for (const snapshot of (snapshotRows ?? []).map(fromBalanceSnapshotRow)) {
    const { data: itemRows, error: itemsError } = await client
      .from('balance_items')
      .select('*')
      .eq('snapshot_id', snapshot.id)
      .order('sort_order', { ascending: true })
    assertRemoteSuccess(itemsError, 'Falha ao carregar itens do balanço')

    entries.push({
      snapshot,
      items: (itemRows ?? []).map(fromBalanceItemRow).map(normalizeBalanceItem)
    })
  }

  return entries
}

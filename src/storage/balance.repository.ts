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

import { db } from './database'

function normalizeBalanceItemKind(kind: string): BalanceItemKind {
  return kind === 'debt' || kind === 'creditCard' ? 'debt' : 'asset'
}

function normalizeBalanceItem<T extends { kind: string }>(
  item: T
): Omit<T, 'kind'> & {
  kind: BalanceItemKind
} {
  return {
    ...item,
    kind: normalizeBalanceItemKind(item.kind)
  }
}

export async function getBalanceSnapshotByMonth(
  month: MonthKey
): Promise<{ snapshot: BalanceSnapshot | null; items: BalanceItem[] }> {
  const snapshot = await db.balanceSnapshots.where('month').equals(month).first()
  if (!snapshot) return { snapshot: null, items: [] }

  const items = (await db.balanceItems.where('snapshotId').equals(snapshot.id).toArray())
    .map(normalizeBalanceItem)
    .sort((left, right) => left.sortOrder - right.sortOrder)

  return { snapshot, items }
}

export async function getLatestBalanceSnapshotWithItems(): Promise<BalanceSnapshotWithItems | null> {
  const snapshots = await db.balanceSnapshots.orderBy('month').reverse().toArray()

  for (const snapshot of snapshots) {
    const items = (await db.balanceItems.where('snapshotId').equals(snapshot.id).toArray())
      .map(normalizeBalanceItem)
      .sort((left, right) => left.sortOrder - right.sortOrder)

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
  return db.transaction('rw', db.balanceSnapshots, db.balanceItems, async () => {
    const existing = await db.balanceSnapshots.where('month').equals(input.month).first()
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

    await db.balanceSnapshots.put(snapshot)

    const existingItems = existing
      ? (await db.balanceItems.where('snapshotId').equals(existing.id).toArray()).map(
          normalizeBalanceItem
        )
      : []
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
      await db.balanceItems.bulkDelete(deletedIds)
    }
    if (items.length) {
      await db.balanceItems.bulkPut(items)
    }

    return { snapshot, items }
  })
}

export async function deleteBalanceItem(id: EntityId): Promise<void> {
  await db.balanceItems.delete(id)
}

export async function getBalanceHistory(): Promise<BalanceSnapshotWithItems[]> {
  const snapshots = (await db.balanceSnapshots.toArray()).sort((left, right) =>
    left.month.localeCompare(right.month)
  )

  const entries: BalanceSnapshotWithItems[] = []
  for (const snapshot of snapshots) {
    const items = (await db.balanceItems.where('snapshotId').equals(snapshot.id).toArray())
      .map(normalizeBalanceItem)
      .sort((left, right) => left.sortOrder - right.sortOrder)
    entries.push({ snapshot, items })
  }

  return entries
}

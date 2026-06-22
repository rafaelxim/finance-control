import type { BalanceDraftItemInput, BalanceItem } from './types'

export function createBalanceCarryOverDraft(items: BalanceItem[]): BalanceDraftItemInput[] {
  return [...items]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((item, sortOrder) => ({
      name: item.name,
      kind: item.kind,
      amount: '0.00',
      institution: item.institution,
      notes: item.notes,
      sortOrder
    }))
}

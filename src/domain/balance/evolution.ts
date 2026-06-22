import Decimal from 'decimal.js'

import { addMoney, subtractMoney, toDecimal, toMoneyString } from '@/domain/shared/money'

import type {
  BalanceItem,
  BalanceSnapshotWithItems,
  BalanceTotals,
  FinancialEvolution
} from './types'

export function calculateBalanceTotals(
  items: Pick<BalanceItem, 'kind' | 'amount'>[]
): BalanceTotals {
  const assetsTotal = addMoney(
    items.filter((item) => item.kind === 'asset').map((item) => item.amount)
  )
  const debtsTotal = addMoney(
    items.filter((item) => item.kind === 'debt').map((item) => item.amount)
  )

  return {
    assetsTotal,
    debtsTotal,
    netWorth: subtractMoney(assetsTotal, debtsTotal)
  }
}

export function calculateFinancialEvolution(
  snapshots: BalanceSnapshotWithItems[]
): FinancialEvolution[] {
  const ordered = [...snapshots].sort((left, right) =>
    left.snapshot.month.localeCompare(right.snapshot.month)
  )

  return ordered.map((entry, index) => {
    const totals = calculateBalanceTotals(entry.items)
    const previous = index > 0 ? calculateBalanceTotals(ordered[index - 1].items) : null
    const netWorthChange = previous ? subtractMoney(totals.netWorth, previous.netWorth) : '0.00'
    const previousValue = previous ? toDecimal(previous.netWorth) : new Decimal(0)
    const netWorthChangePercent =
      previous && !previousValue.eq(0)
        ? toMoneyString(toDecimal(netWorthChange).div(previousValue).times(100))
        : undefined

    return {
      month: entry.snapshot.month,
      ...totals,
      previousNetWorth: previous?.netWorth,
      netWorthChange,
      netWorthChangePercent
    }
  })
}

import Decimal from 'decimal.js'

import type { DecimalString } from './types'

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP })

export type MoneyInput = Decimal.Value

export function toDecimal(value: MoneyInput): Decimal {
  if (typeof value === 'string') {
    const stripped = value.trim().replace(/\s/g, '').replace(/^R\$/, '')
    const normalized = stripped.includes(',')
      ? stripped.replace(/\./g, '').replace(',', '.')
      : stripped

    return new Decimal(normalized || '0')
  }

  return new Decimal(value)
}

export function toMoneyString(value: MoneyInput): DecimalString {
  return toDecimal(value).toDecimalPlaces(2).toFixed(2)
}

export function addMoney(values: MoneyInput[]): DecimalString {
  return toMoneyString(
    values.reduce((total, value) => total.plus(toDecimal(value)), new Decimal(0))
  )
}

export function subtractMoney(left: MoneyInput, right: MoneyInput): DecimalString {
  return toMoneyString(toDecimal(left).minus(toDecimal(right)))
}

export function multiplyMoney(left: MoneyInput, right: MoneyInput): DecimalString {
  return toMoneyString(toDecimal(left).times(toDecimal(right)))
}

export function percentOf(amount: MoneyInput, percent: MoneyInput): DecimalString {
  return toMoneyString(toDecimal(amount).times(toDecimal(percent)).div(100))
}

export function compareMoney(left: MoneyInput, right: MoneyInput): number {
  return toDecimal(left).cmp(toDecimal(right))
}

export function isNegative(value: MoneyInput): boolean {
  return toDecimal(value).isNegative()
}

export function formatBRL(value: MoneyInput): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(toDecimal(value).toNumber())
}

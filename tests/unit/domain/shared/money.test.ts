import { describe, expect, it } from 'vitest'

import {
  addMoney,
  compareMoney,
  formatBRL,
  percentOf,
  subtractMoney,
  toMoneyString
} from '@/domain/shared/money'

describe('money helpers', () => {
  it('parses BRL input and stores decimal strings', () => {
    expect(toMoneyString('R$ 1.234,56')).toBe('1234.56')
    expect(toMoneyString('1000.00')).toBe('1000.00')
  })

  it('adds, subtracts, and compares without floating point drift', () => {
    expect(addMoney(['0.10', '0.20'])).toBe('0.30')
    expect(subtractMoney('1000.00', '800.00')).toBe('200.00')
    expect(compareMoney('10.00', '9.99')).toBe(1)
  })

  it('calculates percentages and formats BRL output', () => {
    expect(percentOf('1500.00', '10')).toBe('150.00')
    expect(formatBRL('150.00')).toContain('150')
  })
})

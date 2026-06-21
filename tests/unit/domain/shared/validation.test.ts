import { describe, expect, it } from 'vitest'

import {
  monthKeySchema,
  nonNegativeDecimalStringSchema,
  positiveDecimalStringSchema,
  requiredTextSchema
} from '@/domain/shared/validation'

describe('shared validation', () => {
  it('validates month keys', () => {
    expect(monthKeySchema.safeParse('2026-06').success).toBe(true)
    expect(monthKeySchema.safeParse('2026-13').success).toBe(false)
  })

  it('validates text and decimal values', () => {
    expect(requiredTextSchema.safeParse('Comida').success).toBe(true)
    expect(requiredTextSchema.safeParse('   ').success).toBe(false)
    expect(nonNegativeDecimalStringSchema.safeParse('0.00').success).toBe(true)
    expect(nonNegativeDecimalStringSchema.safeParse('-1').success).toBe(false)
    expect(positiveDecimalStringSchema.safeParse('0').success).toBe(false)
  })
})

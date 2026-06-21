import { z } from 'zod'

import { toDecimal } from './money'

export const monthKeySchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use um mês válido')

export const requiredTextSchema = z.string().trim().min(1, 'Campo obrigatório')

export const decimalStringSchema = z
  .string()
  .trim()
  .refine((value) => {
    try {
      return toDecimal(value).isFinite()
    } catch {
      return false
    }
  }, 'Informe um valor numérico válido')

export const nonNegativeDecimalStringSchema = decimalStringSchema.refine(
  (value) => toDecimal(value).gte(0),
  'Informe um valor maior ou igual a zero'
)

export const positiveDecimalStringSchema = decimalStringSchema.refine(
  (value) => toDecimal(value).gt(0),
  'Informe um valor maior que zero'
)

export function flattenZodErrors(result: z.SafeParseReturnType<unknown, unknown>): string[] {
  if (result.success) return []
  return result.error.issues.map((issue) => issue.message)
}

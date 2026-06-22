import { z } from 'zod'

import {
  monthKeySchema,
  nonNegativeDecimalStringSchema,
  requiredTextSchema
} from '@/domain/shared/validation'

export const balanceItemKindSchema = z.enum(['asset', 'debt'])

export const balanceItemDraftSchema = z.object({
  id: z.string().optional(),
  name: requiredTextSchema,
  kind: balanceItemKindSchema,
  amount: nonNegativeDecimalStringSchema,
  institution: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  sortOrder: z.number().int().nonnegative()
})

export const balanceSnapshotDraftSchema = z.object({
  month: monthKeySchema,
  notes: z.string().trim().optional(),
  items: z.array(balanceItemDraftSchema).min(1, 'Informe ao menos um item de balanço')
})

export function validateBalanceSnapshotDraft(input: unknown): string[] {
  const parsed = balanceSnapshotDraftSchema.safeParse(input)
  if (parsed.success) return []

  return Array.from(new Set(parsed.error.issues.map((issue) => issue.message)))
}

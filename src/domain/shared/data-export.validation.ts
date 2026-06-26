import { z } from 'zod'

import { DATA_EXPORT_SCHEMA_VERSION } from '@/domain/shared/data-export'
import {
  decimalStringSchema,
  monthKeySchema,
  nonNegativeDecimalStringSchema,
  positiveDecimalStringSchema,
  requiredTextSchema
} from '@/domain/shared/validation'

const timestampSchema = z.string().datetime({ offset: true })

const timestampedEntitySchema = z.object({
  id: z.string(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema
})

const exportedProfileSchema = timestampedEntitySchema.extend({
  displayName: z.string().optional(),
  currency: z.literal('BRL'),
  activeMonth: monthKeySchema,
  themeMode: z.enum(['light', 'dark', 'system'])
})

const exportedBudgetSchema = timestampedEntitySchema.extend({
  month: monthKeySchema,
  availableAmount: nonNegativeDecimalStringSchema,
  notes: z.string().optional(),
  status: z.enum(['draft', 'active', 'closed'])
})

const exportedCategorySchema = timestampedEntitySchema
  .extend(timestampedEntitySchema.shape)
  .extend({
    budgetId: z.string(),
    name: requiredTextSchema,
    allocationType: z.enum(['fixed', 'percentage']),
    allocationValue: nonNegativeDecimalStringSchema,
    computedLimit: z.string(),
    sortOrder: z.number().int().nonnegative(),
    status: z.enum(['active', 'archived'])
  })

const exportedExpenseSchema = timestampedEntitySchema.extend({
  budgetId: z.string(),
  categoryId: z.string(),
  amount: positiveDecimalStringSchema,
  date: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
  description: z.string().optional()
})

const exportedSnapshotSchema = timestampedEntitySchema.extend({
  month: monthKeySchema,
  notes: z.string().optional()
})

const exportedBalanceItemSchema = timestampedEntitySchema.extend({
  snapshotId: z.string(),
  name: requiredTextSchema,
  kind: z.enum(['asset', 'debt']),
  amount: decimalStringSchema,
  institution: z.string().optional(),
  notes: z.string().optional(),
  sortOrder: z.number().int().nonnegative()
})

export const dataExportPayloadSchema = z.object({
  schemaVersion: z.literal(DATA_EXPORT_SCHEMA_VERSION),
  exportedAt: timestampSchema,
  profile: exportedProfileSchema.nullable(),
  monthlyBudgets: z.array(exportedBudgetSchema),
  budgetCategories: z.array(exportedCategorySchema),
  expenses: z.array(exportedExpenseSchema),
  balanceSnapshots: z.array(exportedSnapshotSchema),
  balanceItems: z.array(exportedBalanceItemSchema),
  visualPreferences: z
    .object({
      categoryVisuals: z.record(z.string()).optional()
    })
    .default({})
})

export function validateDataExportPayload(input: unknown): string[] {
  const parsed = dataExportPayloadSchema.safeParse(input)
  if (!parsed.success) {
    return Array.from(new Set(parsed.error.issues.map((issue) => issue.message)))
  }

  const payload = parsed.data
  const errors: string[] = []
  const budgetIds = new Set(payload.monthlyBudgets.map((budget) => budget.id))
  const categoryIds = new Set(payload.budgetCategories.map((category) => category.id))
  const snapshotIds = new Set(payload.balanceSnapshots.map((snapshot) => snapshot.id))
  const months = new Set<string>()

  for (const budget of payload.monthlyBudgets) {
    if (months.has(budget.month)) {
      errors.push(`Orçamento duplicado para o mês ${budget.month}`)
    }
    months.add(budget.month)
  }

  for (const category of payload.budgetCategories) {
    if (!budgetIds.has(category.budgetId)) {
      errors.push(`Categoria ${category.name} referencia orçamento inexistente`)
    }
  }

  for (const expense of payload.expenses) {
    if (!budgetIds.has(expense.budgetId)) {
      errors.push(`Despesa ${expense.id} referencia orçamento inexistente`)
    }
    if (!categoryIds.has(expense.categoryId)) {
      errors.push(`Despesa ${expense.id} referencia categoria inexistente`)
    }
  }

  for (const item of payload.balanceItems) {
    if (!snapshotIds.has(item.snapshotId)) {
      errors.push(`Item de balanço ${item.name} referencia fechamento inexistente`)
    }
  }

  return Array.from(new Set(errors))
}

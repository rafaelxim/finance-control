import { z } from 'zod'

import {
  monthKeySchema,
  nonNegativeDecimalStringSchema,
  requiredTextSchema
} from '@/domain/shared/validation'

export const allocationTypeSchema = z.enum(['fixed', 'percentage'])

export const monthlyBudgetSchema = z.object({
  month: monthKeySchema,
  availableAmount: nonNegativeDecimalStringSchema,
  notes: z.string().optional(),
  status: z.enum(['draft', 'active', 'closed'])
})

export const budgetCategorySchema = z
  .object({
    name: requiredTextSchema,
    allocationType: allocationTypeSchema,
    allocationValue: nonNegativeDecimalStringSchema
  })
  .superRefine((category, context) => {
    if (category.allocationType === 'percentage') {
      const percent = Number(category.allocationValue)
      if (Number.isNaN(percent) || percent > 100) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Percentual deve estar entre 0 e 100',
          path: ['allocationValue']
        })
      }
    }
  })

export type MonthlyBudgetFormData = z.infer<typeof monthlyBudgetSchema>
export type BudgetCategoryFormData = z.infer<typeof budgetCategorySchema>

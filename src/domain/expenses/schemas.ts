import { z } from 'zod'

import type { BudgetCategory, MonthlyBudget } from '@/domain/budget/types'
import { positiveDecimalStringSchema, requiredTextSchema } from '@/domain/shared/validation'

import type { ExpenseDraftInput } from './types'

export const calendarDateSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Use uma data válida')
  .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), 'Use uma data válida')

export const expenseDraftSchema = z.object({
  id: z.string().optional(),
  budgetId: requiredTextSchema,
  categoryId: requiredTextSchema,
  amount: positiveDecimalStringSchema,
  date: calendarDateSchema,
  description: z.string().trim().optional()
})

export function validateExpenseForBudget(
  input: ExpenseDraftInput,
  budget: Pick<MonthlyBudget, 'id' | 'month'> | null,
  categories: Array<Pick<BudgetCategory, 'id' | 'budgetId' | 'status'>>
): string[] {
  const parsed = expenseDraftSchema.safeParse(input)
  const errors = parsed.success ? [] : parsed.error.issues.map((issue) => issue.message)

  if (!budget) {
    errors.push('Crie um orçamento mensal antes de registrar despesas')
    return errors
  }

  if (input.budgetId !== budget.id) {
    errors.push('Despesa deve pertencer ao orçamento selecionado')
  }

  if (!input.date.startsWith(`${budget.month}-`)) {
    errors.push('Data da despesa deve estar dentro do mês do orçamento')
  }

  const category = categories.find((item) => item.id === input.categoryId)
  if (!category) {
    errors.push('Selecione uma categoria do orçamento')
  } else if (category.budgetId !== budget.id) {
    errors.push('Categoria deve pertencer ao mesmo orçamento da despesa')
  } else if (category.status !== 'active') {
    errors.push('Categoria arquivada não aceita novas despesas')
  }

  return Array.from(new Set(errors))
}

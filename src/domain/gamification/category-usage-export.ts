import type {
  CategoryProgress,
  CategoryProgressState
} from '@/domain/gamification/category-progress'
import { addMoney, formatBRL, toDecimal } from '@/domain/shared/money'
import type { MonthKey } from '@/domain/shared/types'

const stateLabels: Record<CategoryProgressState, string> = {
  safe: 'Seguro',
  warning: 'Atenção',
  limitReached: 'Limite atingido',
  overLimit: 'Limite excedido'
}

function formatUsagePercent(value: string): string {
  return `${toDecimal(value).toDecimalPlaces(0).toFixed(0)}%`
}

function formatRemainingLabel(value: string): string {
  return toDecimal(value).lt(0) ? 'Déficit' : 'Restante'
}

export function formatCategoryUsageForSharing(progress: CategoryProgress[], month: MonthKey) {
  const totalSpent = addMoney(progress.map((category) => category.spent))
  const categoryBlocks = progress.map((category) => {
    const remainingLabel = formatRemainingLabel(category.remaining)

    return [
      `*${category.categoryName}*`,
      `Gasto: ${formatBRL(category.spent)} de ${formatBRL(category.limit)}`,
      `Uso: ${formatUsagePercent(category.usagePercent)}`,
      `${remainingLabel}: ${formatBRL(category.remaining)}`,
      `Status: *${stateLabels[category.state]}*`
    ].join('\n')
  })

  return [`*Uso por categoria*`, `Mês: ${month}`, `Total gasto: *${formatBRL(totalSpent)}*`]
    .concat(categoryBlocks)
    .join('\n\n')
}

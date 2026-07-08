<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

import type { Expense } from '@/domain/expenses/types'
import { formatBRL, toDecimal } from '@/domain/shared/money'
import type { MonthKey } from '@/domain/shared/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  title?: string
  month: MonthKey
  allocatedAmount: string
  spentAmount: string
  overAllocatedAmount: string
  expenses: Expense[]
}>()

function formatPercent(value: number) {
  return `${new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1
  }).format(value)}%`
}

const spentAmount = computed(() => toDecimal(props.spentAmount))
const allocatedAmount = computed(() => toDecimal(props.allocatedAmount))
const overAllocatedAmount = computed(() => toDecimal(props.overAllocatedAmount))
const availableAmount = computed(() => allocatedAmount.value.minus(spentAmount.value))

const spentPercent = computed(() => {
  if (allocatedAmount.value.lte(0)) return 0
  return spentAmount.value.div(allocatedAmount.value).times(100).toNumber()
})

const availablePercent = computed(() => {
  if (allocatedAmount.value.lte(0)) return 0
  return availableAmount.value.div(allocatedAmount.value).times(100).toNumber()
})

const progressWidth = computed(() => `${Math.max(0, Math.min(spentPercent.value, 100))}%`)

const chartLabels = computed(() => {
  const [year, month] = props.month.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, index) => String(index + 1).padStart(2, '0'))
})

const dailySpent = computed(() => {
  const values = chartLabels.value.map(() => toDecimal(0))

  for (const expense of props.expenses) {
    if (!expense.date.startsWith(props.month)) continue

    const day = Number(expense.date.slice(-2))
    const bucket = values[day - 1]
    if (bucket === undefined) continue

    values[day - 1] = bucket.plus(expense.amount)
  }

  return values.map((value) => value.toNumber())
})

const chartData = computed(() => ({
  labels: chartLabels.value,
  datasets: [
    {
      label: 'Gasto diário',
      data: dailySpent.value,
      backgroundColor: 'rgba(252, 213, 53, 0.85)',
      borderColor: '#fcd535',
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
      maxBarThickness: 14
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label(context: { parsed: { y: number } }) {
          return ` ${formatBRL(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#929aa5',
        maxRotation: 0,
        autoSkip: true
      },
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#929aa5',
        callback(value: string | number) {
          return formatBRL(Number(value))
        }
      },
      grid: {
        color: '#2b3139'
      }
    }
  }
}

const summaryState = computed(() => {
  if (availableAmount.value.lt(0) || overAllocatedAmount.value.gt(0)) return 'negative'
  if (spentPercent.value >= 85) return 'warning'
  if (availableAmount.value.gt(0)) return 'positive'
  return 'neutral'
})

const percentLabel = computed(() => formatPercent(spentPercent.value))
const availableLabel = computed(() => formatPercent(availablePercent.value))
</script>

<template>
  <section
    class="dashboard-budget panel panel--support panel--budget"
    :data-state="summaryState"
    aria-labelledby="dashboard-budget-title"
  >
    <header class="dashboard-budget__header">
      <div class="dashboard-budget__heading">
        <p id="dashboard-budget-title" class="dashboard-budget__eyebrow">{{ title ?? 'Orçamento do mês' }}</p>
        <h2>Gasto por dia</h2>
        <p class="dashboard-budget__description">
          Acompanhe a curva diária do mês, o uso do orçamento e o saldo ainda disponível.
        </p>
      </div>

      <div class="dashboard-budget__badge">
        <span>Gasto do mês</span>
        <strong>{{ percentLabel }}</strong>
      </div>
    </header>

    <div class="dashboard-budget__chart-shell" aria-label="Gráfico de gasto por dia">
      <div class="dashboard-budget__chart">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <div class="dashboard-budget__progress" aria-label="Progresso do orçamento">
      <div class="dashboard-budget__progress-track">
        <span class="dashboard-budget__progress-fill" :style="{ width: progressWidth }" />
      </div>
      <div class="dashboard-budget__progress-meta">
        <span>Gasto</span>
        <strong>{{ percentLabel }}</strong>
        <span>Disponível</span>
        <strong>{{ availableLabel }}</strong>
      </div>
    </div>

    <div class="dashboard-budget__metrics">
      <div class="dashboard-budget__metric dashboard-budget__metric--emphasis">
        <span class="dashboard-budget__metric-label">Total gasto</span>
        <strong class="money money--primary">{{ formatBRL(spentAmount) }}</strong>
        <span class="dashboard-budget__metric-note">{{ percentLabel }} do limite mensal</span>
      </div>

      <div class="dashboard-budget__metric">
        <span class="dashboard-budget__metric-label">Disponível</span>
        <strong class="money money--primary">{{ formatBRL(availableAmount) }}</strong>
        <span class="dashboard-budget__metric-note">{{ availableLabel }} do limite mensal</span>
      </div>

      <div class="dashboard-budget__metric">
        <span class="dashboard-budget__metric-label">Alocado</span>
        <strong class="money money--primary">{{ formatBRL(allocatedAmount) }}</strong>
        <span class="dashboard-budget__metric-note">Distribuído nas categorias</span>
      </div>

      <div class="dashboard-budget__metric">
        <span class="dashboard-budget__metric-label">Percentual gasto</span>
        <strong class="dashboard-budget__percent">{{ percentLabel }}</strong>
        <span class="dashboard-budget__metric-note">Baseado no valor do mês</span>
      </div>
    </div>

    <p v-if="overAllocatedAmount.gt(0)" class="dashboard-budget__alert">
      Excedente de {{ formatBRL(overAllocatedAmount) }} acima do orçamento.
    </p>
  </section>
</template>

<style scoped>
.dashboard-budget {
  display: grid;
  gap: 18px;
  padding: 20px;
  border-color: color-mix(in srgb, var(--state-color) 34%, var(--color-border));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--state-color) 8%, transparent), transparent 42%),
    var(--color-surface);
}

.dashboard-budget__header {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.dashboard-budget__heading {
  display: grid;
  min-width: 0;
  gap: 6px;
}

.dashboard-budget__eyebrow,
.dashboard-budget__description,
.dashboard-budget__metric-label,
.dashboard-budget__metric-note,
.dashboard-budget__progress-meta span,
.dashboard-budget__progress-meta strong,
.dashboard-budget__alert {
  margin: 0;
}

.dashboard-budget__eyebrow {
  color: var(--color-muted);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.dashboard-budget h2 {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
}

.dashboard-budget__description {
  max-width: 70ch;
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.45;
}

.dashboard-budget__badge {
  display: grid;
  gap: 4px;
  justify-items: end;
  border: 1px solid color-mix(in srgb, var(--state-color) 46%, transparent);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--state-color) 10%, transparent);
  padding: 10px 12px;
  white-space: nowrap;
}

.dashboard-budget__badge span {
  color: var(--color-muted);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
}

.dashboard-budget__badge strong {
  color: var(--state-color);
  font-family: var(--font-number);
  font-size: 1.18rem;
}

.dashboard-budget__chart-shell {
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-bg) 52%, var(--color-surface));
  padding: 14px;
}

.dashboard-budget__chart {
  height: 160px;
}

.dashboard-budget__progress {
  display: grid;
  gap: 10px;
}

.dashboard-budget__progress-track {
  overflow: hidden;
  height: 10px;
  border-radius: 999px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
}

.dashboard-budget__progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--state-color), var(--color-primary));
}

.dashboard-budget__progress-meta {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 8px 12px;
  align-items: baseline;
  color: var(--color-muted);
  font-size: 0.8rem;
}

.dashboard-budget__progress-meta strong {
  color: var(--color-text);
  font-family: var(--font-number);
  font-size: 0.92rem;
  font-variant-numeric: tabular-nums;
}

.dashboard-budget__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
}

.dashboard-budget__metric {
  display: grid;
  min-width: 0;
  gap: 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-bg) 34%, var(--color-surface));
  padding: 12px 14px;
}

.dashboard-budget__metric--emphasis {
  border-color: color-mix(in srgb, var(--state-color) 42%, var(--color-border));
  background: color-mix(in srgb, var(--state-color) 10%, var(--color-surface));
}

.dashboard-budget__metric-label {
  color: var(--color-muted);
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
}

.dashboard-budget__metric-note {
  color: var(--color-muted);
  font-size: 0.82rem;
  line-height: 1.35;
}

.dashboard-budget__percent {
  color: var(--state-color);
  font-family: var(--font-number);
  font-size: 1.6rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.06;
}

.dashboard-budget__alert {
  border-left: 3px solid var(--state-color);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--state-color) 10%, transparent);
  color: var(--color-text);
  padding: 10px 12px;
  font-size: 0.88rem;
}

.dashboard-budget[data-state='positive'] {
  --state-color: var(--color-up);
}

.dashboard-budget[data-state='neutral'] {
  --state-color: var(--color-muted);
}

.dashboard-budget[data-state='warning'] {
  --state-color: var(--color-warning);
}

.dashboard-budget[data-state='negative'] {
  --state-color: var(--color-danger);
}

@media (max-width: 760px) {
  .dashboard-budget__header {
    flex-direction: column;
  }

  .dashboard-budget__badge {
    justify-items: start;
  }

  .dashboard-budget__chart {
    height: 150px;
  }

  .dashboard-budget__progress-meta {
    grid-template-columns: repeat(2, auto);
  }
}
</style>

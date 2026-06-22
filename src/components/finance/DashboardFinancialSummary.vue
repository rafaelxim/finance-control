<script setup lang="ts">
import { computed } from 'vue'

import { formatBRL } from '@/domain/shared/money'

export type DashboardFinancialSummaryState = 'positive' | 'neutral' | 'warning' | 'negative'
export type DashboardFinancialSummarySource = 'balance' | 'budget' | 'none'

export interface DashboardFinancialSummaryViewModel {
  label: string
  primaryAmount?: string
  comparisonLabel?: string
  comparisonAmount?: string
  state: DashboardFinancialSummaryState
  source: DashboardFinancialSummarySource
}

const props = defineProps<{
  summary: DashboardFinancialSummaryViewModel
}>()

const stateLabel = computed(
  () =>
    ({
      positive: 'Positivo',
      neutral: 'Neutro',
      warning: 'Atenção',
      negative: 'Negativo'
    })[props.summary.state]
)

const sourceLabel = computed(
  () =>
    ({
      balance: 'Baseado no último balanço',
      budget: 'Baseado no orçamento do mês',
      none: 'Dados pendentes'
    })[props.summary.source]
)
</script>

<template>
  <section
    class="dashboard-summary panel"
    :data-state="summary.state"
    aria-labelledby="dashboard-summary-title"
  >
    <div class="dashboard-summary__header">
      <div>
        <p id="dashboard-summary-title" class="dashboard-summary__eyebrow">Resumo principal</p>
        <h2>{{ summary.label }}</h2>
      </div>
      <span class="dashboard-summary__badge">{{ stateLabel }}</span>
    </div>

    <strong v-if="summary.primaryAmount" class="money money--hero">
      {{ formatBRL(summary.primaryAmount) }}
    </strong>
    <p v-else class="dashboard-summary__empty">Configure orçamento ou balanço para ver o resumo.</p>

    <p v-if="summary.comparisonLabel" class="dashboard-summary__comparison">
      <span>{{ summary.comparisonLabel }}</span>
      <strong
        v-if="summary.comparisonAmount"
        class="money money--secondary"
        :class="`state-text--${summary.state}`"
      >
        {{ formatBRL(summary.comparisonAmount) }}
      </strong>
    </p>

    <span class="dashboard-summary__source">{{ sourceLabel }}</span>
  </section>
</template>

<style scoped>
.dashboard-summary {
  display: grid;
  gap: 14px;
  border-color: color-mix(in srgb, var(--state-color) 44%, var(--color-border));
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--state-color) 12%, transparent), transparent),
    var(--color-surface);
}

.dashboard-summary__header {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.dashboard-summary__eyebrow,
.dashboard-summary h2,
.dashboard-summary p {
  margin: 0;
}

.dashboard-summary__eyebrow,
.dashboard-summary__source {
  color: var(--color-muted);
  font-size: 0.78rem;
}

.dashboard-summary h2 {
  margin-top: 4px;
  font-size: 1rem;
  font-weight: 650;
}

.dashboard-summary__badge {
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, var(--state-color) 50%, transparent);
  border-radius: var(--radius);
  color: var(--state-color);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 4px 8px;
}

.dashboard-summary__comparison {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
  color: var(--color-muted);
  font-size: 0.86rem;
}

.dashboard-summary__empty {
  color: var(--color-muted);
}

.dashboard-summary[data-state='positive'] {
  --state-color: var(--color-up);
}

.dashboard-summary[data-state='neutral'] {
  --state-color: var(--color-muted);
}

.dashboard-summary[data-state='warning'] {
  --state-color: var(--color-warning);
}

.dashboard-summary[data-state='negative'] {
  --state-color: var(--color-danger);
}
</style>

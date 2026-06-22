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
  stateLabel?: string
  stateDescription?: string
  primaryAmountEmphasis?: 'standard' | 'reduced'
  actionLabel?: string
  actionTarget?: string
  state: DashboardFinancialSummaryState
  source: DashboardFinancialSummarySource
}

const props = defineProps<{
  summary: DashboardFinancialSummaryViewModel
}>()

const stateLabel = computed(
  () =>
    props.summary.stateLabel ??
    {
      positive: 'Positivo',
      neutral: 'Neutro',
      warning: 'Atenção',
      negative: 'Negativo'
    }[props.summary.state]
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
    <div class="dashboard-summary__content">
      <div class="dashboard-summary__primary">
        <p id="dashboard-summary-title" class="dashboard-summary__eyebrow">Resumo principal</p>
        <h2>{{ summary.label }}</h2>

        <strong
          v-if="summary.primaryAmount"
          class="money money--hero dashboard-summary__amount"
          :class="{
            'dashboard-summary__amount--reduced': summary.primaryAmountEmphasis === 'reduced'
          }"
        >
          {{ formatBRL(summary.primaryAmount) }}
        </strong>
        <p v-else class="dashboard-summary__empty">
          Configure orçamento ou balanço para ver o resumo.
        </p>
      </div>

      <div class="dashboard-summary__meta">
        <span class="dashboard-summary__badge">{{ stateLabel }}</span>
        <p v-if="summary.stateDescription" class="dashboard-summary__description">
          {{ summary.stateDescription }}
        </p>

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
        <RouterLink
          v-if="summary.actionLabel && summary.actionTarget"
          class="button button--primary dashboard-summary__action"
          :to="summary.actionTarget"
        >
          {{ summary.actionLabel }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard-summary {
  border-color: color-mix(in srgb, var(--state-color) 44%, var(--color-border));
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--state-color) 12%, transparent), transparent),
    var(--color-surface);
  padding: 16px 18px;
}

.dashboard-summary__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 0.7fr);
  min-width: 0;
  gap: 20px;
  align-items: center;
}

.dashboard-summary__eyebrow,
.dashboard-summary__description,
.dashboard-summary h2,
.dashboard-summary p {
  margin: 0;
}

.dashboard-summary__primary,
.dashboard-summary__meta {
  display: grid;
  min-width: 0;
}

.dashboard-summary__primary {
  gap: 6px;
}

.dashboard-summary__meta {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 10px;
  row-gap: 6px;
}

.dashboard-summary__eyebrow,
.dashboard-summary__source {
  color: var(--color-muted);
  font-size: 0.78rem;
}

.dashboard-summary h2 {
  font-size: 1rem;
  font-weight: 650;
}

.dashboard-summary__amount {
  margin-top: 2px;
}

.dashboard-summary__amount--reduced {
  color: color-mix(in srgb, var(--color-text) 78%, var(--color-muted));
  font-size: clamp(1.35rem, 2vw, 1.8rem);
}

.dashboard-summary__badge {
  grid-column: 1 / -1;
  justify-self: start;
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, var(--state-color) 50%, transparent);
  border-radius: var(--radius);
  color: var(--state-color);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 4px 8px;
}

.dashboard-summary__description {
  grid-column: 1 / -1;
  color: var(--color-text);
  font-size: 0.88rem;
}

.dashboard-summary__comparison {
  grid-column: 1 / -1;
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

.dashboard-summary__source {
  align-self: center;
}

.dashboard-summary__action {
  min-height: 34px;
  margin-top: 2px;
  padding: 7px 12px;
  justify-self: end;
  text-decoration: none;
  white-space: nowrap;
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

@media (max-width: 760px) {
  .dashboard-summary__content {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .dashboard-summary__meta {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .dashboard-summary__badge,
  .dashboard-summary__description,
  .dashboard-summary__comparison {
    grid-column: auto;
  }

  .dashboard-summary__action {
    justify-self: start;
  }
}
</style>

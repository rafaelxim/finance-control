<script setup lang="ts">
import type { BalanceTotals } from '@/domain/balance/types'
import { formatBRL } from '@/domain/shared/money'

withDefaults(
  defineProps<{
    totals: BalanceTotals
    change?: string
    title?: string
  }>(),
  {
    change: undefined,
    title: 'Resumo patrimonial'
  }
)
</script>

<template>
  <section
    class="net-worth-summary panel panel--support panel--patrimony"
    aria-labelledby="net-worth-summary-title"
  >
    <h2 id="net-worth-summary-title" class="panel__heading">{{ title }}</h2>
    <div class="metric-grid">
      <div class="metric positive">
        <span class="metric__label">Ativos</span>
        <strong class="money money--primary">{{ formatBRL(totals.assetsTotal) }}</strong>
      </div>
      <div class="metric negative">
        <span class="metric__label">Dívidas</span>
        <strong class="money money--primary">{{ formatBRL(totals.debtsTotal) }}</strong>
      </div>
      <div class="metric metric--featured metric--net-worth">
        <span class="metric__label">Patrimônio líquido</span>
        <strong class="money money--hero">{{ formatBRL(totals.netWorth) }}</strong>
      </div>
      <div
        v-if="change !== undefined"
        class="metric metric--featured"
        :class="{ positive: Number(change) >= 0, negative: Number(change) < 0 }"
      >
        <span class="metric__label">Variação</span>
        <strong class="money money--primary">{{ formatBRL(change) }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.net-worth-summary {
  display: grid;
  gap: 16px;
}

.metric--net-worth {
  grid-column: span 2;
  border: 1px solid rgba(59, 130, 246, 0.32);
  border-left: 3px solid var(--color-info);
  border-radius: var(--radius);
  background: rgba(59, 130, 246, 0.08);
  padding: 14px 16px;
}

.metric--net-worth .metric__label {
  color: var(--color-text);
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
}

.positive strong {
  color: var(--color-up);
}

.negative strong {
  color: var(--color-danger);
}

@media (max-width: 680px) {
  .metric--net-worth {
    grid-column: auto;
  }
}
</style>

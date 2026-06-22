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
      <div class="metric metric--featured">
        <span class="metric__label">Patrimônio líquido</span>
        <strong class="money money--primary">{{ formatBRL(totals.netWorth) }}</strong>
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

.positive strong {
  color: var(--color-up);
}

.negative strong {
  color: var(--color-danger);
}
</style>

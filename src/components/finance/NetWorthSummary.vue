<script setup lang="ts">
import type { BalanceTotals } from '@/domain/balance/types'
import { formatBRL } from '@/domain/shared/money'

defineProps<{
  totals: BalanceTotals
  change?: string
}>()
</script>

<template>
  <section class="net-worth-summary panel" aria-label="Resumo patrimonial">
    <div>
      <span>Ativos</span>
      <strong>{{ formatBRL(totals.assetsTotal) }}</strong>
    </div>
    <div>
      <span>Dívidas</span>
      <strong>{{ formatBRL(totals.debtsTotal) }}</strong>
    </div>
    <div>
      <span>Patrimônio líquido</span>
      <strong>{{ formatBRL(totals.netWorth) }}</strong>
    </div>
    <div
      v-if="change !== undefined"
      :class="{ positive: Number(change) >= 0, negative: Number(change) < 0 }"
    >
      <span>Variação</span>
      <strong>{{ formatBRL(change) }}</strong>
    </div>
  </section>
</template>

<style scoped>
.net-worth-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
}

.net-worth-summary div {
  display: grid;
  gap: 4px;
}

.net-worth-summary span {
  color: var(--color-muted);
  font-size: 0.9rem;
}

.net-worth-summary strong {
  font-family: var(--font-number);
  font-size: 1.2rem;
  font-variant-numeric: tabular-nums;
}

.positive strong {
  color: var(--color-up);
}

.negative strong {
  color: var(--color-danger);
}
</style>

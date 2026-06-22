<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import FinancialEvolutionChart from '@/components/finance/FinancialEvolutionChart.vue'
import NetWorthSummary from '@/components/finance/NetWorthSummary.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import MonthPicker from '@/components/ui/MonthPicker.vue'
import { formatBRL } from '@/domain/shared/money'
import type { MonthKey } from '@/domain/shared/types'
import { useBalanceStore } from '@/stores/balance.store'

const balanceStore = useBalanceStore()
const startMonth = ref<MonthKey | ''>('')
const endMonth = ref<MonthKey | ''>('')

const filteredEvolution = computed(() =>
  balanceStore.evolution.filter((entry) => {
    if (startMonth.value && entry.month < startMonth.value) return false
    if (endMonth.value && entry.month > endMonth.value) return false
    return true
  })
)

const latest = computed(() => filteredEvolution.value.at(-1) ?? null)

onMounted(() => {
  void balanceStore.loadHistory()
})
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Evolução</h1>
      <p>Histórico patrimonial por mês, ativos, dívidas e variação.</p>
    </header>

    <EmptyState
      v-if="!balanceStore.evolution.length"
      title="Nenhum fechamento registrado"
      description="Crie fechamentos mensais para visualizar sua evolução."
    >
      <RouterLink class="button button--primary" to="/balanco">Abrir balanço</RouterLink>
    </EmptyState>

    <template v-else>
      <section class="panel evolution-filters" aria-label="Filtros de período">
        <MonthPicker
          id="evolution-start-month"
          :model-value="startMonth || balanceStore.evolution[0].month"
          label="Início"
          @update:model-value="startMonth = $event as MonthKey"
        />
        <MonthPicker
          id="evolution-end-month"
          :model-value="endMonth || balanceStore.evolution.at(-1)!.month"
          label="Fim"
          @update:model-value="endMonth = $event as MonthKey"
        />
      </section>

      <NetWorthSummary v-if="latest" :totals="latest" :change="latest.netWorthChange" />

      <FinancialEvolutionChart :evolution="filteredEvolution" />

      <section class="panel evolution-table" aria-label="Tabela de evolução financeira">
        <header>
          <h2>Histórico mensal</h2>
        </header>
        <ul>
          <li v-for="entry in filteredEvolution" :key="entry.month">
            <strong>{{ entry.month }}</strong>
            <span>Ativos {{ formatBRL(entry.assetsTotal) }}</span>
            <span>Dívidas {{ formatBRL(entry.debtsTotal) }}</span>
            <b>{{ formatBRL(entry.netWorth) }}</b>
            <em>{{ formatBRL(entry.netWorthChange) }}</em>
          </li>
        </ul>
      </section>
    </template>
  </section>
</template>

<style scoped>
.evolution-filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, 220px));
  gap: 14px;
}

.evolution-table {
  display: grid;
  gap: 12px;
}

.evolution-table h2,
.evolution-table ul {
  margin: 0;
}

.evolution-table h2 {
  font-size: 1rem;
}

.evolution-table ul {
  display: grid;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.evolution-table li {
  display: grid;
  grid-template-columns: minmax(90px, 1fr) repeat(4, auto);
  align-items: center;
  gap: 14px;
  border-top: 1px solid var(--color-border);
  padding-top: 10px;
}

.evolution-table span {
  color: var(--color-muted);
}

.evolution-table b,
.evolution-table em {
  font-family: var(--font-number);
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 820px) {
  .evolution-filters,
  .evolution-table li {
    grid-template-columns: 1fr;
  }
}
</style>

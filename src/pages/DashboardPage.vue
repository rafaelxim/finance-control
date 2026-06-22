<script setup lang="ts">
import { computed, onMounted } from 'vue'

import BudgetSummary from '@/components/budget/BudgetSummary.vue'
import MarketCategoryCard from '@/components/budget/MarketCategoryCard.vue'
import DashboardFinancialSummary, {
  type DashboardFinancialSummaryViewModel
} from '@/components/finance/DashboardFinancialSummary.vue'
import NetWorthSummary from '@/components/finance/NetWorthSummary.vue'
import { toDecimal } from '@/domain/shared/money'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { useBalanceStore } from '@/stores/balance.store'
import { useBudgetStore } from '@/stores/budget.store'
import { useExpensesStore } from '@/stores/expenses.store'

const budgetStore = useBudgetStore()
const expensesStore = useExpensesStore()
const balanceStore = useBalanceStore()

const cards = computed(() => expensesStore.categoryProgress)
const latestNetWorth = computed(() => balanceStore.latestEvolution)
const dashboardSummary = computed<DashboardFinancialSummaryViewModel>(() => {
  if (latestNetWorth.value) {
    const change = toDecimal(latestNetWorth.value.netWorthChange)

    return {
      label: 'Patrimônio líquido',
      primaryAmount: latestNetWorth.value.netWorth,
      comparisonLabel: 'Variação mais recente',
      comparisonAmount: latestNetWorth.value.netWorthChange,
      state: change.gt(0) ? 'positive' : change.lt(0) ? 'negative' : 'neutral',
      source: 'balance'
    }
  }

  const overAllocated = toDecimal(budgetStore.totals.overAllocated)
  const unallocated = toDecimal(budgetStore.totals.unallocated)

  if (overAllocated.gt(0)) {
    return {
      label: 'Excedente planejado',
      primaryAmount: budgetStore.totals.overAllocated,
      comparisonLabel: 'Orçamento acima do disponível',
      comparisonAmount: budgetStore.totals.overAllocated,
      state: 'negative',
      source: 'budget'
    }
  }

  return {
    label: 'Saldo disponível do mês',
    primaryAmount: budgetStore.totals.unallocated,
    comparisonLabel: unallocated.gt(0) ? 'Ainda não alocado' : 'Orçamento totalmente alocado',
    comparisonAmount: budgetStore.totals.unallocated,
    state: unallocated.gt(0) ? 'positive' : 'neutral',
    source: 'budget'
  }
})

onMounted(async () => {
  await budgetStore.loadMonth(budgetStore.draftMonth)
  await expensesStore.loadForBudget(budgetStore.budget?.id ?? null, budgetStore.draftMonth)
  await balanceStore.loadHistory()
})
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Dashboard</h1>
      <p>Resumo do orçamento atual, gastos por categoria e patrimônio recente.</p>
    </header>

    <LoadingState v-if="budgetStore.loading || expensesStore.loading" />

    <template v-else>
      <DashboardFinancialSummary :summary="dashboardSummary" />

      <NetWorthSummary
        v-if="latestNetWorth"
        :totals="latestNetWorth"
        :change="latestNetWorth.netWorthChange"
        title="Patrimônio"
      />

      <BudgetSummary
        :available-amount="budgetStore.draftAvailableAmount"
        :allocated="budgetStore.totals.allocated"
        :unallocated="budgetStore.totals.unallocated"
        :over-allocated="budgetStore.totals.overAllocated"
        title="Orçamento do mês"
      />

      <EmptyState
        v-if="!cards.length"
        title="Configure seu primeiro orçamento"
        description="Crie categorias para visualizar seus cards mensais."
      >
        <RouterLink class="button button--primary" to="/orcamento">Abrir orçamento</RouterLink>
      </EmptyState>

      <section v-else class="dashboard-categories" aria-labelledby="dashboard-categories-title">
        <h2 id="dashboard-categories-title" class="panel__heading">Categorias em atenção</h2>
        <div class="grid grid--cards">
          <MarketCategoryCard
            v-for="progress in cards"
            :key="progress.categoryId"
            :progress="progress"
          />
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.dashboard-categories {
  display: grid;
  gap: 12px;
}
</style>

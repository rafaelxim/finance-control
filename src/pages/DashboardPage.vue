<script setup lang="ts">
import { computed, onMounted } from 'vue'

import BudgetSummary from '@/components/budget/BudgetSummary.vue'
import CategoryUsageExportButton from '@/components/budget/CategoryUsageExportButton.vue'
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
    const netWorth = toDecimal(latestNetWorth.value.netWorth)
    const isZeroNetWorth = netWorth.eq(0)

    if (change.lt(0)) {
      return {
        label: isZeroNetWorth ? 'Patrimônio zerado' : 'Patrimônio líquido',
        primaryAmount: latestNetWorth.value.netWorth,
        comparisonLabel: 'Variação mais recente',
        comparisonAmount: latestNetWorth.value.netWorthChange,
        state: 'negative',
        stateLabel: 'Patrimônio caiu',
        stateDescription: 'A variação mais recente está negativa.',
        primaryAmountEmphasis: isZeroNetWorth ? 'reduced' : 'standard',
        actionLabel: 'Atualizar balanço',
        actionTarget: '/balanco',
        source: 'balance'
      }
    }

    return {
      label: isZeroNetWorth ? 'Patrimônio zerado' : 'Patrimônio líquido',
      primaryAmount: latestNetWorth.value.netWorth,
      comparisonLabel: 'Variação mais recente',
      comparisonAmount: latestNetWorth.value.netWorthChange,
      state: change.gt(0) ? 'positive' : 'neutral',
      stateLabel: change.gt(0)
        ? 'Patrimônio subiu'
        : isZeroNetWorth
          ? 'Patrimônio zerado'
          : 'Sem variação',
      stateDescription: change.gt(0)
        ? 'O último balanço aumentou seu patrimônio.'
        : isZeroNetWorth
          ? 'Cadastre ativos ou dívidas para acompanhar a evolução.'
          : 'O último balanço manteve o patrimônio estável.',
      primaryAmountEmphasis: isZeroNetWorth ? 'reduced' : 'standard',
      actionLabel: 'Atualizar balanço',
      actionTarget: '/balanco',
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
      stateLabel: 'Orçamento excedido',
      stateDescription: 'O planejamento passou do valor disponível.',
      actionLabel: 'Ajustar orçamento',
      actionTarget: '/orcamento',
      source: 'budget'
    }
  }

  return {
    label: 'Saldo disponível do mês',
    primaryAmount: budgetStore.totals.unallocated,
    comparisonLabel: unallocated.gt(0) ? 'Ainda não alocado' : 'Orçamento totalmente alocado',
    comparisonAmount: budgetStore.totals.unallocated,
    state: unallocated.gt(0) ? 'positive' : 'neutral',
    stateLabel: unallocated.gt(0) ? 'Saldo disponível' : 'Orçamento alocado',
    stateDescription: unallocated.gt(0)
      ? 'Ainda há verba para distribuir no mês.'
      : 'Todo o valor disponível já foi distribuído.',
    primaryAmountEmphasis: unallocated.eq(0) ? 'reduced' : 'standard',
    actionLabel: unallocated.gt(0) ? 'Ajustar orçamento' : 'Registrar despesa',
    actionTarget: unallocated.gt(0) ? '/orcamento' : '/despesas',
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
      <div class="dashboard-layout">
        <div class="dashboard-layout__main">
          <DashboardFinancialSummary :summary="dashboardSummary" />

          <EmptyState
            v-if="!cards.length"
            title="Configure seu primeiro orçamento"
            description="Crie categorias para visualizar seus cards mensais."
          >
            <RouterLink class="button button--primary" to="/orcamento">Abrir orçamento</RouterLink>
          </EmptyState>

          <section v-else class="dashboard-categories" aria-labelledby="dashboard-categories-title">
            <div class="section-heading">
              <h2 id="dashboard-categories-title" class="panel__heading">Uso por categoria</h2>
              <CategoryUsageExportButton :progress="cards" :month="budgetStore.draftMonth" />
            </div>
            <div class="dashboard-categories__list">
              <MarketCategoryCard
                v-for="progress in cards"
                :key="progress.categoryId"
                :progress="progress"
              />
            </div>
          </section>
        </div>

        <aside class="dashboard-layout__support" aria-label="Resumo financeiro">
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
        </aside>
      </div>
    </template>
  </section>
</template>

<style scoped>
.dashboard-categories {
  display: grid;
  gap: 12px;
}

.dashboard-categories__list {
  display: grid;
  gap: 12px;
}
</style>

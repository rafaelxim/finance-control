<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import CategoryUsageExportButton from '@/components/budget/CategoryUsageExportButton.vue'
import MarketCategoryCard from '@/components/budget/MarketCategoryCard.vue'
import DashboardBudgetSummary from '@/components/finance/DashboardBudgetSummary.vue'
import DashboardFinancialSummary, {
  type DashboardFinancialSummaryViewModel
} from '@/components/finance/DashboardFinancialSummary.vue'
import DashboardSetupChecklist from '@/components/finance/DashboardSetupChecklist.vue'
import FinancialEvolutionChart from '@/components/finance/FinancialEvolutionChart.vue'
import { useSetupChecklist } from '@/composables/useSetupChecklist'
import { toDecimal } from '@/domain/shared/money'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { useBalanceStore } from '@/stores/balance.store'
import { useBudgetStore } from '@/stores/budget.store'
import { useExpensesStore } from '@/stores/expenses.store'
import { useProfileStore } from '@/stores/profile.store'

const budgetStore = useBudgetStore()
const expensesStore = useExpensesStore()
const balanceStore = useBalanceStore()
const profileStore = useProfileStore()
const dashboardHydrating = ref(true)
let dashboardLoadId = 0
const {
  items: setupChecklistItems,
  loadSetupChecklist,
  loading: setupChecklistLoading,
  shouldShowChecklist
} = useSetupChecklist()

const cards = computed(() => expensesStore.categoryProgress)
const latestNetWorth = computed(() => balanceStore.latestEvolution)
const dashboardLoading = computed(
  () =>
    dashboardHydrating.value ||
    budgetStore.loading ||
    expensesStore.loading ||
    balanceStore.loading ||
    setupChecklistLoading.value
)
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

async function loadDashboard(month = profileStore.activeMonth) {
  const loadId = ++dashboardLoadId
  dashboardHydrating.value = true

  try {
    await loadSetupChecklist(month)
  } finally {
    if (loadId === dashboardLoadId) {
      dashboardHydrating.value = false
    }
  }
}

onMounted(() => {
  void loadDashboard()
})

watch(
  () => profileStore.activeMonth,
  (month) => {
    void loadDashboard(month)
  }
)
</script>

<template>
  <section class="page">
    <LoadingState v-if="dashboardLoading" />

    <template v-else>
      <header class="page__header">
        <h1>Dashboard</h1>
        <p>Resumo do orçamento atual, gastos por categoria e patrimônio recente.</p>
      </header>

      <div class="dashboard-layout">
        <div class="dashboard-layout__main">
          <DashboardSetupChecklist v-if="shouldShowChecklist" :items="setupChecklistItems" />
          <DashboardFinancialSummary :summary="dashboardSummary" />
          <DashboardBudgetSummary
            :allocated-amount="budgetStore.totals.allocated"
            :expenses="expensesStore.sortedExpenses"
            :month="budgetStore.draftMonth"
            :over-allocated-amount="budgetStore.totals.overAllocated"
            :spent-amount="expensesStore.totalSpent"
          />
          <FinancialEvolutionChart
            v-if="balanceStore.evolution.length"
            :evolution="balanceStore.evolution"
          />

          <EmptyState
            v-if="!cards.length"
            title="Configure seu primeiro orçamento"
            description="Crie categorias para visualizar seus cards mensais."
          >
            <RouterLink class="button button--primary" to="/orcamento">Abrir orçamento</RouterLink>
          </EmptyState>
        </div>

        <section
          v-if="cards.length"
          class="dashboard-categories"
          aria-labelledby="dashboard-categories-title"
        >
          <div class="section-heading">
            <h2 id="dashboard-categories-title" class="panel__heading">Uso por categoria</h2>
            <CategoryUsageExportButton :progress="cards" :month="budgetStore.draftMonth" />
          </div>
          <div class="dashboard-categories__list">
            <RouterLink
              v-for="progress in cards"
              :key="progress.categoryId"
              class="dashboard-categories__link"
              :to="{ path: '/despesas', query: { categoria: progress.categoryId } }"
              :aria-label="`Ver despesas da categoria ${progress.categoryName}`"
            >
              <MarketCategoryCard :progress="progress" />
            </RouterLink>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page {
  max-width: 1600px;
}

.dashboard-categories {
  display: grid;
  grid-column: 1 / -1;
  gap: 12px;
}

.dashboard-categories__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr));
  gap: 12px;
}

.dashboard-categories__link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.dashboard-categories__link:focus-visible {
  border-radius: 14px;
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

@media (max-width: 720px) {
  .dashboard-categories {
    gap: 10px;
  }

  .dashboard-categories .section-heading {
    align-items: center;
  }

  .dashboard-categories__list {
    gap: 10px;
  }
}
</style>

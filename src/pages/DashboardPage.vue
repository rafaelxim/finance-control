<script setup lang="ts">
import { computed, onMounted } from 'vue'

import BudgetSummary from '@/components/budget/BudgetSummary.vue'
import MarketCategoryCard from '@/components/budget/MarketCategoryCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { useBudgetStore } from '@/stores/budget.store'
import { useExpensesStore } from '@/stores/expenses.store'

const budgetStore = useBudgetStore()
const expensesStore = useExpensesStore()

const cards = computed(() => expensesStore.categoryProgress)

onMounted(async () => {
  await budgetStore.loadMonth(budgetStore.draftMonth)
  await expensesStore.loadForBudget(budgetStore.budget?.id ?? null, budgetStore.draftMonth)
})
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Dashboard</h1>
      <p>Resumo do orçamento atual e dos cards iniciais por categoria.</p>
    </header>

    <LoadingState v-if="budgetStore.loading || expensesStore.loading" />

    <template v-else>
      <BudgetSummary
        :available-amount="budgetStore.draftAvailableAmount"
        :allocated="budgetStore.totals.allocated"
        :unallocated="budgetStore.totals.unallocated"
        :over-allocated="budgetStore.totals.overAllocated"
      />

      <EmptyState
        v-if="!cards.length"
        title="Configure seu primeiro orçamento"
        description="Crie categorias para visualizar seus cards mensais."
      >
        <RouterLink class="button button--primary" to="/orcamento">Abrir orçamento</RouterLink>
      </EmptyState>

      <section v-else class="grid grid--cards" aria-label="Cards de orçamento por categoria">
        <MarketCategoryCard
          v-for="progress in cards"
          :key="progress.categoryId"
          :progress="progress"
        />
      </section>
    </template>
  </section>
</template>

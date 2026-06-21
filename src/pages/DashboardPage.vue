<script setup lang="ts">
import { computed, onMounted } from 'vue'

import BudgetSummary from '@/components/budget/BudgetSummary.vue'
import CategoryBudgetCard from '@/components/budget/CategoryBudgetCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { useBudgetStore } from '@/stores/budget.store'

const budgetStore = useBudgetStore()

const cards = computed(() =>
  budgetStore.draftCategoriesWithLimits.filter((category) => category.name.trim())
)

onMounted(() => {
  void budgetStore.loadMonth(budgetStore.draftMonth)
})
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Dashboard</h1>
      <p>Resumo do orçamento atual e dos cards iniciais por categoria.</p>
    </header>

    <LoadingState v-if="budgetStore.loading" />

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
        <CategoryBudgetCard
          v-for="category in cards"
          :key="category.id ?? category.name"
          :name="category.name"
          :allocation-type="category.allocationType"
          :allocation-value="category.allocationValue"
          :computed-limit="category.computedLimit"
          :pokemon-asset-id="category.pokemonAssetId"
        />
      </section>
    </template>
  </section>
</template>

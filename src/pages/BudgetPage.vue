<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import BudgetSummary from '@/components/budget/BudgetSummary.vue'
import CategoryAllocationForm from '@/components/budget/CategoryAllocationForm.vue'
import CategoryBudgetCard from '@/components/budget/CategoryBudgetCard.vue'
import MonthlyBudgetForm from '@/components/budget/MonthlyBudgetForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FormError from '@/components/ui/FormError.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { budgetCategorySchema } from '@/domain/budget/schemas'
import type { BudgetDraftCategoryInput } from '@/domain/budget/types'
import type { MonthKey } from '@/domain/shared/types'
import { flattenZodErrors } from '@/domain/shared/validation'
import { useBudgetStore } from '@/stores/budget.store'

const budgetStore = useBudgetStore()
const saving = ref(false)
const saved = ref(false)
const errors = ref<string[]>([])

const activeCategories = computed(() =>
  budgetStore.draftCategoriesWithLimits.filter((category) => category.name.trim())
)

onMounted(() => {
  void budgetStore.loadMonth(budgetStore.draftMonth)
})

function updateCategory(index: number, category: BudgetDraftCategoryInput) {
  budgetStore.updateCategory(index, category)
  saved.value = false
}

async function updateMonth(month: MonthKey) {
  saved.value = false
  await budgetStore.loadMonth(month)
}

function validateBudget() {
  const categoryErrors = budgetStore.draftCategories.flatMap((category) =>
    category.name.trim() ? flattenZodErrors(budgetCategorySchema.safeParse(category)) : []
  )
  const duplicateNames = new Set<string>()
  const seen = new Set<string>()

  for (const category of budgetStore.draftCategories) {
    const name = category.name.trim().toLowerCase()
    if (!name) continue
    if (seen.has(name)) duplicateNames.add(category.name.trim())
    seen.add(name)
  }

  errors.value = [
    ...categoryErrors,
    ...Array.from(duplicateNames).map((name) => `Categoria duplicada: ${name}`)
  ]

  return errors.value.length === 0
}

async function saveBudget() {
  saved.value = false
  if (!validateBudget()) return

  saving.value = true
  try {
    await budgetStore.save()
    saved.value = true
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Orçamento mensal</h1>
      <p>Distribua seu valor disponível entre categorias fixas ou percentuais.</p>
    </header>

    <LoadingState v-if="budgetStore.loading" />

    <template v-else>
      <MonthlyBudgetForm
        :month="budgetStore.draftMonth"
        :available-amount="budgetStore.draftAvailableAmount"
        @update:month="updateMonth"
        @update:available-amount="budgetStore.setAvailableAmount"
      />

      <BudgetSummary
        :available-amount="budgetStore.summaryAvailableAmount"
        :allocated="budgetStore.totals.allocated"
        :unallocated="budgetStore.totals.unallocated"
        :over-allocated="budgetStore.totals.overAllocated"
      />

      <FormError :errors="errors" />
      <p v-if="saved" class="save-success" role="status">Orçamento salvo com sucesso.</p>

      <section class="stack" aria-label="Categorias do orçamento">
        <div class="actions">
          <BaseButton @click="budgetStore.addCategory">Adicionar categoria</BaseButton>
        </div>

        <EmptyState
          v-if="!budgetStore.draftCategories.length"
          title="Nenhuma categoria"
          description="Adicione categorias para distribuir o orçamento do mês."
        />

        <CategoryAllocationForm
          v-for="(category, index) in budgetStore.draftCategories"
          :key="category.id ?? index"
          :category="category"
          :index="index"
          @update="updateCategory"
          @remove="budgetStore.removeCategory"
        />
      </section>

      <section class="grid grid--cards" aria-label="Prévia dos cards">
        <CategoryBudgetCard
          v-for="category in activeCategories"
          :key="category.id ?? category.name"
          :name="category.name"
          :allocation-type="category.allocationType"
          :allocation-value="category.allocationValue"
          :computed-limit="category.computedLimit"
        />
      </section>

      <footer class="budget-save-actions" aria-label="Salvar orçamento completo">
        <div>
          <strong>Salvar orçamento completo</strong>
          <span>Mês, valor disponível, categorias e alocações serão persistidos juntos.</span>
        </div>
        <BaseButton :disabled="saving" @click="saveBudget">
          {{ saving ? 'Salvando...' : 'Salvar orçamento' }}
        </BaseButton>
      </footer>
    </template>
  </section>
</template>

<style scoped>
.save-success {
  border: 1px solid #9ae6b4;
  border-radius: var(--radius);
  background: #f0fff4;
  color: #276749;
  margin: 0;
  padding: 12px;
}

.budget-save-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--color-border);
  padding-top: 18px;
}

.budget-save-actions div {
  display: grid;
  gap: 3px;
}

.budget-save-actions span {
  color: var(--color-muted);
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .budget-save-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>

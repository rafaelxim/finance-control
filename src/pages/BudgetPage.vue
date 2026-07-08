<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import BudgetSummary from '@/components/budget/BudgetSummary.vue'
import CategoryAllocationForm from '@/components/budget/CategoryAllocationForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FormError from '@/components/ui/FormError.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { budgetCategorySchema } from '@/domain/budget/schemas'
import type { BudgetDraftCategoryInput } from '@/domain/budget/types'
import type { MonthKey } from '@/domain/shared/types'
import { flattenZodErrors } from '@/domain/shared/validation'
import { useBudgetStore } from '@/stores/budget.store'
import { useProfileStore } from '@/stores/profile.store'

const budgetStore = useBudgetStore()
const profileStore = useProfileStore()
const saving = ref(false)
const errors = ref<string[]>([])
const savedDraftSnapshot = ref('')

function serializeDraft() {
  return JSON.stringify({
    month: budgetStore.draftMonth,
    availableAmount: budgetStore.draftAvailableAmount,
    categories: budgetStore.draftCategories.map((category) => ({
      id: category.id,
      name: category.name,
      allocationType: category.allocationType,
      allocationValue: category.allocationValue
    }))
  })
}

async function loadMonth(month: MonthKey) {
  await budgetStore.loadMonth(month)
  savedDraftSnapshot.value = serializeDraft()
  errors.value = []
}

onMounted(() => {
  void loadMonth(profileStore.activeMonth)
})

watch(
  () => profileStore.activeMonth,
  (month) => {
    void loadMonth(month)
  }
)

function updateCategory(index: number, category: BudgetDraftCategoryInput) {
  budgetStore.updateCategory(index, category)
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
  if (!validateBudget()) return

  saving.value = true
  try {
    await budgetStore.save()
    savedDraftSnapshot.value = serializeDraft()
    errors.value = []
  } finally {
    saving.value = false
  }
}

const hasUnsavedChanges = computed(
  () => Boolean(savedDraftSnapshot.value) && serializeDraft() !== savedDraftSnapshot.value
)

const budgetOverviewTitle = computed(() =>
  errors.value.length ? 'Ajuste os campos com erro antes de salvar' : 'Revisar orçamento'
)
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Orçamento mensal</h1>
      <p>Distribua seu valor disponível entre categorias fixas ou percentuais.</p>
    </header>

    <LoadingState v-if="budgetStore.loading" />

    <template v-else>
      <div class="budget-layout">
        <main class="budget-layout__main">
          <section class="budget-overview" aria-label="Visão geral do orçamento">
            <BudgetSummary
              :available-amount="budgetStore.draftAvailableAmount"
              :allocated="budgetStore.totals.allocated"
              :unallocated="budgetStore.totals.unallocated"
              :over-allocated="budgetStore.totals.overAllocated"
              title="Resumo do orçamento"
              @update:available-amount="budgetStore.setAvailableAmount"
            />
          </section>

          <section class="budget-section" aria-labelledby="budget-editor-title">
            <div class="budget-section__header">
              <div>
                <h2 id="budget-editor-title">Editor de categorias</h2>
                <p>
                  Visualize a grade de categorias e expanda apenas o card que deseja ajustar.
                </p>
              </div>
            </div>

            <div class="budget-category-list" aria-label="Categorias do orçamento">
              <EmptyState
                v-if="!budgetStore.draftCategories.length"
                title="Nenhuma categoria"
                description="Adicione categorias para distribuir o orçamento do mês."
              />
              <CategoryAllocationForm
                v-for="(category, index) in budgetStore.draftCategoriesWithLimits"
                :key="category.id ?? index"
                :category="category"
                :computed-limit="category.computedLimit"
                :index="index"
                @update="updateCategory"
                @remove="budgetStore.removeCategory"
              />
              <button class="budget-add-card" type="button" @click="budgetStore.addCategory">
                <span class="budget-add-card__icon" aria-hidden="true">+</span>
                <strong>Adicionar categoria</strong>
                <span>Cria um novo card ao final da grade.</span>
              </button>
            </div>
          </section>
        </main>
      </div>

      <section
        v-if="hasUnsavedChanges"
        class="budget-save-actions budget-save-actions--floating"
        aria-label="Salvar orçamento completo"
      >
        <div>
          <strong>{{ budgetOverviewTitle }}</strong>
          <span>Mês, valor disponível, categorias e alocações serão persistidos juntos.</span>
        </div>
        <div class="budget-save-actions__buttons">
          <FormError :errors="errors" />
          <BaseButton :disabled="saving" @click="saveBudget">
            {{ saving ? 'Salvando...' : 'Salvar orçamento' }}
          </BaseButton>
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.page {
  max-width: 1600px;
  padding-bottom: 180px;
}

.budget-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.budget-layout__main {
  display: grid;
  min-width: 0;
  gap: 22px;
}

.budget-section {
  display: grid;
  gap: 18px;
}

.budget-overview {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

.budget-section__header {
  display: grid;
  gap: 6px;
}

.budget-section__header > div {
  min-width: 0;
  max-width: 72ch;
}

.budget-section__header h2 {
  margin: 0;
  font-size: 1.05rem;
}

.budget-section__header p,
.budget-save-actions span,
.budget-add-card span {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.budget-category-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.budget-category-list :deep(.empty-state) {
  grid-column: 1 / -1;
}

.budget-add-card {
  display: grid;
  justify-items: start;
  align-content: center;
  gap: 8px;
  min-height: 184px;
  border: 1px dashed color-mix(in srgb, var(--color-primary) 52%, var(--color-border));
  border-radius: var(--radius-card);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 9%, transparent), transparent),
    var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  padding: 22px;
  text-align: left;
  transition:
    border-color 140ms ease,
    transform 140ms ease,
    background-color 140ms ease;
}

.budget-add-card:hover,
.budget-add-card:focus-visible {
  border-color: var(--color-primary);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent),
    var(--color-surface);
  transform: translateY(-2px);
}

.budget-add-card__icon {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-primary) 16%, transparent);
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.budget-add-card strong {
  font-size: 1rem;
}

.budget-save-actions {
  display: grid;
  gap: 14px;
}

.budget-save-actions > div:first-child {
  min-width: 0;
  gap: 4px;
}

.budget-save-actions strong,
.budget-save-actions span {
  min-width: 0;
}

.budget-save-actions--floating {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 20;
  width: min(380px, calc(100vw - 48px));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-bg) 22%, var(--color-surface));
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(14px);
  padding: 18px;
}

.budget-save-actions > div {
  display: grid;
  gap: 3px;
}

.budget-save-actions__buttons {
  display: grid;
  justify-items: stretch;
  gap: 10px;
}

.budget-save-actions__buttons :deep(.button) {
  width: 100%;
}

</style>

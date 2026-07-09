<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Plus, Save } from 'lucide-vue-next'

import BudgetSummary from '@/components/budget/BudgetSummary.vue'
import CategoryAllocationForm from '@/components/budget/CategoryAllocationForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CurrencyInput from '@/components/ui/CurrencyInput.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FormError from '@/components/ui/FormError.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { budgetCategorySchema } from '@/domain/budget/schemas'
import type { AllocationType, BudgetDraftCategoryInput } from '@/domain/budget/types'
import type { MonthKey } from '@/domain/shared/types'
import { flattenZodErrors } from '@/domain/shared/validation'
import { readVisualPreferences } from '@/storage/data-export.repository'
import { useBudgetStore } from '@/stores/budget.store'
import { useProfileStore } from '@/stores/profile.store'

const budgetStore = useBudgetStore()
const profileStore = useProfileStore()
const saving = ref(false)
const errors = ref<string[]>([])
const categoryModalOpen = ref(false)
const editingCategoryIndex = ref<number | null>(null)
const categoryDraft = ref<BudgetDraftCategoryInput>(createEmptyCategory())
const availableAmountModalOpen = ref(false)
const availableAmountDraft = ref('')
const categoryVisuals = ref<Record<string, string>>({})

const allocationOptions = [
  { value: 'fixed', label: 'Valor fixo' },
  { value: 'percentage', label: 'Percentual' }
]

const categoryModalTitle = computed(() =>
  editingCategoryIndex.value === null ? 'Adicionar categoria' : 'Editar categoria'
)

const valueLabel = computed(() =>
  categoryDraft.value.allocationType === 'percentage' ? 'Percentual' : 'Valor'
)

async function loadMonth(month: MonthKey) {
  categoryVisuals.value = (await readVisualPreferences()).categoryVisuals ?? {}
  await budgetStore.loadMonth(month)
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

function createEmptyCategory(): BudgetDraftCategoryInput {
  return {
    name: '',
    allocationType: 'fixed',
    allocationValue: '0.00'
  }
}

function openCreateCategoryModal() {
  errors.value = []
  editingCategoryIndex.value = null
  categoryDraft.value = createEmptyCategory()
  categoryModalOpen.value = true
}

function openEditCategoryModal(index: number) {
  const category = budgetStore.draftCategories[index]
  if (!category) return

  errors.value = []
  editingCategoryIndex.value = index
  categoryDraft.value = { ...category }
  categoryModalOpen.value = true
}

function closeCategoryModal() {
  if (saving.value) return
  categoryModalOpen.value = false
  editingCategoryIndex.value = null
  categoryDraft.value = createEmptyCategory()
  errors.value = []
}

function updateCategoryDraft(update: Partial<BudgetDraftCategoryInput>) {
  categoryDraft.value = {
    ...categoryDraft.value,
    ...update
  }
}

function categoryColor(category: BudgetDraftCategoryInput) {
  const value = category.id ? categoryVisuals.value[category.id] : undefined
  return value || 'var(--color-primary)'
}

function openAvailableAmountModal() {
  errors.value = []
  availableAmountDraft.value = budgetStore.draftAvailableAmount
  availableAmountModalOpen.value = true
}

function closeAvailableAmountModal() {
  if (saving.value) return
  availableAmountModalOpen.value = false
  availableAmountDraft.value = ''
  errors.value = []
}

function validateBudget(categories = budgetStore.draftCategories) {
  const categoryErrors = categories.flatMap((category) =>
    category.name.trim() ? flattenZodErrors(budgetCategorySchema.safeParse(category)) : []
  )
  const duplicateNames = new Set<string>()
  const seen = new Set<string>()

  for (const category of categories) {
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

async function persistCategories(categories: BudgetDraftCategoryInput[]) {
  if (!validateBudget(categories)) return false

  saving.value = true
  try {
    budgetStore.draftCategories = categories
    await budgetStore.save()
    errors.value = []
    return true
  } finally {
    saving.value = false
  }
}

async function saveCategory() {
  const nextCategories =
    editingCategoryIndex.value === null
      ? [...budgetStore.draftCategories, categoryDraft.value]
      : budgetStore.draftCategories.map((category, index) =>
          index === editingCategoryIndex.value ? categoryDraft.value : category
        )

  const persisted = await persistCategories(nextCategories)
  if (persisted) closeCategoryModal()
}

async function saveAvailableAmount() {
  if (!validateBudget()) return

  saving.value = true
  let persisted = false
  try {
    budgetStore.setAvailableAmount(availableAmountDraft.value)
    await budgetStore.save()
    errors.value = []
    persisted = true
  } finally {
    saving.value = false
  }

  if (persisted) closeAvailableAmountModal()
}

async function removeCategory(index: number) {
  const category = budgetStore.draftCategories[index]
  const name = category?.name.trim() || 'esta categoria'
  if (!window.confirm(`Remover ${name}?`)) return

  const nextCategories = budgetStore.draftCategories.filter(
    (_, categoryIndex) => categoryIndex !== index
  )
  await persistCategories(nextCategories)
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
      <div class="budget-layout">
        <main class="budget-layout__main">
          <section class="budget-overview" aria-label="Visão geral do orçamento">
            <BudgetSummary
              :available-amount="budgetStore.draftAvailableAmount"
              :allocated="budgetStore.totals.allocated"
              :unallocated="budgetStore.totals.unallocated"
              :over-allocated="budgetStore.totals.overAllocated"
              title="Resumo do orçamento"
              @edit-available-amount="openAvailableAmountModal"
            />
          </section>

          <section class="budget-section" aria-labelledby="budget-editor-title">
            <div class="budget-section__header">
              <div>
                <h2 id="budget-editor-title">Editor de categorias</h2>
                <p>Visualize a grade de categorias e edite cada card em uma janela dedicada.</p>
              </div>
              <BaseButton class="budget-add-button" @click="openCreateCategoryModal">
                <Plus :size="18" aria-hidden="true" />
                Adicionar categoria
              </BaseButton>
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
                :category-color="categoryColor(category)"
                :computed-limit="category.computedLimit"
                :index="index"
                @edit="openEditCategoryModal"
                @remove="removeCategory"
              />
            </div>
          </section>
        </main>
      </div>

      <BaseModal
        :open="categoryModalOpen"
        :title="categoryModalTitle"
        description="Defina a categoria e salve para atualizar o orçamento do mês."
        @close="closeCategoryModal"
      >
        <form v-if="categoryModalOpen" class="category-modal-form" @submit.prevent="saveCategory">
          <FormError :errors="errors" />
          <BaseInput
            id="category-modal-name"
            :model-value="categoryDraft.name"
            label="Categoria"
            placeholder="Ex.: Comida"
            @update:model-value="updateCategoryDraft({ name: $event })"
          />
          <BaseSelect
            id="category-modal-type"
            :model-value="categoryDraft.allocationType"
            :options="allocationOptions"
            label="Tipo"
            @update:model-value="updateCategoryDraft({ allocationType: $event as AllocationType })"
          />
          <CurrencyInput
            v-if="categoryDraft.allocationType === 'fixed'"
            id="category-modal-value"
            :model-value="categoryDraft.allocationValue"
            :label="valueLabel"
            @update:model-value="updateCategoryDraft({ allocationValue: $event })"
          />
          <BaseInput
            v-else
            id="category-modal-percent"
            :model-value="categoryDraft.allocationValue"
            :label="valueLabel"
            type="number"
            @update:model-value="updateCategoryDraft({ allocationValue: $event })"
          />
          <div class="category-modal-form__actions">
            <BaseButton type="button" variant="ghost" @click="closeCategoryModal">
              Cancelar
            </BaseButton>
            <BaseButton type="submit" :disabled="saving">
              <Save :size="17" aria-hidden="true" />
              {{ saving ? 'Salvando...' : 'Salvar categoria' }}
            </BaseButton>
          </div>
        </form>
      </BaseModal>

      <BaseModal
        :open="availableAmountModalOpen"
        title="Editar valor mensal disponível"
        description="Atualize o valor base usado para calcular as categorias deste mês."
        @close="closeAvailableAmountModal"
      >
        <form
          v-if="availableAmountModalOpen"
          class="category-modal-form"
          @submit.prevent="saveAvailableAmount"
        >
          <FormError :errors="errors" />
          <CurrencyInput
            id="available-amount-modal"
            :model-value="availableAmountDraft"
            label="Valor mensal disponível"
            @update:model-value="availableAmountDraft = $event"
          />
          <div class="category-modal-form__actions">
            <BaseButton type="button" variant="ghost" @click="closeAvailableAmountModal">
              Cancelar
            </BaseButton>
            <BaseButton type="submit" :disabled="saving">
              <Save :size="17" aria-hidden="true" />
              {{ saving ? 'Salvando...' : 'Salvar valor mensal' }}
            </BaseButton>
          </div>
        </form>
      </BaseModal>
    </template>
  </section>
</template>

<style scoped>
.page {
  max-width: 1600px;
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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

.budget-section__header p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.budget-add-button {
  flex: 0 0 auto;
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

.category-modal-form {
  display: grid;
  gap: 14px;
}

.category-modal-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 760px) {
  .page {
    gap: 18px;
  }

  .budget-layout,
  .budget-layout__main {
    gap: 18px;
  }

  .budget-section {
    gap: 14px;
  }

  .budget-section__header {
    display: grid;
    gap: 12px;
  }

  .budget-add-button {
    width: 100%;
    justify-self: stretch;
  }

  .budget-category-list {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>

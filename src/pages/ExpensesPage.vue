<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ExpenseForm from '@/components/finance/ExpenseForm.vue'
import ExpenseList from '@/components/finance/ExpenseList.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FormError from '@/components/ui/FormError.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import PageAlert from '@/components/ui/PageAlert.vue'
import { validateExpenseForBudget } from '@/domain/expenses/schemas'
import type { Expense, ExpenseDraftInput } from '@/domain/expenses/types'
import type { MonthKey } from '@/domain/shared/types'
import { readVisualPreferences } from '@/storage/data-export.repository'
import { useBudgetStore } from '@/stores/budget.store'
import { useExpensesStore } from '@/stores/expenses.store'
import { useProfileStore } from '@/stores/profile.store'

const router = useRouter()
const route = useRoute()
const budgetStore = useBudgetStore()
const expensesStore = useExpensesStore()
const profileStore = useProfileStore()
const errors = ref<string[]>([])
const saving = ref(false)
const editingExpense = ref<Expense | null>(null)
const expenseModalOpen = ref(false)
const categoryVisuals = ref<Record<string, string>>({})
const pageAlert = ref<{ tone: 'success' | 'error'; message: string } | null>(null)
const pageHydrating = ref(true)
let pageLoadId = 0

const defaultDate = computed(() => `${budgetStore.draftMonth}-01`)
const activeCategories = computed(() => budgetStore.activeCategories)
const pageLoading = computed(
  () => pageHydrating.value || budgetStore.loading || expensesStore.loading
)
const categoryFilter = computed(() => {
  const value = route.query.categoria
  return typeof value === 'string' ? value : 'all'
})

async function loadPage(month: MonthKey) {
  const loadId = ++pageLoadId
  pageHydrating.value = true

  try {
    const visualPreferences = await readVisualPreferences()
    categoryVisuals.value = visualPreferences.categoryVisuals ?? {}
    await budgetStore.loadMonth(month)
    await expensesStore.loadForBudget(budgetStore.budget?.id ?? null, budgetStore.draftMonth)
  } finally {
    if (loadId === pageLoadId) {
      pageHydrating.value = false
    }
  }
}

onMounted(() => {
  void loadPage(profileStore.activeMonth)
})

watch(
  () => profileStore.activeMonth,
  (month) => {
    void loadPage(month as MonthKey)
  }
)

async function saveExpense(expense: ExpenseDraftInput) {
  pageAlert.value = null
  errors.value = validateExpenseForBudget(expense, budgetStore.budget, activeCategories.value)
  if (errors.value.length) {
    pageAlert.value = {
      tone: 'error',
      message: 'Não foi possível salvar a despesa. Revise os campos destacados.'
    }
    return
  }

  saving.value = true
  let savedMessage = ''
  try {
    const wasEditing = Boolean(editingExpense.value)
    await expensesStore.save(expense)
    savedMessage = wasEditing ? 'Despesa atualizada com sucesso.' : 'Despesa incluída com sucesso.'
  } catch (error) {
    pageAlert.value = {
      tone: 'error',
      message: error instanceof Error ? error.message : 'Não foi possível salvar a despesa.'
    }
  } finally {
    saving.value = false
  }

  if (savedMessage) {
    closeExpenseModal()
    pageAlert.value = {
      tone: 'success',
      message: savedMessage
    }
  }
}

async function deleteExpense(expenseId: string) {
  await expensesStore.remove(expenseId)
  if (editingExpense.value?.id === expenseId) {
    editingExpense.value = null
  }
}

function createCategory() {
  closeExpenseModal()
  budgetStore.addCategory()
  void router.push('/orcamento')
}

function openCreateExpenseModal() {
  errors.value = []
  pageAlert.value = null
  editingExpense.value = null
  expenseModalOpen.value = true
}

function openEditExpenseModal(expense: Expense) {
  errors.value = []
  pageAlert.value = null
  editingExpense.value = expense
  expenseModalOpen.value = true
}

function closeExpenseModal() {
  if (saving.value) return
  expenseModalOpen.value = false
  editingExpense.value = null
  errors.value = []
}
</script>

<template>
  <section class="page">
    <PageAlert
      v-if="pageAlert"
      :message="pageAlert.message"
      :tone="pageAlert.tone"
      @close="pageAlert = null"
    />

    <LoadingState v-if="pageLoading" />

    <template v-else>
      <EmptyState
        v-if="!budgetStore.budget"
        title="Orçamento necessário"
        description="Crie o orçamento do mês antes de registrar despesas."
      >
        <RouterLink class="button button--primary" to="/orcamento">Abrir orçamento</RouterLink>
      </EmptyState>

      <template v-else>
        <ExpenseList
          :expenses="expensesStore.sortedExpenses"
          :categories="activeCategories"
          :category-filter="categoryFilter"
          :category-visuals="categoryVisuals"
          @create="openCreateExpenseModal"
          @edit="openEditExpenseModal"
          @delete="deleteExpense"
        />

        <BaseModal
          :open="expenseModalOpen"
          :title="editingExpense ? 'Editar despesa' : 'Registrar despesa'"
          description="Informe os dados do gasto para atualizar o acompanhamento do mês."
          @close="closeExpenseModal"
        >
          <FormError :errors="errors" />
          <ExpenseForm
            v-if="expenseModalOpen"
            class="expense-modal__form"
            :budget-id="budgetStore.budget.id"
            :categories="activeCategories"
            :default-date="defaultDate"
            :editing-expense="editingExpense"
            :saving="saving"
            @submit="saveExpense"
            @create-category="createCategory"
          />
        </BaseModal>
      </template>
    </template>
  </section>
</template>

<style scoped>
.page {
  max-width: 1600px;
}

.expense-modal__form {
  border: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
}
</style>

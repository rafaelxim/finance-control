<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import ExpenseForm from '@/components/finance/ExpenseForm.vue'
import ExpenseList from '@/components/finance/ExpenseList.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FormError from '@/components/ui/FormError.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { validateExpenseForBudget } from '@/domain/expenses/schemas'
import type { Expense, ExpenseDraftInput } from '@/domain/expenses/types'
import type { MonthKey } from '@/domain/shared/types'
import { useBudgetStore } from '@/stores/budget.store'
import { useExpensesStore } from '@/stores/expenses.store'
import { useProfileStore } from '@/stores/profile.store'

const router = useRouter()
const budgetStore = useBudgetStore()
const expensesStore = useExpensesStore()
const profileStore = useProfileStore()
const errors = ref<string[]>([])
const saving = ref(false)
const editingExpense = ref<Expense | null>(null)
const expenseModalOpen = ref(false)

const defaultDate = computed(() => `${budgetStore.draftMonth}-01`)
const activeCategories = computed(() => budgetStore.activeCategories)

onMounted(async () => {
  await budgetStore.loadMonth(profileStore.activeMonth)
  await expensesStore.loadForBudget(budgetStore.budget?.id ?? null, budgetStore.draftMonth)
})

watch(
  () => profileStore.activeMonth,
  async (month) => {
    await budgetStore.loadMonth(month as MonthKey)
    await expensesStore.loadForBudget(budgetStore.budget?.id ?? null, budgetStore.draftMonth)
  }
)

async function saveExpense(expense: ExpenseDraftInput) {
  errors.value = validateExpenseForBudget(expense, budgetStore.budget, activeCategories.value)
  if (errors.value.length) return

  saving.value = true
  try {
    await expensesStore.save(expense)
    closeExpenseModal()
  } finally {
    saving.value = false
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
  editingExpense.value = null
  expenseModalOpen.value = true
}

function openEditExpenseModal(expense: Expense) {
  errors.value = []
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
    <LoadingState v-if="budgetStore.loading || expensesStore.loading" />

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

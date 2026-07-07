<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import CategoryUsageExportButton from '@/components/budget/CategoryUsageExportButton.vue'
import MarketCategoryCard from '@/components/budget/MarketCategoryCard.vue'
import ExpenseForm from '@/components/finance/ExpenseForm.vue'
import ExpenseList from '@/components/finance/ExpenseList.vue'
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
    editingExpense.value = null
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
  budgetStore.addCategory()
  void router.push('/orcamento')
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Despesas</h1>
      <p>Registre gastos do mês e acompanhe o consumo por categoria.</p>
    </header>

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
        <ExpenseForm
          :budget-id="budgetStore.budget.id"
          :categories="activeCategories"
          :default-date="defaultDate"
          :editing-expense="editingExpense"
          :saving="saving"
          @submit="saveExpense"
          @create-category="createCategory"
        />

        <FormError :errors="errors" />

        <section
          class="expense-category-progress"
          aria-labelledby="expense-category-progress-title"
        >
          <div class="section-heading">
            <h2 id="expense-category-progress-title" class="panel__heading">
              Progresso por categoria
            </h2>
            <CategoryUsageExportButton
              :progress="expensesStore.categoryProgress"
              :month="budgetStore.draftMonth"
            />
          </div>

          <div class="expense-category-progress__cards">
            <MarketCategoryCard
              v-for="progress in expensesStore.categoryProgress"
              :key="progress.categoryId"
              :progress="progress"
            />
          </div>
        </section>

        <EmptyState
          v-if="!expensesStore.expenses.length"
          title="Nenhuma despesa registrada"
          description="Registre o primeiro gasto para acompanhar o progresso do mês."
        />

        <ExpenseList
          v-else
          :expenses="expensesStore.sortedExpenses"
          :categories="activeCategories"
          @edit="editingExpense = $event"
          @delete="deleteExpense"
        />
      </template>
    </template>
  </section>
</template>

<style scoped>
.page {
  max-width: 1600px;
}

.expense-category-progress__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr));
  gap: 16px;
}
</style>

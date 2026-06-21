import { defineStore } from 'pinia'

import type { Expense, ExpenseDraftInput } from '@/domain/expenses/types'
import {
  calculateCategoryProgress,
  calculateTotalSpent
} from '@/domain/gamification/category-progress'
import type { EntityId, MonthKey } from '@/domain/shared/types'
import { currentMonthKey } from '@/domain/shared/types'
import { deleteExpense, getExpensesByBudgetId, saveExpense } from '@/storage/expense.repository'
import { useBudgetStore } from '@/stores/budget.store'

interface ExpensesState {
  month: MonthKey
  budgetId: EntityId | null
  expenses: Expense[]
  loading: boolean
  lastSavedAt: string | null
}

export const useExpensesStore = defineStore('expenses', {
  state: (): ExpensesState => ({
    month: currentMonthKey(),
    budgetId: null,
    expenses: [],
    loading: false,
    lastSavedAt: null
  }),
  getters: {
    sortedExpenses(state): Expense[] {
      return [...state.expenses].sort((left, right) => right.date.localeCompare(left.date))
    },
    totalSpent(state): string {
      return calculateTotalSpent(state.expenses)
    },
    categoryProgress(state) {
      const budgetStore = useBudgetStore()
      return calculateCategoryProgress(budgetStore.activeCategories, state.expenses)
    }
  },
  actions: {
    async loadForBudget(budgetId: EntityId | null, month: MonthKey) {
      this.month = month
      this.budgetId = budgetId
      this.loading = true
      try {
        this.expenses = budgetId ? await getExpensesByBudgetId(budgetId) : []
      } finally {
        this.loading = false
      }
    },
    async save(input: ExpenseDraftInput) {
      const saved = await saveExpense(input)
      const index = this.expenses.findIndex((expense) => expense.id === saved.id)
      if (index >= 0) {
        this.expenses[index] = saved
      } else {
        this.expenses.unshift(saved)
      }
      this.lastSavedAt = new Date().toISOString()
      return saved
    },
    async remove(id: EntityId) {
      await deleteExpense(id)
      this.expenses = this.expenses.filter((expense) => expense.id !== id)
      this.lastSavedAt = new Date().toISOString()
    }
  }
})

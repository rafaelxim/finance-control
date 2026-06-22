import { defineStore } from 'pinia'

import { calculateBudgetTotals, withComputedLimits } from '@/domain/budget/allocation'
import { createHistoricalBudgetCopy } from '@/domain/budget/history'
import type { BudgetCategory, BudgetDraftCategoryInput, MonthlyBudget } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import { calculateCategoryProgress } from '@/domain/gamification/category-progress'
import { toMoneyString } from '@/domain/shared/money'
import type { MonthKey } from '@/domain/shared/types'
import { currentMonthKey } from '@/domain/shared/types'
import { getBudgetByMonth, saveBudgetWithCategories } from '@/storage/budget.repository'

interface BudgetState {
  budget: MonthlyBudget | null
  categories: BudgetCategory[]
  draftMonth: MonthKey
  draftAvailableAmount: string
  draftCategories: BudgetDraftCategoryInput[]
  loading: boolean
  lastSavedAt: string | null
}

function initialCategories(): BudgetDraftCategoryInput[] {
  return [
    {
      name: 'Aluguel',
      allocationType: 'fixed',
      allocationValue: '400.00'
    },
    {
      name: 'Comida',
      allocationType: 'fixed',
      allocationValue: '300.00'
    },
    {
      name: 'Lazer',
      allocationType: 'fixed',
      allocationValue: '100.00'
    }
  ]
}

export const useBudgetStore = defineStore('budget', {
  state: (): BudgetState => ({
    budget: null,
    categories: [],
    draftMonth: currentMonthKey(),
    draftAvailableAmount: '1000.00',
    draftCategories: initialCategories(),
    loading: false,
    lastSavedAt: null
  }),
  getters: {
    draftCategoriesWithLimits(state) {
      return withComputedLimits(state.draftAvailableAmount || '0', state.draftCategories)
    },
    totals(state): ReturnType<typeof calculateBudgetTotals> {
      const source = state.budget
        ? state.categories
        : withComputedLimits(state.draftAvailableAmount || '0', state.draftCategories).map(
            (category) => ({
              ...category,
              status: 'active' as const
            })
          )

      return calculateBudgetTotals(
        state.budget?.availableAmount ?? state.draftAvailableAmount ?? '0',
        source
      )
    },
    summaryAvailableAmount(state): string {
      return state.budget?.availableAmount ?? state.draftAvailableAmount
    },
    activeCategories(state): BudgetCategory[] {
      return state.categories.filter((category) => category.status === 'active')
    },
    progressForExpenses(
      state
    ): (expenses: Expense[]) => ReturnType<typeof calculateCategoryProgress> {
      return (expenses: Expense[]) => calculateCategoryProgress(state.categories, expenses)
    }
  },
  actions: {
    async loadMonth(month: MonthKey) {
      this.loading = true
      try {
        const { budget, categories } = await getBudgetByMonth(month)
        this.budget = budget
        this.categories = categories
        this.draftMonth = month
        this.draftAvailableAmount = budget?.availableAmount ?? this.draftAvailableAmount
        this.draftCategories = categories.length
          ? categories
              .filter((category) => category.status === 'active')
              .map((category) => ({
                id: category.id,
                name: category.name,
                allocationType: category.allocationType,
                allocationValue: category.allocationValue
              }))
          : this.draftCategories
      } finally {
        this.loading = false
      }
    },
    setAvailableAmount(value: string) {
      this.draftAvailableAmount = value
    },
    addCategory() {
      this.draftCategories.push({
        name: '',
        allocationType: 'fixed',
        allocationValue: '0.00'
      })
    },
    updateCategory(index: number, category: BudgetDraftCategoryInput) {
      this.draftCategories[index] = {
        ...category,
        allocationValue: category.allocationValue || '0.00'
      }
    },
    renameCategory(index: number, name: string) {
      const category = this.draftCategories[index]
      if (!category) return
      this.updateCategory(index, { ...category, name })
    },
    archiveCategory(index: number) {
      this.removeCategory(index)
    },
    async copyFromMonth(month: MonthKey) {
      const { budget, categories } = await getBudgetByMonth(month)
      if (!budget) return false

      this.draftAvailableAmount = budget.availableAmount
      this.draftCategories = createHistoricalBudgetCopy(categories)
      return true
    },
    removeCategory(index: number) {
      this.draftCategories.splice(index, 1)
    },
    async save() {
      const saved = await saveBudgetWithCategories({
        month: this.draftMonth,
        availableAmount: toMoneyString(this.draftAvailableAmount || '0'),
        categories: this.draftCategories.filter((category) => category.name.trim())
      })
      this.budget = saved.budget
      this.categories = saved.categories
      this.draftAvailableAmount = saved.budget.availableAmount
      this.draftCategories = saved.categories.map((category) => ({
        id: category.id,
        name: category.name,
        allocationType: category.allocationType,
        allocationValue: category.allocationValue
      }))
      this.lastSavedAt = new Date().toISOString()
    }
  }
})

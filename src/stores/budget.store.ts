import { defineStore } from 'pinia'

import { calculateBudgetTotals, withComputedLimits } from '@/domain/budget/allocation'
import type { BudgetCategory, BudgetDraftCategoryInput, MonthlyBudget } from '@/domain/budget/types'
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
      allocationValue: '400.00',
      pokemonAssetId: 'bulbasaur-card'
    },
    {
      name: 'Comida',
      allocationType: 'fixed',
      allocationValue: '300.00',
      pokemonAssetId: 'pikachu-card'
    },
    {
      name: 'Lazer',
      allocationType: 'fixed',
      allocationValue: '100.00',
      pokemonAssetId: 'squirtle-card'
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
        state.draftAvailableAmount || state.budget?.availableAmount || '0',
        source
      )
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
                allocationValue: category.allocationValue,
                pokemonAssetId: category.pokemonAssetId
              }))
          : this.draftCategories
      } finally {
        this.loading = false
      }
    },
    setAvailableAmount(value: string) {
      this.draftAvailableAmount = toMoneyString(value || '0')
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
        allocationValue: category.allocationValue,
        pokemonAssetId: category.pokemonAssetId
      }))
      this.lastSavedAt = new Date().toISOString()
    }
  }
})

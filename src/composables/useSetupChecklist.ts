import { computed, ref } from 'vue'

import { currentMonthKey, type MonthKey } from '@/domain/shared/types'
import { readVisualPreferences } from '@/storage/data-export.repository'
import { useBalanceStore } from '@/stores/balance.store'
import { useBudgetStore } from '@/stores/budget.store'
import { useExpensesStore } from '@/stores/expenses.store'

export interface SetupChecklistItem {
  id: string
  title: string
  description: string
  actionLabel: string
  actionTarget: string
  completed: boolean
}

const categoryVisuals = ref<Record<string, string>>({})
const loading = ref(false)
const activeChecklistMonth = ref<MonthKey>(currentMonthKey())
const hexColorPattern = /^#[0-9a-f]{6}$/i

export function useSetupChecklist() {
  const budgetStore = useBudgetStore()
  const expensesStore = useExpensesStore()
  const balanceStore = useBalanceStore()

  const hasBudget = computed(() => Boolean(budgetStore.budget))
  const hasActiveCategories = computed(() => budgetStore.activeCategories.length > 0)
  const hasExpenses = computed(() => expensesStore.expenses.length > 0)
  const hasBalanceItems = computed(() => balanceStore.items.length > 0)
  const hasCategoryVisuals = computed(() =>
    budgetStore.activeCategories.some((category) =>
      hexColorPattern.test(categoryVisuals.value[category.id] ?? '')
    )
  )

  const items = computed<SetupChecklistItem[]>(() => [
    {
      id: 'budget',
      title: 'Definir orçamento do mês',
      description: 'Salve o valor mensal disponível para o mês ativo.',
      actionLabel: 'Abrir orçamento',
      actionTarget: '/orcamento',
      completed: hasBudget.value
    },
    {
      id: 'categories',
      title: 'Revisar categorias',
      description: 'Confirme as categorias que vão receber seus limites mensais.',
      actionLabel: 'Revisar categorias',
      actionTarget: '/orcamento',
      completed: hasActiveCategories.value
    },
    {
      id: 'expenses',
      title: 'Registrar primeira despesa',
      description: 'Adicione um gasto para iniciar o acompanhamento do mês.',
      actionLabel: 'Registrar despesa',
      actionTarget: '/despesas',
      completed: hasExpenses.value
    },
    {
      id: 'balance',
      title: 'Atualizar balanço patrimonial',
      description: 'Cadastre ativos e dívidas para calcular seu patrimônio líquido.',
      actionLabel: 'Atualizar balanço',
      actionTarget: '/balanco',
      completed: hasBalanceItems.value
    },
    {
      id: 'visuals',
      title: 'Personalizar cores das categorias',
      description: 'Escolha cores para reconhecer categorias nas badges e listas.',
      actionLabel: 'Personalizar cores',
      actionTarget: '/configuracoes',
      completed: hasCategoryVisuals.value
    }
  ])

  const completedCount = computed(() => items.value.filter((item) => item.completed).length)
  const totalCount = computed(() => items.value.length)
  const isComplete = computed(() => completedCount.value === totalCount.value)
  const nextItem = computed(() => items.value.find((item) => !item.completed) ?? null)
  const shouldShowChecklist = computed(() => activeChecklistMonth.value === currentMonthKey())
  const progressWidth = computed(() => {
    if (!totalCount.value) return '0%'
    return `${Math.round((completedCount.value / totalCount.value) * 100)}%`
  })

  async function loadSetupChecklist(month: MonthKey) {
    activeChecklistMonth.value = month
    loading.value = true
    try {
      categoryVisuals.value = (await readVisualPreferences()).categoryVisuals ?? {}
      await budgetStore.loadMonth(month)
      await expensesStore.loadForBudget(budgetStore.budget?.id ?? null, budgetStore.draftMonth)
      await balanceStore.loadMonth(month)
      await balanceStore.loadHistory()
    } finally {
      loading.value = false
    }
  }

  function resetSetupChecklist() {
    categoryVisuals.value = {}
    loading.value = false
    activeChecklistMonth.value = currentMonthKey()
  }

  return {
    items,
    completedCount,
    totalCount,
    isComplete,
    nextItem,
    shouldShowChecklist,
    progressWidth,
    loading,
    loadSetupChecklist,
    resetSetupChecklist
  }
}

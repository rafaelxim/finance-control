<script setup lang="ts">
import { computed, ref } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import type { BudgetCategory } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import { formatBRL, toDecimal } from '@/domain/shared/money'

const props = defineProps<{
  expenses: Expense[]
  categories: BudgetCategory[]
}>()

defineEmits<{
  edit: [expense: Expense]
  delete: [expenseId: string]
}>()

function categoryName(categoryId: string) {
  return (
    props.categories.find((category) => category.id === categoryId)?.name ?? 'Categoria removida'
  )
}

const categoryFilter = ref('all')
const sortMode = ref('date-desc')

const categoryOptions = computed(() => {
  const options = props.categories
    .filter((category) => props.expenses.some((expense) => expense.categoryId === category.id))
    .map((category) => ({ value: category.id, label: category.name }))

  const hasRemovedCategories = props.expenses.some(
    (expense) => !props.categories.some((category) => category.id === expense.categoryId)
  )

  if (hasRemovedCategories) {
    options.push({ value: 'removed', label: 'Categoria removida' })
  }

  return [{ value: 'all', label: 'Todas as categorias' }, ...options]
})

const sortOptions = [
  { value: 'date-desc', label: 'Data: mais recentes' },
  { value: 'date-asc', label: 'Data: mais antigas' },
  { value: 'amount-desc', label: 'Valor: maior primeiro' },
  { value: 'amount-asc', label: 'Valor: menor primeiro' }
]

const visibleExpenses = computed(() => {
  const filtered = props.expenses.filter((expense) => {
    if (categoryFilter.value === 'all') return true
    if (categoryFilter.value === 'removed') {
      return !props.categories.some((category) => category.id === expense.categoryId)
    }
    return expense.categoryId === categoryFilter.value
  })

  return [...filtered].sort((left, right) => {
    if (sortMode.value === 'date-asc') return left.date.localeCompare(right.date)
    if (sortMode.value === 'amount-desc') return toDecimal(right.amount).cmp(toDecimal(left.amount))
    if (sortMode.value === 'amount-asc') return toDecimal(left.amount).cmp(toDecimal(right.amount))
    return right.date.localeCompare(left.date)
  })
})

const visibleCountLabel = computed(() => {
  if (visibleExpenses.value.length === props.expenses.length) {
    return `${props.expenses.length} registro${props.expenses.length === 1 ? '' : 's'}`
  }

  return `${visibleExpenses.value.length} de ${props.expenses.length} registros`
})
</script>

<template>
  <section class="expense-list panel" aria-label="Lista de despesas">
    <header class="expense-list__header">
      <h2>Despesas do mês</h2>
      <span>{{ visibleCountLabel }}</span>
    </header>

    <div v-if="expenses.length" class="expense-list__filters" aria-label="Filtros de despesas">
      <BaseSelect
        id="expense-category-filter"
        v-model="categoryFilter"
        label="Categoria"
        :options="categoryOptions"
      />
      <BaseSelect id="expense-sort" v-model="sortMode" label="Ordenar por" :options="sortOptions" />
    </div>

    <p v-if="expenses.length && !visibleExpenses.length" class="expense-list__empty" role="status">
      Nenhuma despesa encontrada para os filtros selecionados.
    </p>

    <ul v-if="visibleExpenses.length" class="expense-list__items">
      <li v-for="expense in visibleExpenses" :key="expense.id" class="expense-list__item">
        <div>
          <strong>{{ categoryName(expense.categoryId) }}</strong>
          <span>{{ expense.description || 'Sem descrição' }}</span>
        </div>
        <time :datetime="expense.date">{{ expense.date }}</time>
        <b>{{ formatBRL(expense.amount) }}</b>
        <div class="expense-list__actions">
          <BaseButton variant="secondary" @click="$emit('edit', expense)">Editar</BaseButton>
          <BaseButton variant="ghost" @click="$emit('delete', expense.id)">Excluir</BaseButton>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.expense-list {
  display: grid;
  gap: 12px;
}

.expense-list__header,
.expense-list__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 14px;
}

.expense-list__header h2 {
  margin: 0;
  font-size: 1rem;
}

.expense-list__filters {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(180px, 1fr);
  gap: 12px;
}

.expense-list__header span,
.expense-list__item span,
.expense-list__item time {
  color: var(--color-muted);
  font-size: 0.86rem;
}

.expense-list__items {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.expense-list__item {
  border-top: 1px solid var(--color-border);
  padding-top: 10px;
}

.expense-list__item div:first-child {
  display: grid;
  gap: 2px;
}

.expense-list__item b {
  color: var(--color-text);
  font-family: var(--font-number);
  font-variant-numeric: tabular-nums;
}

.expense-list__actions {
  display: flex;
  gap: 8px;
}

.expense-list__empty {
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  margin: 0;
  padding-top: 12px;
}

@media (max-width: 760px) {
  .expense-list__header,
  .expense-list__item {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .expense-list__actions {
    flex-wrap: wrap;
  }

  .expense-list__filters {
    grid-template-columns: 1fr;
  }
}
</style>

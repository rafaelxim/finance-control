<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { BudgetCategory } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import { formatBRL } from '@/domain/shared/money'

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
</script>

<template>
  <section class="expense-list panel" aria-label="Lista de despesas">
    <header class="expense-list__header">
      <h2>Despesas do mês</h2>
      <span>{{ expenses.length }} registro{{ expenses.length === 1 ? '' : 's' }}</span>
    </header>

    <ul v-if="expenses.length" class="expense-list__items">
      <li v-for="expense in expenses" :key="expense.id" class="expense-list__item">
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

@media (max-width: 760px) {
  .expense-list__header,
  .expense-list__item {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .expense-list__actions {
    flex-wrap: wrap;
  }
}
</style>

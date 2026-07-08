<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next'
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

const emit = defineEmits<{
  edit: [expense: Expense]
  delete: [expenseId: string]
}>()

function categoryName(categoryId: string) {
  return (
    props.categories.find((category) => category.id === categoryId)?.name ?? 'Categoria removida'
  )
}

function formatExpenseDate(date: string) {
  const [year, month, day] = date.split('-')
  if (!year || !month || !day) return date
  return `${day}/${month}/${year}`
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

const visibleTotal = computed(() =>
  formatBRL(
    visibleExpenses.value.reduce(
      (total, expense) => total.plus(toDecimal(expense.amount)),
      toDecimal(0)
    )
  )
)

function requestDelete(expense: Expense) {
  const description = expense.description?.trim() || 'esta despesa'
  if (!window.confirm(`Excluir ${description}?`)) return
  emit('delete', expense.id)
}
</script>

<template>
  <section class="expense-list panel" aria-label="Lista de despesas">
    <header class="expense-list__header">
      <div>
        <h2>Despesas do mês</h2>
        <p>{{ visibleTotal }} em despesas</p>
      </div>
      <span class="expense-list__count">
        <span aria-hidden="true"></span>
        {{ visibleCountLabel }}
      </span>
    </header>

    <div v-if="expenses.length" class="expense-list__filters" aria-label="Filtros de despesas">
      <BaseSelect
        id="expense-category-filter"
        v-model="categoryFilter"
        label="Categoria"
        :options="categoryOptions"
      />
      <BaseSelect id="expense-sort" v-model="sortMode" label="Ordenar" :options="sortOptions" />
    </div>

    <p v-if="expenses.length && !visibleExpenses.length" class="expense-list__empty" role="status">
      Nenhuma despesa encontrada para os filtros selecionados.
    </p>

    <div v-if="visibleExpenses.length" class="expense-list__table-wrap">
      <table class="expense-list__table">
        <thead>
          <tr>
            <th scope="col">Categoria / Descrição</th>
            <th scope="col">Data</th>
            <th scope="col">Valor</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in visibleExpenses" :key="expense.id">
            <td>
              <div class="expense-list__description-cell">
                <span class="expense-list__dot" aria-hidden="true"></span>
                <div class="expense-list__description-stack">
                  <span class="expense-list__description">
                    {{ expense.description || 'Sem descrição' }}
                  </span>
                  <span class="expense-list__category">{{ categoryName(expense.categoryId) }}</span>
                </div>
              </div>
            </td>
            <td>
              <time :datetime="expense.date">{{ formatExpenseDate(expense.date) }}</time>
            </td>
            <td>
              <b>{{ formatBRL(expense.amount) }}</b>
            </td>
            <td>
              <div class="expense-list__actions">
                <BaseButton
                  class="expense-list__action"
                  variant="secondary"
                  aria-label="Editar despesa"
                  title="Editar despesa"
                  @click="emit('edit', expense)"
                >
                  <Pencil :size="17" aria-hidden="true" />
                </BaseButton>
                <BaseButton
                  class="expense-list__action"
                  variant="ghost"
                  aria-label="Excluir despesa"
                  title="Excluir despesa"
                  @click="requestDelete(expense)"
                >
                  <Trash2 :size="17" aria-hidden="true" />
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.expense-list {
  display: grid;
  overflow: hidden;
  gap: 0;
  padding: 0;
}

.expense-list__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 34px 40px 30px;
}

.expense-list__header h2 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(1.7rem, 2.6vw, 2.45rem);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.05;
}

.expense-list__header p {
  margin: 12px 0 0;
  color: var(--color-muted);
  font-size: 1rem;
}

.expense-list__count {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 9px;
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface-muted) 42%, transparent);
  color: var(--color-muted);
  font-size: 0.95rem;
  padding: 8px 16px;
}

.expense-list__count span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 72%, transparent);
}

.expense-list__filters {
  display: grid;
  grid-template-columns: minmax(220px, 392px) minmax(220px, 382px);
  gap: 24px;
  border-top: 1px solid var(--color-border);
  padding: 28px 40px 32px;
}

.expense-list__filters :deep(.field__label) {
  color: var(--color-muted);
  font-size: 0.92rem;
}

.expense-list__filters :deep(.input) {
  min-height: 56px;
  border-color: color-mix(in srgb, var(--color-muted) 32%, var(--color-border));
  background: color-mix(in srgb, var(--color-bg) 58%, var(--color-surface));
  color: var(--color-text);
  font-size: 1rem;
  padding-inline: 18px;
}

.expense-list__filters :deep(.input:hover),
.expense-list__filters :deep(.input:focus) {
  border-color: color-mix(in srgb, var(--color-primary) 70%, var(--color-border));
}

.expense-list__table-wrap {
  overflow-x: auto;
  border-top: 1px solid var(--color-border);
}

.expense-list__table {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  table-layout: fixed;
}

.expense-list__table th {
  height: 58px;
  background: color-mix(in srgb, var(--color-surface-muted) 28%, transparent);
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 0 24px;
  text-align: left;
  text-transform: uppercase;
}

.expense-list__table th:nth-child(1) {
  width: 40%;
  padding-left: 40px;
}

.expense-list__table th:nth-child(2) {
  width: 18%;
}

.expense-list__table th:nth-child(3) {
  width: 17%;
  text-align: right;
}

.expense-list__table th:nth-child(4) {
  width: 25%;
}

.expense-list__table td {
  height: 86px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 18px 24px;
  vertical-align: middle;
}

.expense-list__table tbody tr:first-child td {
  border-top: 0;
}

.expense-list__table td:first-child {
  padding-left: 40px;
}

.expense-list__table td:nth-child(3) {
  text-align: right;
}

.expense-list__table th:nth-child(4),
.expense-list__table td:nth-child(4) {
  padding-right: 40px;
}

.expense-list__description-cell {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.expense-list__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 70%, transparent);
}

.expense-list__description-stack {
  display: grid;
  min-width: 0;
  gap: 7px;
  justify-items: start;
}

.expense-list__category {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  max-width: 210px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: color-mix(in srgb, var(--color-surface-muted) 42%, transparent);
  color: var(--color-primary);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.075em;
  line-height: 1;
  padding: 5px 8px;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.expense-list__description {
  min-width: 0;
  overflow: hidden;
  color: var(--color-text);
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expense-list__table time {
  color: color-mix(in srgb, var(--color-text) 74%, var(--color-muted));
  font-family: var(--font-number);
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
}

.expense-list__table b {
  color: var(--color-text);
  font-family: var(--font-number);
  font-size: 1rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.expense-list__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  white-space: nowrap;
}

.expense-list__action {
  display: inline-grid;
  width: 36px;
  min-height: 36px;
  place-items: center;
  border-color: var(--color-border);
  color: var(--color-muted);
  padding: 0;
}

.expense-list__action svg {
  flex: 0 0 auto;
}

.expense-list__empty {
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  margin: 0;
  padding: 24px 40px;
}

@media (max-width: 760px) {
  .expense-list__header {
    align-items: flex-start;
    flex-direction: column;
    padding: 24px;
  }

  .expense-list__filters {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 20px 24px 24px;
  }

  .expense-list__table {
    min-width: 0;
  }

  .expense-list__table thead {
    display: none;
  }

  .expense-list__table,
  .expense-list__table tbody,
  .expense-list__table tr,
  .expense-list__table td {
    display: block;
    width: 100%;
  }

  .expense-list__table tr {
    border-top: 1px solid var(--color-border);
    padding: 18px 24px;
  }

  .expense-list__table tbody tr:first-child {
    border-top: 0;
  }

  .expense-list__table td,
  .expense-list__table td:first-child,
  .expense-list__table td:nth-child(3) {
    height: auto;
    border-top: 0;
    padding: 0;
    text-align: left;
  }

  .expense-list__table td + td {
    margin-top: 12px;
  }

  .expense-list__description-cell {
    grid-template-columns: 10px minmax(0, 1fr);
  }

  .expense-list__description {
    white-space: normal;
  }

  .expense-list__actions {
    flex-wrap: wrap;
  }
}
</style>

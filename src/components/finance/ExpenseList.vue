<script setup lang="ts">
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import type { BudgetCategory } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import { formatBRL, toDecimal } from '@/domain/shared/money'

const props = defineProps<{
  expenses: Expense[]
  categories: BudgetCategory[]
  categoryFilter?: string
  categoryVisuals?: Record<string, string>
}>()

const emit = defineEmits<{
  create: []
  edit: [expense: Expense]
  delete: [expenseId: string]
}>()

function categoryName(categoryId: string) {
  return (
    props.categories.find((category) => category.id === categoryId)?.name ?? 'Categoria removida'
  )
}

const defaultCategoryColor = '#fcd535'
const hexColorPattern = /^#[0-9a-f]{6}$/i

function categoryColor(categoryId: string) {
  const value = props.categoryVisuals?.[categoryId]
  return value && hexColorPattern.test(value) ? value : defaultCategoryColor
}

function formatExpenseDate(date: string) {
  const [year, month, day] = date.split('-')
  if (!year || !month || !day) return date
  return `${day}/${month}/${year}`
}

const selectedCategoryFilter = ref('all')
type SortKey = 'description' | 'date' | 'amount'
type SortDirection = 'asc' | 'desc'

const sortKey = ref<SortKey>('date')
const sortDirection = ref<SortDirection>('desc')

const categoryOptions = computed(() => {
  const options = props.categories.map((category) => ({ value: category.id, label: category.name }))

  const hasRemovedCategories = props.expenses.some(
    (expense) => !props.categories.some((category) => category.id === expense.categoryId)
  )

  if (hasRemovedCategories) {
    options.push({ value: 'removed', label: 'Categoria removida' })
  }

  return [{ value: 'all', label: 'Todas as categorias' }, ...options]
})

const visibleExpenses = computed(() => {
  const filtered = props.expenses.filter((expense) => {
    if (selectedCategoryFilter.value === 'all') return true
    if (selectedCategoryFilter.value === 'removed') {
      return !props.categories.some((category) => category.id === expense.categoryId)
    }
    return expense.categoryId === selectedCategoryFilter.value
  })

  return [...filtered].sort((left, right) => {
    let comparison = 0

    if (sortKey.value === 'description') {
      comparison = `${categoryName(left.categoryId)} ${left.description}`.localeCompare(
        `${categoryName(right.categoryId)} ${right.description}`,
        'pt-BR',
        { sensitivity: 'base' }
      )
    } else if (sortKey.value === 'amount') {
      comparison = toDecimal(left.amount).cmp(toDecimal(right.amount))
    } else {
      comparison = left.date.localeCompare(right.date)
    }

    return sortDirection.value === 'asc' ? comparison : comparison * -1
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

function sortBy(key: SortKey) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortKey.value = key
  sortDirection.value = 'asc'
}

function ariaSort(key: SortKey) {
  if (sortKey.value !== key) return 'none'
  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}

watch(
  () => props.categoryFilter,
  (value) => {
    selectedCategoryFilter.value = value || 'all'
  },
  { immediate: true }
)
</script>

<template>
  <section class="expense-list panel" aria-label="Lista de despesas">
    <header class="expense-list__header">
      <div>
        <h2>Despesas do mês</h2>
        <p>{{ visibleTotal }} em despesas</p>
      </div>
      <div class="expense-list__header-actions">
        <BaseButton class="expense-list__create" @click="emit('create')">
          <Plus :size="18" aria-hidden="true" />
          Registrar despesa
        </BaseButton>
        <span class="expense-list__count">
          <span aria-hidden="true"></span>
          {{ visibleCountLabel }}
        </span>
      </div>
    </header>

    <div v-if="expenses.length" class="expense-list__filters" aria-label="Filtros de despesas">
      <BaseSelect
        id="expense-category-filter"
        v-model="selectedCategoryFilter"
        label="Categoria"
        :options="categoryOptions"
      />
    </div>

    <p v-if="expenses.length && !visibleExpenses.length" class="expense-list__empty" role="status">
      Nenhuma despesa encontrada para os filtros selecionados.
    </p>

    <div
      v-if="visibleExpenses.length"
      class="expense-list__mobile-sort"
      aria-label="Ordenar despesas"
    >
      <button type="button" :aria-sort="ariaSort('description')" @click="sortBy('description')">
        Item
        <ArrowUp
          v-if="sortKey === 'description' && sortDirection === 'asc'"
          :size="14"
          aria-hidden="true"
        />
        <ArrowDown v-else-if="sortKey === 'description'" :size="14" aria-hidden="true" />
      </button>
      <button type="button" :aria-sort="ariaSort('date')" @click="sortBy('date')">
        Data
        <ArrowUp
          v-if="sortKey === 'date' && sortDirection === 'asc'"
          :size="14"
          aria-hidden="true"
        />
        <ArrowDown v-else-if="sortKey === 'date'" :size="14" aria-hidden="true" />
      </button>
      <button type="button" :aria-sort="ariaSort('amount')" @click="sortBy('amount')">
        Valor
        <ArrowUp
          v-if="sortKey === 'amount' && sortDirection === 'asc'"
          :size="14"
          aria-hidden="true"
        />
        <ArrowDown v-else-if="sortKey === 'amount'" :size="14" aria-hidden="true" />
      </button>
    </div>

    <div v-if="!expenses.length" class="expense-list__empty-state">
      <strong>Nenhuma despesa registrada</strong>
      <span>Registre o primeiro gasto para acompanhar o progresso do mês.</span>
    </div>

    <div v-if="visibleExpenses.length" class="expense-list__table-wrap">
      <table class="expense-list__table">
        <thead>
          <tr>
            <th scope="col" :aria-sort="ariaSort('description')">
              <button class="expense-list__sort" type="button" @click="sortBy('description')">
                Categoria / Descrição
                <ArrowUp
                  v-if="sortKey === 'description' && sortDirection === 'asc'"
                  :size="14"
                  aria-hidden="true"
                />
                <ArrowDown v-else-if="sortKey === 'description'" :size="14" aria-hidden="true" />
              </button>
            </th>
            <th scope="col" :aria-sort="ariaSort('date')">
              <button class="expense-list__sort" type="button" @click="sortBy('date')">
                Data
                <ArrowUp
                  v-if="sortKey === 'date' && sortDirection === 'asc'"
                  :size="14"
                  aria-hidden="true"
                />
                <ArrowDown v-else-if="sortKey === 'date'" :size="14" aria-hidden="true" />
              </button>
            </th>
            <th scope="col" :aria-sort="ariaSort('amount')">
              <button
                class="expense-list__sort expense-list__sort--right"
                type="button"
                @click="sortBy('amount')"
              >
                Valor
                <ArrowUp
                  v-if="sortKey === 'amount' && sortDirection === 'asc'"
                  :size="14"
                  aria-hidden="true"
                />
                <ArrowDown v-else-if="sortKey === 'amount'" :size="14" aria-hidden="true" />
              </button>
            </th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="expense in visibleExpenses"
            :key="expense.id"
            :style="{ '--expense-category-color': categoryColor(expense.categoryId) }"
          >
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

.expense-list__header-actions {
  display: grid;
  flex: 0 0 auto;
  justify-items: end;
  gap: 10px;
}

.expense-list__create {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.expense-list__empty-state {
  display: grid;
  justify-items: center;
  gap: 8px;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  padding: 56px 32px;
  text-align: center;
}

.expense-list__empty-state strong {
  color: var(--color-text);
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
  grid-template-columns: minmax(220px, 392px);
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
  background-color: color-mix(in srgb, var(--color-bg) 58%, var(--color-surface));
  color: var(--color-text);
  font-size: 1rem;
  padding-inline: 18px;
}

.expense-list__filters :deep(select.input) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23929aa5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 18px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 48px;
}

.expense-list__filters :deep(.input:hover),
.expense-list__filters :deep(.input:focus) {
  border-color: color-mix(in srgb, var(--color-primary) 70%, var(--color-border));
}

.expense-list__table-wrap {
  overflow-x: auto;
  border-top: 1px solid var(--color-border);
}

.expense-list__mobile-sort {
  display: none;
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

.expense-list__sort {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  letter-spacing: inherit;
  padding: 0;
  text-transform: inherit;
}

.expense-list__sort:hover,
.expense-list__sort:focus-visible {
  color: var(--color-primary);
  outline: none;
}

.expense-list__sort--right {
  justify-content: flex-end;
  width: 100%;
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
  text-align: right;
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
  background: var(--expense-category-color, var(--color-primary));
  box-shadow: 0 0 12px
    color-mix(in srgb, var(--expense-category-color, var(--color-primary)) 70%, transparent);
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
  border: 1px solid
    color-mix(in srgb, var(--expense-category-color, var(--color-primary)) 62%, transparent);
  border-radius: 4px;
  background: color-mix(
    in srgb,
    var(--expense-category-color, var(--color-primary)) 12%,
    transparent
  );
  color: var(--expense-category-color, var(--color-primary));
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
  .expense-list {
    border-radius: 8px;
  }

  .expense-list__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
    padding: 18px 16px 16px;
  }

  .expense-list__header h2 {
    font-size: 1.28rem;
    line-height: 1.1;
  }

  .expense-list__header p {
    margin-top: 6px;
    font-size: 0.86rem;
  }

  .expense-list__header-actions {
    width: 100%;
    grid-template-columns: 1fr auto;
    align-items: center;
    justify-items: stretch;
    gap: 10px;
  }

  .expense-list__create {
    min-height: 40px;
    padding-inline: 12px;
  }

  .expense-list__count {
    min-height: 36px;
    gap: 7px;
    font-size: 0.76rem;
    padding: 7px 10px;
    white-space: nowrap;
  }

  .expense-list__count span {
    width: 7px;
    height: 7px;
  }

  .expense-list__filters {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 14px 16px 16px;
  }

  .expense-list__filters :deep(.field) {
    gap: 5px;
  }

  .expense-list__filters :deep(.field__label) {
    font-size: 0.76rem;
  }

  .expense-list__filters :deep(.input) {
    min-height: 42px;
    border-radius: 8px;
    font-size: 0.86rem;
    padding-inline: 12px;
  }

  .expense-list__filters :deep(select.input) {
    background-position: right 14px center;
    padding-right: 42px;
  }

  .expense-list__mobile-sort {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    border-top: 1px solid var(--color-border);
    padding: 12px 16px;
  }

  .expense-list__mobile-sort button {
    display: inline-flex;
    min-width: 0;
    min-height: 34px;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: color-mix(in srgb, var(--color-surface-muted) 34%, transparent);
    color: var(--color-muted);
    cursor: pointer;
    font: inherit;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0;
    padding: 7px 8px;
  }

  .expense-list__mobile-sort button[aria-sort='ascending'],
  .expense-list__mobile-sort button[aria-sort='descending'] {
    border-color: color-mix(in srgb, var(--color-primary) 58%, var(--color-border));
    background: color-mix(in srgb, var(--color-primary) 13%, var(--color-surface));
    color: var(--color-primary);
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
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: 12px;
    row-gap: 8px;
    align-items: center;
    border-top: 1px solid var(--color-border);
    padding: 13px 16px;
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
    margin-top: 0;
  }

  .expense-list__table td:nth-child(1) {
    grid-column: 1;
    grid-row: 1;
  }

  .expense-list__table td:nth-child(2) {
    grid-column: 1;
    grid-row: 2;
  }

  .expense-list__table td:nth-child(3) {
    grid-column: 2;
    grid-row: 1;
    align-self: start;
    justify-self: end;
    width: auto;
    padding-top: 1px;
    text-align: right;
  }

  .expense-list__table td:nth-child(4) {
    grid-column: 2;
    grid-row: 2;
    align-self: end;
    justify-self: end;
    width: auto;
    padding-right: 0;
  }

  .expense-list__description-cell {
    grid-template-columns: 8px minmax(0, 1fr);
    gap: 10px;
  }

  .expense-list__dot {
    width: 8px;
    height: 8px;
  }

  .expense-list__description {
    font-size: 0.9rem;
    line-height: 1.2;
    white-space: normal;
  }

  .expense-list__description-stack {
    gap: 5px;
  }

  .expense-list__category {
    min-height: 18px;
    max-width: 160px;
    border-radius: 4px;
    font-size: 0.56rem;
    letter-spacing: 0.04em;
    padding: 4px 6px;
  }

  .expense-list__table time {
    color: var(--color-muted);
    font-size: 0.78rem;
  }

  .expense-list__table b {
    color: var(--color-primary);
    font-size: 0.9rem;
    line-height: 1.15;
    white-space: nowrap;
  }

  .expense-list__actions {
    flex-wrap: nowrap;
    gap: 6px;
    justify-content: flex-end;
    justify-self: end;
    width: max-content;
    margin-left: auto;
  }

  .expense-list__action {
    width: 32px;
    min-height: 32px;
    border-radius: 8px;
  }

  .expense-list__actions .expense-list__action:last-child {
    color: var(--color-danger);
  }

  .expense-list__empty {
    padding: 18px 16px;
  }
}
</style>

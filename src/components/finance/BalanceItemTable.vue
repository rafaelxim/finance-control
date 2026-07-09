<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-vue-next'

import BaseButton from '@/components/ui/BaseButton.vue'
import type { BalanceItem } from '@/domain/balance/types'
import { formatBRL, toDecimal } from '@/domain/shared/money'

const props = defineProps<{
  items: BalanceItem[]
}>()

const emit = defineEmits<{
  edit: [item: BalanceItem]
  remove: [item: BalanceItem]
}>()

const kindLabel = {
  asset: 'Ativo',
  debt: 'Dívida'
}

type SortKey = 'item' | 'kind' | 'amount'
type SortDirection = 'asc' | 'desc'

const sortKey = ref<SortKey>('item')
const sortDirection = ref<SortDirection>('asc')

const sortedItems = computed(() => {
  return [...props.items].sort((left, right) => {
    let comparison = 0

    if (sortKey.value === 'item') {
      comparison = left.name.localeCompare(right.name, 'pt-BR', { sensitivity: 'base' })
    } else if (sortKey.value === 'kind') {
      comparison = kindLabel[left.kind].localeCompare(kindLabel[right.kind], 'pt-BR')
    } else {
      comparison = toDecimal(left.amount).cmp(toDecimal(right.amount))
    }

    return sortDirection.value === 'asc' ? comparison : comparison * -1
  })
})

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
</script>

<template>
  <section class="balance-table panel" aria-label="Itens salvos do balanço">
    <header>
      <h2>Itens salvos</h2>
      <span>{{ items.length }} item{{ items.length === 1 ? '' : 's' }}</span>
    </header>

    <div class="balance-table__wrap">
      <table>
        <thead>
          <tr>
            <th scope="col" :aria-sort="ariaSort('item')">
              <button class="balance-table__sort" type="button" @click="sortBy('item')">
                Item
                <ArrowUp
                  v-if="sortKey === 'item' && sortDirection === 'asc'"
                  :size="14"
                  aria-hidden="true"
                />
                <ArrowDown v-else-if="sortKey === 'item'" :size="14" aria-hidden="true" />
              </button>
            </th>
            <th scope="col" :aria-sort="ariaSort('kind')">
              <button class="balance-table__sort" type="button" @click="sortBy('kind')">
                Tipo
                <ArrowUp
                  v-if="sortKey === 'kind' && sortDirection === 'asc'"
                  :size="14"
                  aria-hidden="true"
                />
                <ArrowDown v-else-if="sortKey === 'kind'" :size="14" aria-hidden="true" />
              </button>
            </th>
            <th scope="col" :aria-sort="ariaSort('amount')">
              <button
                class="balance-table__sort balance-table__sort--right"
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
          <tr v-for="item in sortedItems" :key="item.id">
            <td>
              <strong>{{ item.name }}</strong>
            </td>
            <td>
              <span class="balance-table__badge" :class="`balance-table__badge--${item.kind}`">
                {{ kindLabel[item.kind] }}
              </span>
            </td>
            <td>
              <b>{{ formatBRL(item.amount) }}</b>
            </td>
            <td>
              <div class="balance-table__actions">
                <BaseButton
                  class="balance-table__action"
                  variant="secondary"
                  aria-label="Editar item"
                  title="Editar item"
                  @click="emit('edit', item)"
                >
                  <Pencil :size="17" aria-hidden="true" />
                </BaseButton>
                <BaseButton
                  class="balance-table__action balance-table__action--danger"
                  variant="ghost"
                  aria-label="Remover item"
                  title="Remover item"
                  @click="emit('remove', item)"
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
.balance-table {
  display: grid;
  width: 100%;
  gap: 12px;
}

.balance-table header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.balance-table h2 {
  margin: 0;
}

.balance-table h2 {
  font-size: 1rem;
}

.balance-table__wrap {
  width: 100%;
  overflow-x: auto;
}

.balance-table table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
}

.balance-table th,
.balance-table td {
  border-top: 1px solid var(--color-border);
  padding: 12px 10px;
  text-align: left;
  vertical-align: middle;
}

.balance-table th {
  color: var(--color-muted);
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
}

.balance-table__sort {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  letter-spacing: 0;
  padding: 0;
  text-transform: inherit;
}

.balance-table__sort:hover,
.balance-table__sort:focus-visible {
  color: var(--color-primary);
  outline: none;
}

.balance-table__sort--right {
  justify-content: flex-end;
  width: 100%;
}

.balance-table th:nth-child(3),
.balance-table td:nth-child(3) {
  text-align: right;
}

.balance-table th:last-child,
.balance-table td:last-child {
  width: 112px;
  text-align: right;
}

.balance-table span {
  color: var(--color-muted);
  font-size: 0.88rem;
}

.balance-table b {
  font-family: var(--font-number);
  font-variant-numeric: tabular-nums;
}

.balance-table__badge {
  display: inline-flex;
  min-width: 68px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1;
  padding: 6px 9px;
}

.balance-table__badge--asset {
  border-color: rgba(14, 203, 129, 0.28);
  background: rgba(14, 203, 129, 0.08);
  color: var(--color-up);
}

.balance-table__badge--debt {
  border-color: rgba(246, 70, 93, 0.28);
  background: rgba(246, 70, 93, 0.08);
  color: var(--color-danger);
}

.balance-table__actions {
  display: inline-flex;
  justify-content: flex-end;
  gap: 8px;
}

.balance-table__action {
  width: 38px;
  min-height: 38px;
  padding: 0;
}

.balance-table__action--danger {
  color: var(--color-danger);
}

.balance-table__action--danger:hover,
.balance-table__action--danger:focus-visible {
  border-color: rgba(246, 70, 93, 0.42);
  background: rgba(246, 70, 93, 0.08);
  color: var(--color-danger);
}

@media (max-width: 680px) {
  .balance-table {
    padding: 14px;
  }
}
</style>

<script setup lang="ts">
import type { BalanceItem } from '@/domain/balance/types'
import { formatBRL } from '@/domain/shared/money'

defineProps<{
  items: BalanceItem[]
}>()

const kindLabel = {
  asset: 'Ativo',
  debt: 'Dívida'
}
</script>

<template>
  <section class="balance-table panel" aria-label="Itens salvos do balanço">
    <header>
      <h2>Itens salvos</h2>
      <span>{{ items.length }} item{{ items.length === 1 ? '' : 's' }}</span>
    </header>

    <ul>
      <li v-for="item in items" :key="item.id">
        <strong>{{ item.name }}</strong>
        <span>{{ kindLabel[item.kind] }}</span>
        <b>{{ formatBRL(item.amount) }}</b>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.balance-table {
  display: grid;
  gap: 12px;
}

.balance-table header,
.balance-table li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 14px;
}

.balance-table h2,
.balance-table ul {
  margin: 0;
}

.balance-table h2 {
  font-size: 1rem;
}

.balance-table ul {
  display: grid;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.balance-table li {
  border-top: 1px solid var(--color-border);
  padding-top: 10px;
}

.balance-table span {
  color: var(--color-muted);
  font-size: 0.88rem;
}

.balance-table b {
  font-family: var(--font-number);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 680px) {
  .balance-table header,
  .balance-table li {
    grid-template-columns: 1fr;
  }
}
</style>

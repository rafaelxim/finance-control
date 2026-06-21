<script setup lang="ts">
import { formatBRL } from '@/domain/shared/money'

defineProps<{
  availableAmount: string
  allocated: string
  unallocated: string
  overAllocated: string
}>()
</script>

<template>
  <section class="budget-summary panel" aria-label="Resumo do orçamento">
    <div>
      <span>Disponível</span>
      <strong>{{ formatBRL(availableAmount) }}</strong>
    </div>
    <div>
      <span>Alocado</span>
      <strong>{{ formatBRL(allocated) }}</strong>
    </div>
    <div>
      <span>Não alocado</span>
      <strong>{{ formatBRL(unallocated) }}</strong>
    </div>
    <div :class="{ danger: overAllocated !== '0.00' }">
      <span>Excedente</span>
      <strong>{{ formatBRL(overAllocated) }}</strong>
    </div>
  </section>
</template>

<style scoped>
.budget-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
}

.budget-summary div {
  display: grid;
  gap: 4px;
}

.budget-summary span {
  color: var(--color-muted);
  font-size: 0.9rem;
}

.budget-summary strong {
  font-size: 1.25rem;
}

.danger strong {
  color: var(--color-danger);
}
</style>

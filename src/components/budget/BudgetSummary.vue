<script setup lang="ts">
import { formatBRL } from '@/domain/shared/money'

withDefaults(
  defineProps<{
    availableAmount: string
    allocated: string
    unallocated: string
    overAllocated: string
    title?: string
  }>(),
  {
    title: 'Resumo do orçamento'
  }
)
</script>

<template>
  <section class="budget-summary panel" aria-labelledby="budget-summary-title">
    <h2 id="budget-summary-title" class="panel__heading">{{ title }}</h2>
    <div class="metric-grid">
      <div class="metric positive">
        <span class="metric__label">Disponível</span>
        <strong class="money money--primary">{{ formatBRL(availableAmount) }}</strong>
      </div>
      <div class="metric">
        <span class="metric__label">Alocado</span>
        <strong class="money money--primary">{{ formatBRL(allocated) }}</strong>
      </div>
      <div class="metric positive">
        <span class="metric__label">Não alocado</span>
        <strong class="money money--primary">{{ formatBRL(unallocated) }}</strong>
      </div>
      <div class="metric" :class="{ danger: overAllocated !== '0.00' }">
        <span class="metric__label">Excedente</span>
        <strong class="money money--primary">{{ formatBRL(overAllocated) }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.budget-summary {
  display: grid;
  gap: 16px;
}

.positive strong {
  color: var(--color-up);
}

.danger strong {
  color: var(--color-danger);
}
</style>

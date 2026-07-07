<script setup lang="ts">
import { formatBRL } from '@/domain/shared/money'

withDefaults(
  defineProps<{
    availableAmount: string
    allocated: string
    unallocated: string
    overAllocated: string
    totalSpent?: string
    title?: string
  }>(),
  {
    title: 'Resumo do orçamento'
  }
)
</script>

<template>
  <section
    class="budget-summary panel panel--support panel--budget"
    aria-labelledby="budget-summary-title"
  >
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
      <div v-if="totalSpent !== undefined" class="metric metric--featured metric--spent">
        <span class="metric__label">Total gasto</span>
        <strong class="money money--primary">{{ formatBRL(totalSpent) }}</strong>
      </div>
      <div v-else class="metric metric--featured positive">
        <span class="metric__label">Não alocado</span>
        <strong class="money money--primary">{{ formatBRL(unallocated) }}</strong>
      </div>
      <div
        v-if="totalSpent === undefined"
        class="metric metric--featured"
        :class="{ danger: overAllocated !== '0.00' }"
      >
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

.metric--spent {
  --panel-accent: var(--color-primary);
  grid-column: 1 / -1;
  border-color: color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
  border-left-width: 4px;
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  padding: 10px 12px;
}

.metric--spent strong {
  color: var(--color-primary);
  font-size: 1.28rem;
}
</style>

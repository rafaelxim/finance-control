<script setup lang="ts">
import CurrencyInput from '@/components/ui/CurrencyInput.vue'
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

defineEmits<{
  'update:availableAmount': [value: string]
}>()
</script>

<template>
  <section
    class="budget-summary panel panel--support panel--budget"
    aria-labelledby="budget-summary-title"
  >
    <h2 id="budget-summary-title" class="panel__heading">{{ title }}</h2>
    <div class="metric-grid">
      <CurrencyInput
        id="available-amount"
        class="budget-summary__available"
        :model-value="availableAmount"
        label="Valor mensal disponível"
        @update:model-value="$emit('update:availableAmount', $event)"
      />
      <div class="metric">
        <span class="metric__label">Alocado</span>
        <strong class="money money--primary">{{ formatBRL(allocated) }}</strong>
      </div>
      <div class="metric metric--featured positive">
        <span class="metric__label">Não alocado</span>
        <strong class="money money--primary">{{ formatBRL(unallocated) }}</strong>
      </div>
      <div
        v-if="overAllocated !== '0.00'"
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

.budget-summary .metric-grid {
  grid-template-columns: minmax(240px, 1.2fr) repeat(2, minmax(180px, 1fr));
  align-items: end;
}

.budget-summary__available {
  min-width: 0;
}

.positive strong {
  color: var(--color-up);
}

.danger strong {
  color: var(--color-danger);
}

</style>

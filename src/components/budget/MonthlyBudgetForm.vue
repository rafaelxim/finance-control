<script setup lang="ts">
import type { MonthKey } from '@/domain/shared/types'

import CurrencyInput from '@/components/ui/CurrencyInput.vue'
import MonthPicker from '@/components/ui/MonthPicker.vue'

defineProps<{
  month: MonthKey
  availableAmount: string
}>()

defineEmits<{
  'update:month': [value: MonthKey]
  'update:availableAmount': [value: string]
}>()
</script>

<template>
  <section class="monthly-form panel" aria-label="Dados do orçamento mensal">
    <MonthPicker
      id="budget-month"
      :model-value="month"
      label="Mês"
      @update:model-value="$emit('update:month', $event as MonthKey)"
    />
    <CurrencyInput
      id="available-amount"
      :model-value="availableAmount"
      label="Valor mensal disponível"
      @update:model-value="$emit('update:availableAmount', $event)"
    />
  </section>
</template>

<style scoped>
.monthly-form {
  display: grid;
  grid-template-columns: minmax(160px, 220px) minmax(200px, 1fr);
  align-items: end;
  gap: 14px;
}

@media (max-width: 820px) {
  .monthly-form {
    grid-template-columns: 1fr;
  }
}
</style>

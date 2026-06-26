<script setup lang="ts">
import CurrencyInput from '@/components/ui/CurrencyInput.vue'

defineProps<{
  availableAmount: string
}>()

defineEmits<{
  'update:availableAmount': [value: string]
}>()
</script>

<template>
  <section class="monthly-form panel" aria-label="Dados do orçamento mensal">
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
  grid-template-columns: minmax(200px, 1fr);
  align-items: end;
  gap: 14px;
}

@media (max-width: 820px) {
  .monthly-form {
    grid-template-columns: 1fr;
  }
}
</style>

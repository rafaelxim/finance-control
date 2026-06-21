<script setup lang="ts">
import { toMoneyString } from '@/domain/shared/money'

import BaseInput from './BaseInput.vue'

defineProps<{
  id: string
  label: string
  modelValue: string
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function normalizeCurrencyDraft(value: string) {
  const sanitized = value.replace(/[^\d,.]/g, '')
  const decimalIndex = Math.max(sanitized.lastIndexOf(','), sanitized.lastIndexOf('.'))

  if (decimalIndex === -1) {
    return sanitized.replace(/\D/g, '')
  }

  const integer = sanitized.slice(0, decimalIndex).replace(/\D/g, '')
  const fraction = sanitized
    .slice(decimalIndex + 1)
    .replace(/\D/g, '')
    .slice(0, 2)
  return `${integer || '0'},${fraction}`
}

function formatOnBlur(value: string) {
  try {
    emit('update:modelValue', toMoneyString(value || '0'))
  } catch {
    emit('update:modelValue', '0.00')
  }
}
</script>

<template>
  <BaseInput
    :id="id"
    :model-value="modelValue"
    :label="label"
    :error="error"
    placeholder="0,00"
    input-class="input--number"
    input-mode="decimal"
    @update:model-value="emit('update:modelValue', normalizeCurrencyDraft($event))"
    @blur="formatOnBlur(modelValue)"
  />
</template>

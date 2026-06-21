<script setup lang="ts">
import BaseInput from './BaseInput.vue'

defineProps<{
  id: string
  label: string
  modelValue: string
  error?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
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
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  modelValue: string
  type?: string
  error?: string
  placeholder?: string
  inputClass?: string
  inputMode?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="field" :for="id">
    <span class="field__label">{{ label }}</span>
    <input
      :id="id"
      :class="['input', inputClass]"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :inputmode="inputMode"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" :id="`${id}-error`" class="field__error">{{ error }}</span>
  </label>
</template>

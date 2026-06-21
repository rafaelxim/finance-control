<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'ghost'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false
  }
)
</script>

<template>
  <button class="button" :class="`button--${variant}`" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ errors: string[] }>()
</script>

<template>
  <div v-if="errors.length" class="form-error" role="alert">
    <strong>Revise os campos:</strong>
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { BudgetCategory } from '@/domain/budget/types'

defineProps<{
  categories: BudgetCategory[]
  modelValue: Record<string, string>
}>()

defineEmits<{
  'update:modelValue': [value: Record<string, string>]
}>()

const swatches = ['#fcd535', '#0ecb81', '#f6465d', '#3b82f6']
</script>

<template>
  <section class="visual-selector panel" aria-label="Preferências visuais de categorias">
    <header>
      <h2>Preferências visuais</h2>
      <p>Atribua uma cor local para categorias do orçamento atual.</p>
    </header>

    <div v-if="categories.length" class="visual-selector__list">
      <label v-for="category in categories" :key="category.id" class="visual-selector__item">
        <span>{{ category.name }}</span>
        <select
          class="input"
          :value="modelValue[category.id] ?? swatches[0]"
          @change="
            $emit('update:modelValue', {
              ...modelValue,
              [category.id]: ($event.target as HTMLSelectElement).value
            })
          "
        >
          <option v-for="swatch in swatches" :key="swatch" :value="swatch">{{ swatch }}</option>
        </select>
      </label>
    </div>
  </section>
</template>

<style scoped>
.visual-selector {
  display: grid;
  gap: 14px;
}

.visual-selector h2,
.visual-selector p {
  margin: 0;
}

.visual-selector header p {
  color: var(--color-muted);
}

.visual-selector__list {
  display: grid;
  gap: 10px;
}

.visual-selector__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  align-items: center;
  gap: 12px;
}

@media (max-width: 640px) {
  .visual-selector__item {
    grid-template-columns: 1fr;
  }
}
</style>

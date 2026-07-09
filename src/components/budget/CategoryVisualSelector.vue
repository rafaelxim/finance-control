<script setup lang="ts">
import type { BudgetCategory } from '@/domain/budget/types'

const props = defineProps<{
  categories: BudgetCategory[]
  modelValue: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>]
}>()

const defaultColor = '#fcd535'
const hexColorPattern = /^#[0-9a-f]{6}$/i

function colorFor(categoryId: string) {
  const value = props.modelValue[categoryId]
  return value && hexColorPattern.test(value) ? value : defaultColor
}

function updateCategoryColor(categoryId: string, color: string) {
  emit('update:modelValue', {
    ...props.modelValue,
    [categoryId]: color
  })
}
</script>

<template>
  <section class="visual-selector panel" aria-label="Preferências visuais de categorias">
    <header>
      <h2>Preferências visuais</h2>
      <p>Atribua uma cor local para categorias do orçamento atual.</p>
    </header>

    <div v-if="categories.length" class="visual-selector__list">
      <label v-for="category in categories" :key="category.id" class="visual-selector__item">
        <span class="visual-selector__identity">
          <span :id="`visual-category-${category.id}`" class="visual-selector__name">
            {{ category.name }}
          </span>
          <span
            class="visual-selector__badge"
            :style="{ '--category-color': colorFor(category.id) }"
          >
            Preview
          </span>
        </span>

        <input
          :id="`visual-category-color-${category.id}`"
          class="visual-selector__picker"
          type="color"
          :aria-labelledby="`visual-category-${category.id}`"
          :value="colorFor(category.id)"
          @input="updateCategoryColor(category.id, ($event.target as HTMLInputElement).value)"
        />
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
  grid-template-columns: minmax(0, 1fr) 56px;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--color-border);
  padding-top: 10px;
}

.visual-selector__identity {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.visual-selector__name {
  min-width: 0;
  overflow: hidden;
  color: var(--color-text);
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visual-selector__badge {
  display: inline-flex;
  flex: 0 0 auto;
  min-height: 28px;
  align-items: center;
  border: 1px solid color-mix(in srgb, var(--category-color) 72%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--category-color) 14%, transparent);
  color: var(--category-color);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 5px 10px;
  text-transform: uppercase;
}

.visual-selector__picker {
  width: 48px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg);
  cursor: pointer;
  padding: 4px;
}

.visual-selector__picker:focus-visible {
  border-color: var(--color-info);
  outline: 2px solid rgba(59, 130, 246, 0.28);
  outline-offset: 1px;
}

@media (max-width: 640px) {
  .visual-selector__item {
    grid-template-columns: 1fr;
  }

  .visual-selector__identity {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

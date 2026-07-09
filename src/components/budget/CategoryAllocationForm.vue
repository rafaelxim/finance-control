<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next'

import BaseButton from '@/components/ui/BaseButton.vue'
import type { BudgetDraftCategoryInput } from '@/domain/budget/types'
import { formatBRL } from '@/domain/shared/money'

const props = defineProps<{
  category: BudgetDraftCategoryInput
  index: number
  computedLimit: string
  categoryColor?: string
}>()

const emit = defineEmits<{
  edit: [index: number]
  remove: [index: number]
}>()

const summaryLabel = () => props.category.name.trim() || 'Nova categoria'
</script>

<template>
  <article
    class="category-form panel"
    :aria-label="summaryLabel()"
    :style="{ '--category-color': categoryColor ?? 'var(--color-primary)' }"
  >
    <header class="category-form__topbar">
      <strong class="category-form__name">{{ summaryLabel() }}</strong>
      <div class="category-form__actions">
        <BaseButton
          class="category-form__action"
          variant="secondary"
          aria-label="Editar categoria"
          title="Editar categoria"
          @click="emit('edit', index)"
        >
          <Pencil :size="17" aria-hidden="true" />
        </BaseButton>
        <BaseButton
          class="category-form__action category-form__action--danger"
          variant="ghost"
          aria-label="Remover categoria"
          title="Remover categoria"
          @click="emit('remove', index)"
        >
          <Trash2 :size="17" aria-hidden="true" />
        </BaseButton>
      </div>
    </header>

    <div class="category-form__footer">
      <div class="category-form__snapshot">
        <span class="category-form__snapshot-label">Limite calculado</span>
        <strong class="money money--primary">{{ formatBRL(computedLimit) }}</strong>
      </div>
    </div>
  </article>
</template>

<style scoped>
.category-form {
  position: relative;
  display: grid;
  min-height: 184px;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 16px;
  overflow: hidden;
  box-shadow: none;
  padding: 0;
  transition:
    border-color 140ms ease,
    transform 140ms ease;
}

.category-form::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--category-color, var(--color-primary));
  content: '';
}

.category-form:hover {
  border-color: color-mix(in srgb, var(--color-primary) 28%, var(--color-border));
  transform: translateY(-1px);
}

.category-form__topbar {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 0 20px;
}

.category-form__snapshot-label {
  color: var(--color-muted);
  margin: 0;
  font-size: 0.78rem;
}

.category-form__snapshot-label {
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.category-form__name {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--color-text);
  font-size: 1.12rem;
  line-height: 1.16;
}

.category-form__actions {
  display: inline-flex;
  gap: 8px;
}

.category-form__action {
  width: 36px;
  min-height: 36px;
  padding: 0;
}

.category-form__action--danger {
  color: var(--color-danger);
}

.category-form__action--danger:hover,
.category-form__action--danger:focus-visible {
  border-color: rgba(246, 70, 93, 0.42);
  background: rgba(246, 70, 93, 0.08);
  color: var(--color-danger);
}

.category-form__footer {
  border-top: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-bg) 34%, transparent);
  padding: 14px 18px 16px 20px;
}

.category-form__snapshot {
  display: flex;
  min-width: 0;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.category-form__snapshot strong {
  color: var(--color-primary);
  flex: 0 0 auto;
  font-size: 1.08rem;
}

@media (max-width: 520px) {
  .category-form__topbar,
  .category-form__snapshot {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

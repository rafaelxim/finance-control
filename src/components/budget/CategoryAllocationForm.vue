<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

import type { AllocationType, BudgetDraftCategoryInput } from '@/domain/budget/types'
import { formatBRL } from '@/domain/shared/money'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CurrencyInput from '@/components/ui/CurrencyInput.vue'

const props = defineProps<{
  category: BudgetDraftCategoryInput
  index: number
  computedLimit: string
}>()

const emit = defineEmits<{
  update: [index: number, category: BudgetDraftCategoryInput]
  remove: [index: number]
}>()

const allocationOptions = [
  { value: 'fixed', label: 'Valor fixo' },
  { value: 'percentage', label: 'Percentual' }
]

const valueLabel = computed(() =>
  props.category.allocationType === 'percentage' ? 'Percentual' : 'Valor'
)

const allocationLabel = computed(() =>
  props.category.allocationType === 'percentage' ? 'Percentual da verba' : 'Valor fixo'
)

const summaryLabel = computed(() => props.category.name.trim() || 'Nova categoria')
const isContentMounted = ref(false)
const isExpanded = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | undefined

function patch(update: Partial<BudgetDraftCategoryInput>) {
  emit('update', props.index, { ...props.category, ...update })
}

function toggleExpanded() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }

  if (isExpanded.value) {
    isExpanded.value = false
    closeTimer = setTimeout(() => {
      isContentMounted.value = false
      closeTimer = undefined
    }, 220)
    return
  }

  isContentMounted.value = true
  void nextTick(() => {
    requestAnimationFrame(() => {
      isExpanded.value = true
    })
  })
}

onBeforeUnmount(() => {
  if (closeTimer) clearTimeout(closeTimer)
})
</script>

<template>
  <details
    class="category-form panel"
    :class="{ 'category-form--expanded': isExpanded }"
    :open="isContentMounted"
  >
    <summary
      class="category-form__summary"
      :aria-expanded="isExpanded"
      @click.prevent="toggleExpanded"
    >
      <div class="category-form__headline">
        <span class="category-form__eyebrow">Categoria</span>
        <div class="category-form__title-row">
          <strong class="category-form__name">{{ summaryLabel }}</strong>
        </div>
        <p class="category-form__description">{{ allocationLabel }}</p>
      </div>
      <div class="category-form__snapshot">
        <span class="category-form__snapshot-label">Limite calculado</span>
        <strong class="money money--secondary">{{ formatBRL(computedLimit) }}</strong>
      </div>
      <span class="category-form__toggle" aria-hidden="true">
        <ChevronDown :size="18" :stroke-width="2.5" />
      </span>
    </summary>

    <div class="category-form__content">
      <div class="category-form__body">
        <BaseInput
          :id="`category-name-${index}`"
          :model-value="category.name"
          label="Categoria"
          placeholder="Ex.: Comida"
          @update:model-value="patch({ name: $event })"
        />
        <BaseSelect
          :id="`category-type-${index}`"
          :model-value="category.allocationType"
          :options="allocationOptions"
          label="Tipo"
          @update:model-value="patch({ allocationType: $event as AllocationType })"
        />
        <CurrencyInput
          v-if="category.allocationType === 'fixed'"
          :id="`category-value-${index}`"
          :model-value="category.allocationValue"
          :label="valueLabel"
          @update:model-value="patch({ allocationValue: $event })"
        />
        <BaseInput
          v-else
          :id="`category-percent-${index}`"
          :model-value="category.allocationValue"
          :label="valueLabel"
          type="number"
          @update:model-value="patch({ allocationValue: $event })"
        />
        <div class="category-form__actions">
          <BaseButton variant="ghost" @click="emit('remove', index)">Remover</BaseButton>
        </div>
      </div>
    </div>
  </details>
</template>

<style scoped>
.category-form {
  display: grid;
  gap: 12px;
  box-shadow: none;
  padding: 0;
  transition:
    border-color 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;
}

.category-form[open] {
  grid-column: 1 / -1;
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.18);
}

.category-form:hover {
  transform: translateY(-1px);
}

.category-form > summary {
  list-style: none;
}

.category-form > summary::-webkit-details-marker {
  display: none;
}

.category-form__summary {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(170px, 220px);
  align-items: center;
  gap: 14px;
  cursor: pointer;
  padding: 16px 58px 16px 18px;
}

.category-form__headline {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.category-form__title-row {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.category-form__eyebrow,
.category-form__description,
.category-form__snapshot-label {
  color: var(--color-muted);
  margin: 0;
  font-size: 0.78rem;
}

.category-form__eyebrow,
.category-form__snapshot-label {
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.category-form__name {
  min-width: 0;
  color: var(--color-text);
  font-size: 1rem;
}

.category-form__toggle {
  position: absolute;
  top: 14px;
  right: 16px;
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-bg) 60%, transparent);
  color: var(--color-muted);
  transition:
    transform 140ms ease,
    color 140ms ease,
    border-color 140ms ease;
}

.category-form--expanded .category-form__toggle {
  transform: rotate(180deg);
  color: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary) 36%, var(--color-border));
}

.category-form__description {
  font-size: 0.86rem;
}

.category-form__snapshot {
  display: grid;
  justify-items: end;
  gap: 4px;
  text-align: right;
}

.category-form__snapshot strong {
  color: var(--color-primary);
  font-size: 1rem;
}

.category-form__content {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(-6px);
  transition:
    grid-template-rows 220ms ease,
    opacity 160ms ease,
    transform 220ms ease;
}

.category-form--expanded .category-form__content {
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
}

.category-form__body {
  display: grid;
  min-height: 0;
  grid-template-columns: minmax(180px, 2fr) minmax(140px, 1fr) minmax(140px, 1fr) auto;
  align-items: end;
  gap: 12px;
  border-top: 1px solid var(--color-border);
  overflow: hidden;
  padding: 18px;
}

.category-form__actions {
  display: flex;
  align-items: end;
  justify-content: flex-end;
}

@media (max-width: 820px) {
  .category-form {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .category-form,
  .category-form__content,
  .category-form__toggle {
    transition-duration: 1ms;
  }
}
</style>

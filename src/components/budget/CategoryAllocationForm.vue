<script setup lang="ts">
import { computed } from 'vue'

import type { AllocationType, BudgetDraftCategoryInput } from '@/domain/budget/types'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CurrencyInput from '@/components/ui/CurrencyInput.vue'

const props = defineProps<{
  category: BudgetDraftCategoryInput
  index: number
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

function patch(update: Partial<BudgetDraftCategoryInput>) {
  emit('update', props.index, { ...props.category, ...update })
}
</script>

<template>
  <div class="category-form panel">
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
    <BaseButton variant="ghost" @click="emit('remove', index)">Remover</BaseButton>
  </div>
</template>

<style scoped>
.category-form {
  display: grid;
  grid-template-columns: minmax(180px, 2fr) minmax(140px, 1fr) minmax(140px, 1fr) auto;
  align-items: end;
  gap: 12px;
  box-shadow: none;
}

@media (max-width: 820px) {
  .category-form {
    grid-template-columns: 1fr;
  }
}
</style>

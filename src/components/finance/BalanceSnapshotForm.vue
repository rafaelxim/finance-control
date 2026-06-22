<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CurrencyInput from '@/components/ui/CurrencyInput.vue'
import MonthPicker from '@/components/ui/MonthPicker.vue'
import type { BalanceDraftItemInput, BalanceTotals } from '@/domain/balance/types'
import type { MonthKey } from '@/domain/shared/types'

import NetWorthSummary from './NetWorthSummary.vue'

const props = withDefaults(
  defineProps<{
    month: MonthKey
    notes: string
    items: BalanceDraftItemInput[]
    totals: BalanceTotals
    saving?: boolean
  }>(),
  {
    saving: false
  }
)

const emit = defineEmits<{
  'update:month': [value: MonthKey]
  'update:notes': [value: string]
  'update-item': [index: number, item: BalanceDraftItemInput]
  'add-item': []
  'remove-item': [index: number]
  save: []
}>()

const kindOptions = [
  { value: 'asset', label: 'Ativo' },
  { value: 'debt', label: 'Dívida' }
]

function patchItem(index: number, patch: Partial<BalanceDraftItemInput>) {
  emit('update-item', index, {
    ...props.items[index],
    ...patch,
    sortOrder: index
  })
}
</script>

<template>
  <form class="balance-form panel" aria-label="Fechamento mensal" @submit.prevent="emit('save')">
    <div class="balance-form__header">
      <MonthPicker
        id="balance-month"
        :model-value="month"
        label="Mês"
        @update:model-value="emit('update:month', $event as MonthKey)"
      />
      <BaseInput
        id="balance-notes"
        :model-value="notes"
        label="Observações"
        placeholder="Opcional"
        @update:model-value="emit('update:notes', $event)"
      />
    </div>

    <NetWorthSummary :totals="totals" />

    <div class="balance-form__items" role="list" aria-label="Itens do fechamento">
      <div
        v-for="(item, index) in items"
        :key="item.id ?? index"
        class="balance-form__item"
        role="listitem"
      >
        <BaseInput
          :id="`balance-item-name-${index}`"
          :model-value="item.name"
          label="Nome"
          placeholder="Ex.: Banco, CDB ou Cartão"
          @update:model-value="patchItem(index, { name: $event })"
        />
        <BaseSelect
          :id="`balance-item-kind-${index}`"
          :model-value="item.kind"
          :options="kindOptions"
          label="Tipo"
          @update:model-value="patchItem(index, { kind: $event as BalanceDraftItemInput['kind'] })"
        />
        <CurrencyInput
          :id="`balance-item-amount-${index}`"
          :model-value="item.amount"
          label="Valor"
          @update:model-value="patchItem(index, { amount: $event })"
        />
        <BaseButton
          :data-test="`remove-balance-item-${index}`"
          variant="ghost"
          @click="emit('remove-item', index)"
        >
          Remover
        </BaseButton>
      </div>
    </div>

    <div class="balance-form__actions">
      <BaseButton
        data-test="add-balance-item"
        type="button"
        variant="secondary"
        @click="emit('add-item')"
      >
        Adicionar item
      </BaseButton>
      <BaseButton type="submit" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Salvar fechamento' }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.balance-form {
  display: grid;
  gap: 16px;
}

.balance-form__header {
  display: grid;
  grid-template-columns: minmax(160px, 220px) minmax(220px, 1fr);
  gap: 14px;
}

.balance-form__items {
  display: grid;
  gap: 10px;
}

.balance-form__item {
  display: grid;
  grid-template-columns: minmax(180px, 2fr) minmax(160px, 1fr) minmax(140px, 1fr) auto;
  align-items: end;
  gap: 12px;
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
}

.balance-form__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}

@media (max-width: 920px) {
  .balance-form__header,
  .balance-form__item {
    grid-template-columns: 1fr;
  }
}
</style>

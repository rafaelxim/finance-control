<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Plus, Save } from 'lucide-vue-next'

import BalanceItemTable from '@/components/finance/BalanceItemTable.vue'
import NetWorthSummary from '@/components/finance/NetWorthSummary.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CurrencyInput from '@/components/ui/CurrencyInput.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FormError from '@/components/ui/FormError.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { validateBalanceSnapshotDraft } from '@/domain/balance/schemas'
import type { BalanceDraftItemInput, BalanceItem } from '@/domain/balance/types'
import { useBalanceStore } from '@/stores/balance.store'
import { useProfileStore } from '@/stores/profile.store'

const balanceStore = useBalanceStore()
const profileStore = useProfileStore()
const saving = ref(false)
const saved = ref(false)
const errors = ref<string[]>([])
const itemModalOpen = ref(false)
const editingItemId = ref<string | null>(null)
const itemDraft = ref<BalanceDraftItemInput>(createEmptyItem())

const kindOptions = [
  { value: 'asset', label: 'Ativo' },
  { value: 'debt', label: 'Dívida' }
]

const itemModalTitle = computed(() => (editingItemId.value ? 'Editar item' : 'Adicionar item'))

onMounted(async () => {
  await balanceStore.loadMonth(profileStore.activeMonth)
  await balanceStore.loadHistory()
})

watch(
  () => profileStore.activeMonth,
  async (month) => {
    saved.value = false
    await balanceStore.loadMonth(month)
    await balanceStore.loadHistory()
  }
)

function createEmptyItem(kind: BalanceDraftItemInput['kind'] = 'asset'): BalanceDraftItemInput {
  return {
    name: '',
    kind,
    amount: '0.00',
    sortOrder: balanceStore.draftItems.length
  }
}

function savedItemsAsDraft(): BalanceDraftItemInput[] {
  return balanceStore.items.map((item) => ({
    id: item.id,
    name: item.name,
    kind: item.kind,
    amount: item.amount,
    institution: item.institution,
    notes: item.notes,
    sortOrder: item.sortOrder
  }))
}

function openCreateItemModal() {
  errors.value = []
  editingItemId.value = null
  itemDraft.value = createEmptyItem()
  itemModalOpen.value = true
}

function openEditItemModal(item: BalanceItem) {
  errors.value = []
  editingItemId.value = item.id
  itemDraft.value = {
    id: item.id,
    name: item.name,
    kind: item.kind,
    amount: item.amount,
    institution: item.institution,
    notes: item.notes,
    sortOrder: item.sortOrder
  }
  itemModalOpen.value = true
}

function closeItemModal() {
  if (saving.value) return
  itemModalOpen.value = false
  editingItemId.value = null
  itemDraft.value = createEmptyItem()
  errors.value = []
}

function updateItemDraft(patch: Partial<BalanceDraftItemInput>) {
  itemDraft.value = {
    ...itemDraft.value,
    ...patch
  }
}

async function persistDraftItems(nextItems: BalanceDraftItemInput[], validate = true) {
  saved.value = false
  errors.value = validate
    ? validateBalanceSnapshotDraft({
        month: balanceStore.draftMonth,
        notes: balanceStore.draftNotes,
        items: nextItems
      })
    : []
  if (errors.value.length) return false

  saving.value = true
  try {
    balanceStore.draftItems = nextItems.map((item, sortOrder) => ({ ...item, sortOrder }))
    await balanceStore.save()
    saved.value = true
    return true
  } finally {
    saving.value = false
  }
}

async function saveItem() {
  const currentItems = savedItemsAsDraft()
  const existingIndex = editingItemId.value
    ? currentItems.findIndex((item) => item.id === editingItemId.value)
    : -1
  const normalizedItem = {
    ...itemDraft.value,
    sortOrder: existingIndex >= 0 ? existingIndex : currentItems.length
  }
  const nextItems =
    existingIndex >= 0
      ? currentItems.map((item, index) => (index === existingIndex ? normalizedItem : item))
      : [...currentItems, normalizedItem]

  const persisted = await persistDraftItems(nextItems)
  if (persisted) closeItemModal()
}

async function saveNotes() {
  await persistDraftItems(savedItemsAsDraft())
}

async function removeItem(item: BalanceItem) {
  if (!window.confirm(`Remover ${item.name}?`)) return
  const nextItems = savedItemsAsDraft().filter((draftItem) => draftItem.id !== item.id)
  await persistDraftItems(nextItems, nextItems.length > 0)
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h1>Balanço</h1>
        <p>Atualize saldos de contas, investimentos e cartões de crédito.</p>
      </div>
      <BaseButton @click="openCreateItemModal">
        <Plus :size="18" aria-hidden="true" />
        Adicionar item
      </BaseButton>
    </header>

    <LoadingState v-if="balanceStore.loading" />

    <template v-else>
      <section class="balance-summary panel" aria-label="Resumo do balanço">
        <NetWorthSummary :totals="balanceStore.savedTotals" />
        <div class="balance-summary__notes">
          <BaseInput
            id="balance-notes"
            :model-value="balanceStore.draftNotes"
            label="Observações"
            placeholder="Opcional"
            @update:model-value="balanceStore.draftNotes = $event"
          />
          <BaseButton variant="secondary" :disabled="saving" @click="saveNotes">
            <Save :size="17" aria-hidden="true" />
            {{ saving ? 'Salvando...' : 'Salvar observação' }}
          </BaseButton>
        </div>
      </section>

      <FormError :errors="errors" />
      <p v-if="saved" class="save-success" role="status">Fechamento salvo com sucesso.</p>

      <EmptyState
        v-if="!balanceStore.items.length"
        title="Nenhum fechamento salvo"
        description="Salve o fechamento mensal para acompanhar sua evolução financeira."
      />

      <BalanceItemTable
        v-else
        :items="balanceStore.items"
        @edit="openEditItemModal"
        @remove="removeItem"
      />

      <BaseModal
        :open="itemModalOpen"
        :title="itemModalTitle"
        description="Informe os dados do item para atualizar o fechamento do mês."
        @close="closeItemModal"
      >
        <form v-if="itemModalOpen" class="balance-item-modal" @submit.prevent="saveItem">
          <FormError :errors="errors" />
          <BaseInput
            id="balance-item-name"
            :model-value="itemDraft.name"
            label="Nome"
            placeholder="Ex.: Banco, CDB ou Cartão"
            @update:model-value="updateItemDraft({ name: $event })"
          />
          <BaseSelect
            id="balance-item-kind"
            :model-value="itemDraft.kind"
            :options="kindOptions"
            label="Tipo"
            @update:model-value="updateItemDraft({ kind: $event as BalanceDraftItemInput['kind'] })"
          />
          <CurrencyInput
            id="balance-item-amount"
            :model-value="itemDraft.amount"
            label="Valor"
            @update:model-value="updateItemDraft({ amount: $event })"
          />
          <div class="balance-item-modal__actions">
            <BaseButton type="button" variant="ghost" @click="closeItemModal">Cancelar</BaseButton>
            <BaseButton type="submit" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Salvar item' }}
            </BaseButton>
          </div>
        </form>
      </BaseModal>
    </template>
  </section>
</template>

<style scoped>
.page {
  max-width: 1600px;
}

.page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.balance-summary {
  display: grid;
  gap: 16px;
}

.balance-summary__notes {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  align-items: end;
  gap: 12px;
}

.balance-item-modal {
  display: grid;
  gap: 14px;
}

.balance-item-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.save-success {
  border: 1px solid rgba(14, 203, 129, 0.42);
  border-radius: var(--radius);
  background: rgba(14, 203, 129, 0.08);
  color: var(--color-up);
  margin: 0;
  padding: 12px;
}

@media (max-width: 720px) {
  .page__header,
  .balance-summary__notes {
    grid-template-columns: 1fr;
  }

  .page__header {
    display: grid;
  }
}
</style>

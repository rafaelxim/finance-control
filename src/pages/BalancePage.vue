<script setup lang="ts">
import { onMounted, ref } from 'vue'

import BalanceItemTable from '@/components/finance/BalanceItemTable.vue'
import BalanceSnapshotForm from '@/components/finance/BalanceSnapshotForm.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FormError from '@/components/ui/FormError.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { validateBalanceSnapshotDraft } from '@/domain/balance/schemas'
import type { BalanceDraftItemInput } from '@/domain/balance/types'
import type { MonthKey } from '@/domain/shared/types'
import { useBalanceStore } from '@/stores/balance.store'

const balanceStore = useBalanceStore()
const saving = ref(false)
const saved = ref(false)
const errors = ref<string[]>([])

onMounted(async () => {
  await balanceStore.loadMonth(balanceStore.draftMonth)
  await balanceStore.loadHistory()
})

async function updateMonth(month: MonthKey) {
  saved.value = false
  await balanceStore.loadMonth(month)
}

function updateItem(index: number, item: BalanceDraftItemInput) {
  saved.value = false
  balanceStore.updateItem(index, item)
}

async function saveSnapshot() {
  saved.value = false
  errors.value = validateBalanceSnapshotDraft({
    month: balanceStore.draftMonth,
    notes: balanceStore.draftNotes,
    items: balanceStore.draftItems
  })
  if (errors.value.length) return

  saving.value = true
  try {
    await balanceStore.save()
    saved.value = true
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Balanço</h1>
      <p>Atualize saldos de contas, investimentos e cartões de crédito.</p>
    </header>

    <LoadingState v-if="balanceStore.loading" />

    <template v-else>
      <BalanceSnapshotForm
        :month="balanceStore.draftMonth"
        :notes="balanceStore.draftNotes"
        :items="balanceStore.draftItems"
        :totals="balanceStore.draftTotals"
        :saving="saving"
        @update:month="updateMonth"
        @update:notes="balanceStore.draftNotes = $event"
        @update-item="updateItem"
        @add-item="balanceStore.addItem"
        @remove-item="balanceStore.removeItem"
        @save="saveSnapshot"
      />

      <FormError :errors="errors" />
      <p v-if="saved" class="save-success" role="status">Fechamento salvo com sucesso.</p>

      <EmptyState
        v-if="!balanceStore.items.length"
        title="Nenhum fechamento salvo"
        description="Salve o fechamento mensal para acompanhar sua evolução financeira."
      />

      <BalanceItemTable v-else :items="balanceStore.items" />
    </template>
  </section>
</template>

<style scoped>
.save-success {
  border: 1px solid rgba(14, 203, 129, 0.42);
  border-radius: var(--radius);
  background: rgba(14, 203, 129, 0.08);
  color: var(--color-up);
  margin: 0;
  padding: 12px;
}
</style>

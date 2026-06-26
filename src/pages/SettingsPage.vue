<script setup lang="ts">
import { onMounted, ref } from 'vue'

import CategoryVisualSelector from '@/components/budget/CategoryVisualSelector.vue'
import DataBackupPanel from '@/components/finance/DataBackupPanel.vue'
import {
  clearLocalData,
  exportLocalData,
  importLocalData,
  readVisualPreferences,
  saveVisualPreferences
} from '@/storage/data-export.repository'
import { useBalanceStore } from '@/stores/balance.store'
import { useBudgetStore } from '@/stores/budget.store'
import { useExpensesStore } from '@/stores/expenses.store'
import { useProfileStore } from '@/stores/profile.store'

const budgetStore = useBudgetStore()
const expensesStore = useExpensesStore()
const balanceStore = useBalanceStore()
const profileStore = useProfileStore()
const exportJson = ref('')
const importText = ref('')
const errors = ref<string[]>([])
const status = ref('')
const categoryVisuals = ref<Record<string, string>>({})

onMounted(async () => {
  categoryVisuals.value = (await readVisualPreferences()).categoryVisuals ?? {}
  await budgetStore.loadMonth(profileStore.activeMonth)
})

async function exportData() {
  errors.value = []
  const payload = await exportLocalData()
  exportJson.value = JSON.stringify(payload, null, 2)
  status.value = 'Exportação gerada.'
}

async function importData() {
  errors.value = []
  status.value = ''
  let parsed: unknown
  try {
    parsed = JSON.parse(importText.value)
  } catch {
    errors.value = ['JSON inválido']
    return
  }

  try {
    const result = await importLocalData(parsed)
    errors.value = result.errors
    if (!result.errors.length) {
      status.value = 'Importação concluída.'
      await profileStore.load()
      await budgetStore.loadMonth(profileStore.activeMonth)
      await expensesStore.loadForBudget(budgetStore.budget?.id ?? null, profileStore.activeMonth)
      await balanceStore.loadHistory()
    }
  } catch (error) {
    errors.value = [error instanceof Error ? error.message : 'Falha ao importar dados remotos']
  }
}

async function clearData() {
  await clearLocalData()
  await profileStore.load()
  status.value = 'Dados remotos limpos.'
  await budgetStore.loadMonth(profileStore.activeMonth)
  await expensesStore.loadForBudget(null, profileStore.activeMonth)
  await balanceStore.loadHistory()
}

async function updateVisuals(value: Record<string, string>) {
  categoryVisuals.value = value
  await saveVisualPreferences({ categoryVisuals: value })
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Configurações</h1>
      <p>Preferências remotas, exportação e importação de backup.</p>
    </header>

    <CategoryVisualSelector
      v-model="categoryVisuals"
      :categories="budgetStore.activeCategories"
      @update:model-value="updateVisuals"
    />

    <DataBackupPanel
      v-model:import-text="importText"
      :export-json="exportJson"
      :errors="errors"
      :status="status"
      @export="exportData"
      @import="importData"
      @clear="clearData"
    />
  </section>
</template>

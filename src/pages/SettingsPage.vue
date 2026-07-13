<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Save } from 'lucide-vue-next'

import CategoryVisualSelector from '@/components/budget/CategoryVisualSelector.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { readVisualPreferences, saveVisualPreferences } from '@/storage/data-export.repository'
import { useBudgetStore } from '@/stores/budget.store'
import { useProfileStore } from '@/stores/profile.store'

const budgetStore = useBudgetStore()
const profileStore = useProfileStore()
const categoryVisuals = ref<Record<string, string>>({})
const saving = ref(false)
const status = ref('')
const pageHydrating = ref(true)
const pageLoading = computed(() => pageHydrating.value || budgetStore.loading)

onMounted(async () => {
  try {
    categoryVisuals.value = (await readVisualPreferences()).categoryVisuals ?? {}
    await budgetStore.loadMonth(profileStore.activeMonth)
  } finally {
    pageHydrating.value = false
  }
})

function updateVisuals(value: Record<string, string>) {
  categoryVisuals.value = value
  status.value = ''
}

async function saveVisuals() {
  saving.value = true
  try {
    await saveVisualPreferences({ categoryVisuals: categoryVisuals.value })
    status.value = 'Preferências visuais salvas.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="page">
    <LoadingState v-if="pageLoading" />

    <template v-else>
      <header class="page__header">
        <h1>Configurações</h1>
        <p>Preferências visuais para personalizar as categorias do orçamento.</p>
      </header>

      <CategoryVisualSelector
        v-model="categoryVisuals"
        :categories="budgetStore.activeCategories"
        @update:model-value="updateVisuals"
      />

      <div class="settings-actions">
        <BaseButton :disabled="saving" @click="saveVisuals">
          <Save :size="17" aria-hidden="true" />
          {{ saving ? 'Salvando...' : 'Salvar preferências visuais' }}
        </BaseButton>
        <p v-if="status" class="settings-status" role="status">{{ status }}</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.settings-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.settings-status {
  margin: 0;
  color: var(--color-up);
  font-size: 0.9rem;
  font-weight: 700;
}
</style>

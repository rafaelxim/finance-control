<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Copy } from 'lucide-vue-next'

import BaseButton from '@/components/ui/BaseButton.vue'
import type { CategoryProgress } from '@/domain/gamification/category-progress'
import { formatCategoryUsageForSharing } from '@/domain/gamification/category-usage-export'
import type { MonthKey } from '@/domain/shared/types'

const props = defineProps<{
  progress: CategoryProgress[]
  month: MonthKey
}>()

const status = ref<'idle' | 'copied' | 'error'>('idle')
let resetTimeout: ReturnType<typeof window.setTimeout> | null = null

const disabled = computed(() => props.progress.length === 0)
const statusText = computed(() => {
  if (status.value === 'copied') return 'Texto copiado'
  if (status.value === 'error') return 'Não foi possível copiar'
  return ''
})

async function copyCategoryUsage() {
  if (disabled.value) return

  try {
    await navigator.clipboard.writeText(formatCategoryUsageForSharing(props.progress, props.month))
    status.value = 'copied'
  } catch {
    status.value = 'error'
  }

  if (resetTimeout) {
    window.clearTimeout(resetTimeout)
  }

  resetTimeout = window.setTimeout(() => {
    status.value = 'idle'
    resetTimeout = null
  }, 2500)
}

onBeforeUnmount(() => {
  if (resetTimeout) {
    window.clearTimeout(resetTimeout)
  }
})
</script>

<template>
  <div class="category-export">
    <BaseButton
      type="button"
      variant="secondary"
      :disabled="disabled"
      aria-label="Copiar uso das categorias"
      @click="copyCategoryUsage"
    >
      <Copy :size="16" aria-hidden="true" />
      Copiar uso
    </BaseButton>
    <span class="category-export__status" aria-live="polite">{{ statusText }}</span>
  </div>
</template>

<style scoped>
.category-export {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.category-export__status {
  min-height: 1.2em;
  color: var(--color-muted);
  font-size: 0.84rem;
}
</style>

<script setup lang="ts">
import { CheckCircle2, ChevronRight, CircleDashed } from 'lucide-vue-next'

import type { SetupChecklistItem } from '@/composables/useSetupChecklist'

defineProps<{
  completedCount: number
  totalCount: number
  progressWidth: string
  nextItem: SetupChecklistItem | null
  isComplete: boolean
  loading?: boolean
}>()

defineEmits<{
  navigate: []
}>()
</script>

<template>
  <section class="setup-progress" aria-labelledby="setup-progress-title">
    <div class="setup-progress__header">
      <div>
        <p id="setup-progress-title">Setup</p>
        <strong>{{ completedCount }}/{{ totalCount }}</strong>
      </div>
      <span
        class="setup-progress__status"
        :class="{ 'setup-progress__status--complete': isComplete }"
      >
        <CheckCircle2 v-if="isComplete" :size="15" aria-hidden="true" />
        <CircleDashed v-else :size="15" aria-hidden="true" />
      </span>
    </div>

    <div class="setup-progress__track" aria-hidden="true">
      <span :style="{ width: progressWidth }"></span>
    </div>

    <RouterLink
      v-if="nextItem && !isComplete"
      class="setup-progress__next"
      :to="nextItem.actionTarget"
      @click="$emit('navigate')"
    >
      <span>
        <small>Próximo</small>
        {{ nextItem.title }}
      </span>
      <ChevronRight :size="15" aria-hidden="true" />
    </RouterLink>

    <RouterLink
      v-else
      class="setup-progress__next setup-progress__next--complete"
      to="/"
      @click="$emit('navigate')"
    >
      <span>
        <small>{{ loading ? 'Atualizando' : 'Concluído' }}</small>
        Revisar etapas
      </span>
      <ChevronRight :size="15" aria-hidden="true" />
    </RouterLink>
  </section>
</template>

<style scoped>
.setup-progress {
  display: grid;
  gap: 10px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 28%, var(--color-border));
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface));
  padding: 10px;
}

.setup-progress__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.setup-progress__header p,
.setup-progress__header strong {
  margin: 0;
}

.setup-progress__header p,
.setup-progress__next small {
  color: var(--color-muted);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.setup-progress__header strong {
  color: var(--color-primary);
  font-family: var(--font-number);
  font-size: 0.92rem;
  line-height: 1.1;
}

.setup-progress__status {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-muted);
}

.setup-progress__status--complete {
  border-color: rgba(14, 203, 129, 0.36);
  background: rgba(14, 203, 129, 0.1);
  color: var(--color-up);
}

.setup-progress__track {
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-bg) 62%, var(--color-border));
}

.setup-progress__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width 180ms ease;
}

.setup-progress__next {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 42%, var(--color-border));
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--color-bg) 34%, transparent);
  color: var(--color-text);
  font-size: 0.82rem;
  font-weight: 750;
  line-height: 1.2;
  padding: 8px 9px;
  text-decoration: none;
}

.setup-progress__next span {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.setup-progress__next:not(.setup-progress__next--complete) {
  color: var(--color-primary);
}

.setup-progress__next--complete {
  border-color: var(--color-border);
  color: var(--color-text);
}

.setup-progress__next:hover,
.setup-progress__next:focus-visible {
  border-color: var(--color-primary);
  outline: none;
}

</style>

<script setup lang="ts">
import { computed } from 'vue'
import { Check, ChevronRight, Circle, ClipboardCheck } from 'lucide-vue-next'

import type { SetupChecklistItem } from '@/composables/useSetupChecklist'

const props = defineProps<{
  items: SetupChecklistItem[]
}>()

const completedCount = computed(() => props.items.filter((item) => item.completed).length)
const totalCount = computed(() => props.items.length)
const isComplete = computed(() => completedCount.value === totalCount.value)
const nextItem = computed(() => props.items.find((item) => !item.completed) ?? null)
const progressWidth = computed(() => {
  if (!totalCount.value) return '0%'
  return `${Math.round((completedCount.value / totalCount.value) * 100)}%`
})
</script>

<template>
  <section
    class="setup-checklist panel"
    :class="{ 'setup-checklist--complete': isComplete }"
    aria-labelledby="setup-checklist-title"
  >
    <header class="setup-checklist__header">
      <div class="setup-checklist__title">
        <span class="setup-checklist__icon" aria-hidden="true">
          <ClipboardCheck :size="18" />
        </span>
        <div>
          <p id="setup-checklist-title" class="setup-checklist__eyebrow">Primeiro uso</p>
          <h2>{{ isComplete ? 'Primeiro uso concluído' : 'Checklist de configuração' }}</h2>
        </div>
      </div>

      <div class="setup-checklist__progress-badge" aria-label="Progresso do checklist">
        <strong>{{ completedCount }}/{{ totalCount }}</strong>
        <span>concluído</span>
      </div>
    </header>

    <div class="setup-checklist__progress" aria-hidden="true">
      <span :style="{ width: progressWidth }"></span>
    </div>

    <p v-if="isComplete" class="setup-checklist__complete-copy">
      Sua conta já tem os dados básicos para acompanhar orçamento, despesas e patrimônio.
    </p>

    <template v-else>
      <p class="setup-checklist__description">
        Siga estes passos na ordem para preparar o mês ativo e começar a acompanhar seus números.
      </p>

      <ol class="setup-checklist__steps">
        <li
          v-for="(item, index) in items"
          :key="item.id"
          class="setup-checklist__step"
          :class="{
            'setup-checklist__step--complete': item.completed,
            'setup-checklist__step--next': nextItem?.id === item.id
          }"
        >
          <div class="setup-checklist__step-marker" aria-hidden="true">
            <Check v-if="item.completed" :size="15" />
            <Circle v-else :size="12" />
          </div>

          <div class="setup-checklist__step-copy">
            <span class="setup-checklist__step-index">Passo {{ index + 1 }}</span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </div>

          <RouterLink
            class="setup-checklist__action"
            :to="item.actionTarget"
            :aria-label="`${item.actionLabel}: ${item.title}`"
          >
            <span>{{ item.completed ? 'Revisar' : item.actionLabel }}</span>
            <ChevronRight :size="16" aria-hidden="true" />
          </RouterLink>
        </li>
      </ol>
    </template>
  </section>
</template>

<style scoped>
.setup-checklist {
  display: grid;
  gap: 14px;
  border-color: color-mix(in srgb, var(--color-primary) 34%, var(--color-border));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 42%),
    var(--color-surface);
  padding: 18px;
}

.setup-checklist--complete {
  gap: 12px;
  padding: 16px 18px;
}

.setup-checklist__header {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.setup-checklist__title {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.setup-checklist__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--color-primary) 46%, transparent);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.setup-checklist h2,
.setup-checklist p {
  margin: 0;
}

.setup-checklist h2 {
  font-size: 1.02rem;
  font-weight: 750;
}

.setup-checklist__eyebrow,
.setup-checklist__step-index {
  color: var(--color-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.setup-checklist__progress-badge {
  display: grid;
  flex: 0 0 auto;
  justify-items: end;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-bg) 42%, transparent);
  padding: 8px 10px;
}

.setup-checklist__progress-badge strong {
  color: var(--color-primary);
  font-family: var(--font-number);
  line-height: 1;
}

.setup-checklist__progress-badge span {
  color: var(--color-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.setup-checklist__progress {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-bg) 60%, var(--color-border));
}

.setup-checklist__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width 180ms ease;
}

.setup-checklist__description,
.setup-checklist__complete-copy,
.setup-checklist__step-copy p {
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.45;
}

.setup-checklist__steps {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.setup-checklist__step {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-bg) 28%, transparent);
  padding: 12px;
}

.setup-checklist__step--next {
  border-color: color-mix(in srgb, var(--color-primary) 46%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
}

.setup-checklist__step--complete {
  opacity: 0.74;
}

.setup-checklist__step-marker {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-muted);
}

.setup-checklist__step--complete .setup-checklist__step-marker {
  border-color: rgba(14, 203, 129, 0.36);
  background: rgba(14, 203, 129, 0.1);
  color: var(--color-up);
}

.setup-checklist__step-copy {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.setup-checklist__step-copy strong {
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.2;
}

.setup-checklist__action {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.82rem;
  font-weight: 800;
  padding: 7px 10px;
  text-decoration: none;
  white-space: nowrap;
}

.setup-checklist__step--next .setup-checklist__action {
  border-color: color-mix(in srgb, var(--color-primary) 58%, var(--color-border));
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.setup-checklist__action:hover,
.setup-checklist__action:focus-visible {
  border-color: var(--color-primary);
  outline: none;
}

@media (max-width: 760px) {
  .setup-checklist {
    padding: 16px;
  }

  .setup-checklist__header {
    align-items: stretch;
  }

  .setup-checklist__progress-badge {
    align-self: start;
  }

  .setup-checklist__step {
    grid-template-columns: 28px minmax(0, 1fr);
    align-items: start;
    gap: 10px;
  }

  .setup-checklist__action {
    grid-column: 1 / -1;
    justify-content: center;
    width: 100%;
  }
}
</style>

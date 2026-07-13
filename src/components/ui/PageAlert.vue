<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
}>()

const props = withDefaults(
  defineProps<{
    message: string
    tone?: 'success' | 'error'
    durationMs?: number
  }>(),
  {
    tone: 'success',
    durationMs: 5000
  }
)

let closeTimer: ReturnType<typeof window.setTimeout> | null = null

function clearCloseTimer() {
  if (!closeTimer) return
  window.clearTimeout(closeTimer)
  closeTimer = null
}

function scheduleClose(message: string, durationMs: number) {
  clearCloseTimer()
  if (!message || durationMs <= 0) return

  closeTimer = window.setTimeout(() => {
    emit('close')
  }, durationMs)
}

watch(
  () => [props.message, props.durationMs] as const,
  ([message, durationMs]) => scheduleClose(message, durationMs),
  { immediate: true }
)

onBeforeUnmount(clearCloseTimer)
</script>

<template>
  <Teleport to="body">
    <Transition name="page-alert">
      <div
        v-if="message"
        class="page-alert"
        :class="`page-alert--${tone}`"
        :role="tone === 'error' ? 'alert' : 'status'"
      >
        <p>{{ message }}</p>
        <button type="button" aria-label="Fechar alerta" @click="$emit('close')">
          <X :size="16" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.page-alert {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 500;
  display: grid;
  width: min(360px, calc(100vw - 32px));
  grid-template-columns: minmax(0, 1fr) 32px;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--alert-border);
  border-radius: var(--radius-card);
  background: var(--alert-bg);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.32);
  color: var(--alert-color);
  font-size: 0.92rem;
  font-weight: 700;
  margin: 0;
  padding: 12px 12px 12px 14px;
}

.page-alert p {
  margin: 0;
}

.page-alert button {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--alert-color) 34%, transparent);
  border-radius: var(--radius);
  background: transparent;
  color: var(--alert-color);
  cursor: pointer;
  padding: 0;
}

.page-alert button:hover,
.page-alert button:focus-visible {
  background: color-mix(in srgb, var(--alert-color) 12%, transparent);
  outline: none;
}

.page-alert--success {
  --alert-border: color-mix(in srgb, var(--color-up) 44%, var(--color-border));
  --alert-bg: color-mix(in srgb, var(--color-up) 12%, var(--color-surface));
  --alert-color: var(--color-up);
}

.page-alert--error {
  --alert-border: color-mix(in srgb, var(--color-danger) 44%, var(--color-border));
  --alert-bg: color-mix(in srgb, var(--color-danger) 12%, var(--color-surface));
  --alert-color: var(--color-danger);
}

.page-alert-enter-active,
.page-alert-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.page-alert-enter-from,
.page-alert-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .page-alert {
    right: 16px;
    bottom: 16px;
  }
}
</style>

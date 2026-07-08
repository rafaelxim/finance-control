<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  title: string
  description?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const dialog = ref<HTMLElement | null>(null)

function close() {
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) close()
}

watch(
  () => props.open,
  async (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return

    await nextTick()
    dialog.value?.focus()
  }
)

window.addEventListener('keydown', handleKeydown)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @mousedown.self="close">
        <section
          ref="dialog"
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          :aria-describedby="description ? 'modal-description' : undefined"
          tabindex="-1"
        >
          <header class="modal__header">
            <div>
              <h2 id="modal-title">{{ title }}</h2>
              <p v-if="description" id="modal-description">{{ description }}</p>
            </div>
            <button class="modal__close" type="button" aria-label="Fechar modal" @click="close">
              <X :size="20" aria-hidden="true" />
            </button>
          </header>

          <div class="modal__body">
            <slot />
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  overflow-y: auto;
  place-items: center;
  background: rgba(2, 6, 9, 0.76);
  backdrop-filter: blur(5px);
  padding: 28px;
}

.modal {
  width: min(920px, 100%);
  max-height: calc(100vh - 56px);
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.52);
  outline: none;
}

.modal__header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  backdrop-filter: blur(12px);
  padding: 24px 28px 20px;
}

.modal__header h2,
.modal__header p {
  margin: 0;
}

.modal__header h2 {
  color: var(--color-text);
  font-size: 1.3rem;
}

.modal__header p {
  margin-top: 6px;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.modal__close {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface-muted);
  color: var(--color-muted);
  cursor: pointer;
}

.modal__close:hover,
.modal__close:focus-visible {
  border-color: var(--color-primary);
  color: var(--color-primary);
  outline: none;
}

.modal__body {
  padding: 28px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition:
    opacity 180ms ease,
    transform 220ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  opacity: 0;
  transform: translateY(14px) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal,
  .modal-leave-active .modal {
    transition-duration: 1ms;
  }
}
</style>

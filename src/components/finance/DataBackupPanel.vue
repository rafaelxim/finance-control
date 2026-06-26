<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import FormError from '@/components/ui/FormError.vue'

defineProps<{
  exportJson: string
  importText: string
  errors: string[]
  status?: string
}>()

defineEmits<{
  export: []
  import: []
  clear: []
  'update:importText': [value: string]
}>()
</script>

<template>
  <section class="backup-panel panel" aria-label="Backup remoto">
    <header>
      <h2>Backup remoto</h2>
      <p>Exporte ou restaure os dados financeiros remotos em JSON.</p>
    </header>

    <div class="backup-panel__actions">
      <BaseButton @click="$emit('export')">Exportar JSON</BaseButton>
      <BaseButton variant="secondary" @click="$emit('import')">Importar JSON</BaseButton>
      <BaseButton variant="ghost" @click="$emit('clear')">Limpar dados remotos</BaseButton>
    </div>

    <FormError :errors="errors" />
    <p v-if="status" class="backup-panel__status" role="status">{{ status }}</p>

    <label class="field" for="export-json">
      <span class="field__label">Exportação</span>
      <textarea
        id="export-json"
        class="input backup-panel__textarea"
        readonly
        :value="exportJson"
      />
    </label>

    <label class="field" for="import-json">
      <span class="field__label">Importação</span>
      <textarea
        id="import-json"
        class="input backup-panel__textarea"
        :value="importText"
        placeholder="Cole o JSON exportado"
        @input="$emit('update:importText', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>
  </section>
</template>

<style scoped>
.backup-panel {
  display: grid;
  gap: 14px;
}

.backup-panel h2,
.backup-panel p {
  margin: 0;
}

.backup-panel header p {
  color: var(--color-muted);
}

.backup-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.backup-panel__status {
  color: var(--color-up);
}

.backup-panel__textarea {
  min-height: 120px;
  resize: vertical;
}
</style>

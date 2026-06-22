<script setup lang="ts">
import type { AllocationType } from '@/domain/budget/types'
import { formatBRL } from '@/domain/shared/money'

defineProps<{
  name: string
  allocationType: AllocationType
  allocationValue: string
  computedLimit: string
}>()
</script>

<template>
  <article class="category-card" :aria-label="name || 'Nova categoria'">
    <div class="category-card__media">
      <span aria-hidden="true">{{ (name || 'FC').slice(0, 2).toUpperCase() }}</span>
    </div>

    <div class="category-card__body">
      <h3>{{ name || 'Nova categoria' }}</h3>
      <p v-if="allocationType === 'percentage'">
        <span class="category-card__metric">{{ allocationValue }}%</span> do mês
      </p>
      <p v-else>Valor fixo mensal</p>
      <strong>{{ formatBRL(computedLimit) }}</strong>
    </div>
  </article>
</template>

<style scoped>
.category-card {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 14px;
  min-height: 124px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  padding: 14px;
}

.category-card__media {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-number);
  font-weight: 800;
}

.category-card h3,
.category-card p {
  margin: 0;
}

.category-card__body {
  display: grid;
  align-content: center;
  gap: 5px;
}

.category-card p {
  color: var(--color-muted);
  font-size: 0.92rem;
}

.category-card__metric {
  font-family: var(--font-number);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.category-card strong {
  color: var(--color-primary);
  font-family: var(--font-number);
  font-variant-numeric: tabular-nums;
  font-size: 1.3rem;
}
</style>

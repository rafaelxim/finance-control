<script setup lang="ts">
import { computed } from 'vue'

import { getPokemonAsset } from '@/assets/pokemon/manifest'
import type { AllocationType } from '@/domain/budget/types'
import { formatBRL } from '@/domain/shared/money'

const props = defineProps<{
  name: string
  allocationType: AllocationType
  allocationValue: string
  computedLimit: string
  pokemonAssetId?: string
}>()

const asset = computed(() => getPokemonAsset(props.pokemonAssetId))
</script>

<template>
  <article class="category-card">
    <div class="category-card__media">
      <img
        v-if="asset"
        :src="asset.filePath"
        :alt="asset.altText"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
      <span v-else aria-hidden="true">FC</span>
    </div>

    <div class="category-card__body">
      <h3>{{ name || 'Nova categoria' }}</h3>
      <p>
        {{ allocationType === 'percentage' ? `${allocationValue}% do mês` : 'Valor fixo mensal' }}
      </p>
      <strong>{{ formatBRL(computedLimit) }}</strong>
    </div>
  </article>
</template>

<style scoped>
.category-card {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 14px;
  min-height: 132px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: var(--shadow);
  padding: 14px;
}

.category-card__media {
  display: grid;
  min-width: 72px;
  height: 72px;
  place-items: center;
  border-radius: 50%;
  background: var(--color-surface-muted);
  overflow: hidden;
}

.category-card__media img {
  width: 64px;
  height: 64px;
  object-fit: contain;
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

.category-card strong {
  font-size: 1.3rem;
}
</style>

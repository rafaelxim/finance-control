<script setup lang="ts">
import { computed } from 'vue'

import type { CategoryProgress } from '@/domain/gamification/category-progress'
import { formatBRL, toDecimal } from '@/domain/shared/money'

const props = defineProps<{
  progress: CategoryProgress
}>()

const stateLabel = computed(
  () =>
    ({
      safe: 'Seguro',
      warning: 'Atenção',
      limitReached: 'Limite atingido',
      overLimit: 'Limite excedido'
    })[props.progress.state]
)

const stateDescription = computed(() => {
  if (toDecimal(props.progress.limit).eq(0)) {
    return props.progress.state === 'overLimit'
      ? 'Categoria sem limite planejado e com gasto registrado.'
      : 'Categoria sem limite planejado para o mês.'
  }

  return {
    safe: 'Categoria abaixo do limite planejado.',
    warning: 'Categoria próxima do limite mensal.',
    limitReached: 'Categoria chegou exatamente ao limite.',
    overLimit: 'Categoria passou do limite mensal.'
  }[props.progress.state]
})

const progressWidth = computed(() => `${Math.min(Number(props.progress.usagePercent), 100)}%`)
const usageLabel = computed(() => `${Number(props.progress.usagePercent).toFixed(0)}% usado`)
const remainingLabel = computed(() =>
  toDecimal(props.progress.remaining).lt(0) ? 'Déficit' : 'Restante'
)
</script>

<template>
  <article
    class="market-card"
    :data-state="progress.state"
    :aria-label="`${progress.categoryName}: ${stateLabel}`"
  >
    <header class="market-card__header">
      <div>
        <h3>{{ progress.categoryName }}</h3>
        <p>{{ stateDescription }}</p>
      </div>
      <span class="market-card__badge">{{ stateLabel }}</span>
    </header>

    <div class="market-card__focus">
      <div>
        <span>{{ remainingLabel }}</span>
        <strong class="money money--primary">{{ formatBRL(progress.remaining) }}</strong>
      </div>
      <span class="market-card__usage">{{ usageLabel }}</span>
    </div>

    <div class="market-card__track" aria-hidden="true">
      <span :style="{ width: progressWidth }" />
    </div>

    <dl class="market-card__metrics">
      <div>
        <dt>Limite</dt>
        <dd class="money money--secondary">{{ formatBRL(progress.limit) }}</dd>
      </div>
      <div>
        <dt>Gasto</dt>
        <dd class="money money--secondary">{{ formatBRL(progress.spent) }}</dd>
      </div>
      <div>
        <dt>Uso</dt>
        <dd class="money money--secondary">{{ usageLabel }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.market-card {
  display: grid;
  gap: 12px;
  min-height: 194px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  padding: 16px;
}

.market-card__header {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.market-card h3,
.market-card p,
.market-card dl {
  margin: 0;
}

.market-card h3 {
  font-size: 1rem;
}

.market-card p {
  color: var(--color-muted);
  font-size: 0.86rem;
}

.market-card__badge {
  flex: 0 0 auto;
  border: 1px solid var(--state-border);
  border-radius: var(--radius);
  color: var(--state-color);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 4px 8px;
}

.market-card__focus {
  display: flex;
  min-width: 0;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}

.market-card__focus div {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.market-card__focus span {
  color: var(--color-muted);
  font-size: 0.78rem;
}

.market-card__focus strong {
  color: var(--state-color);
}

.market-card__usage {
  flex: 0 0 auto;
  color: var(--state-color) !important;
  font-family: var(--font-number);
  font-size: 0.86rem !important;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.market-card__track {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-surface-muted);
}

.market-card__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--state-color);
}

.market-card__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.market-card dt {
  color: var(--color-muted);
  font-size: 0.78rem;
}

.market-card dd {
  margin: 3px 0 0;
}

.market-card[data-state='safe'] {
  --state-color: var(--color-state-safe);
  --state-border: rgba(14, 203, 129, 0.42);
}

.market-card[data-state='warning'] {
  --state-color: var(--color-state-warning);
  --state-border: rgba(240, 185, 11, 0.42);
}

.market-card[data-state='limitReached'] {
  --state-color: var(--color-state-limit);
  --state-border: rgba(59, 130, 246, 0.42);
}

.market-card[data-state='overLimit'] {
  --state-color: var(--color-state-over);
  --state-border: rgba(246, 70, 93, 0.42);
}

@media (max-width: 420px) {
  .market-card__metrics {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, Tags, TrendingUp, Wallet } from 'lucide-vue-next'

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
const usagePercent = computed(() => Number(props.progress.usagePercent).toFixed(0))
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
      <div class="market-card__identity">
        <span class="market-card__icon" aria-hidden="true">
          <Tags :size="36" :stroke-width="2.4" />
        </span>
        <div>
          <h3>{{ progress.categoryName }}</h3>
          <p>{{ stateDescription }}</p>
        </div>
      </div>
      <span class="market-card__badge">
        <AlertTriangle :size="30" :stroke-width="2.3" aria-hidden="true" />
        {{ stateLabel }}
      </span>
    </header>

    <div class="market-card__focus">
      <div>
        <span>{{ remainingLabel }}</span>
        <strong class="money money--primary">{{ formatBRL(progress.remaining) }}</strong>
      </div>
      <span class="market-card__usage">
        <strong>{{ usagePercent }}%</strong>
        <span>usado</span>
      </span>
    </div>

    <div class="market-card__progress">
      <div class="market-card__track" aria-hidden="true">
        <span :style="{ width: progressWidth }" />
      </div>
      <div class="market-card__scale" aria-hidden="true">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>

    <dl class="market-card__metrics">
      <div>
        <span class="market-card__metric-icon" aria-hidden="true">
          <Wallet :size="28" :stroke-width="2.3" />
        </span>
        <dt>Limite</dt>
        <dd class="money money--secondary">{{ formatBRL(progress.limit) }}</dd>
      </div>
      <div>
        <span class="market-card__metric-icon" aria-hidden="true">
          <TrendingUp :size="28" :stroke-width="2.3" />
        </span>
        <dt>Gasto</dt>
        <dd class="money money--secondary">{{ formatBRL(progress.spent) }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.market-card {
  position: relative;
  container-type: inline-size;
  display: grid;
  gap: clamp(10px, 1.7cqw, 15px);
  overflow: hidden;
  border: 1px solid rgba(146, 154, 165, 0.34);
  border-radius: 14px;
  background:
    radial-gradient(circle at 12% 0%, rgba(146, 154, 165, 0.16), transparent 34%),
    linear-gradient(135deg, rgba(30, 35, 41, 0.98), rgba(11, 14, 17, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(234, 236, 239, 0.08),
    0 14px 30px rgba(0, 0, 0, 0.3);
  padding: clamp(14px, 2.3cqw, 20px);
}

.market-card__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: clamp(10px, 2cqw, 18px);
  border-bottom: 1px solid rgba(146, 154, 165, 0.18);
  padding-bottom: clamp(10px, 1.6cqw, 14px);
}

.market-card h3,
.market-card p,
.market-card dl {
  margin: 0;
}

.market-card h3 {
  color: #ffffff;
  font-size: clamp(0.98rem, 2.3cqw, 1.28rem);
  font-weight: 800;
  line-height: 1.05;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.48);
}

.market-card p {
  color: #9ca3b2;
  font-size: clamp(0.7rem, 1.25cqw, 0.8rem);
  font-weight: 500;
  line-height: 1.25;
  margin-top: 3px;
}

.market-card__identity {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: clamp(10px, 2.1cqw, 16px);
}

.market-card__identity > div {
  min-width: 0;
}

.market-card__icon,
.market-card__metric-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(146, 154, 165, 0.18);
  background: linear-gradient(145deg, rgba(43, 49, 57, 0.72), rgba(24, 26, 32, 0.94));
  color: var(--state-color);
  box-shadow:
    inset 0 1px 8px rgba(234, 236, 239, 0.08),
    0 12px 24px rgba(0, 0, 0, 0.26);
}

.market-card__icon {
  width: clamp(38px, 6cqw, 48px);
  height: clamp(38px, 6cqw, 48px);
  border-radius: 50%;
}

.market-card__icon svg {
  width: clamp(18px, 3.4cqw, 24px);
  height: clamp(18px, 3.4cqw, 24px);
}

.market-card__badge {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  min-height: 30px;
  border: 1px solid color-mix(in srgb, var(--state-color) 72%, transparent);
  border-radius: 10px;
  color: var(--state-color);
  font-size: clamp(0.68rem, 1.25cqw, 0.78rem);
  font-weight: 800;
  padding: 5px 8px;
}

.market-card__badge svg {
  width: clamp(14px, 2.6cqw, 17px);
  height: clamp(14px, 2.6cqw, 17px);
}

.market-card__focus {
  display: flex;
  min-width: 0;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(10px, 2cqw, 18px);
}

.market-card__focus div {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.market-card__focus span {
  color: #aeb5c4;
  font-size: clamp(0.7rem, 1.25cqw, 0.8rem);
  font-weight: 650;
}

.market-card__focus strong {
  color: var(--state-color);
  font-size: clamp(1.35rem, 3.8cqw, 1.95rem);
  font-weight: 900;
  line-height: 0.95;
  text-shadow: 0 0 20px color-mix(in srgb, var(--state-color) 22%, transparent);
}

.market-card__usage {
  display: grid;
  flex: 0 0 auto;
  justify-items: end;
  gap: 4px;
  color: #aeb5c4 !important;
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 1.25cqw, 0.8rem) !important;
  font-weight: 650;
  line-height: 1;
  text-align: right;
}

.market-card__usage strong {
  color: var(--state-color);
  font-family: var(--font-number);
  font-size: clamp(1.22rem, 3.4cqw, 1.72rem);
  font-variant-numeric: tabular-nums;
  font-weight: 900;
}

.market-card__usage span {
  color: #aeb5c4;
  font-size: clamp(0.68rem, 1.15cqw, 0.76rem);
}

.market-card__progress {
  display: grid;
  gap: 6px;
}

.market-card__track {
  height: clamp(8px, 1.35cqw, 11px);
  overflow: hidden;
  border-radius: 999px;
  background: #2b3139;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.34);
}

.market-card__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--state-color),
    color-mix(in srgb, var(--state-color) 88%, white)
  );
  box-shadow:
    0 0 16px color-mix(in srgb, var(--state-color) 32%, transparent),
    inset 0 -2px 0 rgba(0, 0, 0, 0.12);
}

.market-card__scale {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  color: #9ca3b2;
  font-family: var(--font-number);
  font-size: clamp(0.58rem, 0.9cqw, 0.66rem);
  font-variant-numeric: tabular-nums;
  font-weight: 650;
}

.market-card__scale span:nth-child(2) {
  text-align: center;
}

.market-card__scale span:nth-child(3) {
  text-align: right;
}

.market-card__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(10px, 2cqw, 16px);
  border-top: 1px solid rgba(146, 154, 165, 0.14);
  padding-top: clamp(10px, 1.6cqw, 13px);
}

.market-card__metrics > div {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: clamp(9px, 1.7cqw, 14px);
  row-gap: 3px;
  align-items: center;
}

.market-card__metrics > div + div {
  border-left: 1px solid rgba(146, 154, 165, 0.18);
  padding-left: clamp(12px, 2.4cqw, 20px);
}

.market-card__metric-icon {
  grid-row: span 2;
  width: clamp(32px, 5cqw, 38px);
  height: clamp(32px, 5cqw, 38px);
  border-radius: 10px;
}

.market-card__metric-icon svg {
  width: clamp(15px, 2.7cqw, 18px);
  height: clamp(15px, 2.7cqw, 18px);
}

.market-card dt {
  color: #aeb5c4;
  font-size: clamp(0.68rem, 1.15cqw, 0.76rem);
  font-weight: 650;
}

.market-card dd {
  margin: 0;
}

.market-card__metrics .money {
  font-size: clamp(0.68rem, 1.55cqw, 0.82rem);
  overflow-wrap: normal;
  word-break: normal;
}

.market-card[data-state='safe'] {
  --state-color: var(--color-state-safe);
}

.market-card[data-state='warning'] {
  --state-color: var(--color-primary);
}

.market-card[data-state='limitReached'] {
  --state-color: var(--color-primary);
}

.market-card[data-state='overLimit'] {
  --state-color: var(--color-state-over);
}

@media (max-width: 720px) {
  .market-card {
    min-height: 0;
  }

  .market-card__header,
  .market-card__focus {
    align-items: flex-start;
    flex-direction: column;
  }

  .market-card__badge {
    min-height: 52px;
  }

  .market-card__usage {
    justify-items: start;
    text-align: left;
  }

  .market-card__metrics {
    grid-template-columns: 1fr;
  }

  .market-card__metrics > div + div {
    border-top: 1px solid rgba(146, 154, 165, 0.18);
    border-left: 0;
    padding-top: 18px;
    padding-left: 0;
  }
}

@media (max-width: 440px) {
  .market-card__identity {
    align-items: flex-start;
    flex-direction: column;
  }

  .market-card__metric-icon {
    width: 54px;
    height: 54px;
    border-radius: 16px;
  }
}
</style>

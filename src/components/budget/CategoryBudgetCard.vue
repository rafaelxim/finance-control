<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, House, TrendingUp, Wallet } from 'lucide-vue-next'

import type { AllocationType } from '@/domain/budget/types'
import { formatBRL } from '@/domain/shared/money'

const props = defineProps<{
  name: string
  allocationType: AllocationType
  allocationValue: string
  computedLimit: string
}>()

const allocationDescription = computed(() =>
  props.allocationType === 'percentage'
    ? `${props.allocationValue}% do valor disponível mensal.`
    : 'Valor fixo mensal planejado.'
)
</script>

<template>
  <article class="category-card" :aria-label="name || 'Nova categoria'">
    <header class="category-card__header">
      <div class="category-card__identity">
        <span class="category-card__icon" aria-hidden="true">
          <House :size="36" :stroke-width="2.4" />
        </span>
        <div>
          <h3>{{ name || 'Nova categoria' }}</h3>
          <p>{{ allocationDescription }}</p>
        </div>
      </div>
      <span class="category-card__badge">
        <AlertTriangle :size="30" :stroke-width="2.3" aria-hidden="true" />
        Planejado
      </span>
    </header>

    <div class="category-card__focus">
      <div>
        <span>Restante</span>
        <strong class="money money--primary">{{ formatBRL(computedLimit) }}</strong>
      </div>
      <span class="category-card__usage">
        <strong>0%</strong>
        <span>usado</span>
      </span>
    </div>

    <div class="category-card__progress">
      <div class="category-card__track" aria-hidden="true">
        <span />
      </div>
      <div class="category-card__scale" aria-hidden="true">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>

    <dl class="category-card__metrics">
      <div>
        <span class="category-card__metric-icon" aria-hidden="true">
          <Wallet :size="28" :stroke-width="2.3" />
        </span>
        <dt>Limite</dt>
        <dd class="money money--secondary">{{ formatBRL(computedLimit) }}</dd>
      </div>
      <div>
        <span class="category-card__metric-icon" aria-hidden="true">
          <TrendingUp :size="28" :stroke-width="2.3" />
        </span>
        <dt>Gasto</dt>
        <dd class="money money--secondary">{{ formatBRL('0') }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.category-card {
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

.category-card__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: clamp(10px, 2cqw, 18px);
  border-bottom: 1px solid rgba(146, 154, 165, 0.18);
  padding-bottom: clamp(10px, 1.6cqw, 14px);
}

.category-card h3,
.category-card p,
.category-card dl {
  margin: 0;
}

.category-card h3 {
  color: #ffffff;
  font-size: clamp(0.98rem, 2.3cqw, 1.28rem);
  font-weight: 800;
  line-height: 1.05;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.48);
}

.category-card p {
  color: #9ca3b2;
  font-size: clamp(0.7rem, 1.25cqw, 0.8rem);
  font-weight: 500;
  line-height: 1.25;
  margin-top: 3px;
}

.category-card__identity {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: clamp(10px, 2.1cqw, 16px);
}

.category-card__identity > div {
  min-width: 0;
}

.category-card__icon,
.category-card__metric-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(146, 154, 165, 0.18);
  background: linear-gradient(145deg, rgba(43, 49, 57, 0.72), rgba(24, 26, 32, 0.94));
  color: var(--color-primary);
  box-shadow:
    inset 0 1px 8px rgba(234, 236, 239, 0.08),
    0 12px 24px rgba(0, 0, 0, 0.26);
}

.category-card__icon {
  width: clamp(38px, 6cqw, 48px);
  height: clamp(38px, 6cqw, 48px);
  border-radius: 50%;
}

.category-card__icon svg {
  width: clamp(18px, 3.4cqw, 24px);
  height: clamp(18px, 3.4cqw, 24px);
}

.category-card__badge {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  min-height: 30px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 72%, transparent);
  border-radius: 10px;
  color: var(--color-primary);
  font-size: clamp(0.68rem, 1.25cqw, 0.78rem);
  font-weight: 800;
  padding: 5px 8px;
}

.category-card__badge svg {
  width: clamp(14px, 2.6cqw, 17px);
  height: clamp(14px, 2.6cqw, 17px);
}

.category-card__focus {
  display: flex;
  min-width: 0;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(10px, 2cqw, 18px);
}

.category-card__focus div {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.category-card__focus span {
  color: #aeb5c4;
  font-size: clamp(0.7rem, 1.25cqw, 0.8rem);
  font-weight: 650;
}

.category-card__focus strong {
  color: var(--color-primary);
  font-size: clamp(1.35rem, 3.8cqw, 1.95rem);
  font-weight: 900;
  line-height: 0.95;
  text-shadow: 0 0 20px rgba(252, 213, 53, 0.22);
}

.category-card__usage {
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

.category-card__usage strong {
  color: var(--color-primary);
  font-family: var(--font-number);
  font-size: clamp(1.22rem, 3.4cqw, 1.72rem);
  font-variant-numeric: tabular-nums;
  font-weight: 900;
}

.category-card__usage span {
  color: #aeb5c4;
  font-size: clamp(0.68rem, 1.15cqw, 0.76rem);
}

.category-card__progress {
  display: grid;
  gap: 6px;
}

.category-card__track {
  height: clamp(8px, 1.35cqw, 11px);
  overflow: hidden;
  border-radius: 999px;
  background: #2b3139;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.34);
}

.category-card__track span {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-primary), #ffe066);
}

.category-card__scale {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  color: #9ca3b2;
  font-family: var(--font-number);
  font-size: clamp(0.58rem, 0.9cqw, 0.66rem);
  font-variant-numeric: tabular-nums;
  font-weight: 650;
}

.category-card__scale span:nth-child(2) {
  text-align: center;
}

.category-card__scale span:nth-child(3) {
  text-align: right;
}

.category-card__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(10px, 2cqw, 16px);
  border-top: 1px solid rgba(146, 154, 165, 0.14);
  padding-top: clamp(10px, 1.6cqw, 13px);
}

.category-card__metrics > div {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: clamp(9px, 1.7cqw, 14px);
  row-gap: 3px;
  align-items: center;
}

.category-card__metrics > div + div {
  border-left: 1px solid rgba(146, 154, 165, 0.18);
  padding-left: clamp(12px, 2.4cqw, 20px);
}

.category-card__metric-icon {
  grid-row: span 2;
  width: clamp(32px, 5cqw, 38px);
  height: clamp(32px, 5cqw, 38px);
  border-radius: 10px;
}

.category-card__metric-icon svg {
  width: clamp(15px, 2.7cqw, 18px);
  height: clamp(15px, 2.7cqw, 18px);
}

.category-card dt {
  color: #aeb5c4;
  font-size: clamp(0.68rem, 1.15cqw, 0.76rem);
  font-weight: 650;
}

.category-card dd {
  margin: 0;
}

.category-card__metrics .money {
  font-size: clamp(0.68rem, 1.55cqw, 0.82rem);
  overflow-wrap: normal;
  word-break: normal;
}

@media (max-width: 720px) {
  .category-card {
    min-height: 0;
  }

  .category-card__header,
  .category-card__focus {
    align-items: flex-start;
    flex-direction: column;
  }

  .category-card__badge {
    min-height: 52px;
  }

  .category-card__usage {
    justify-items: start;
    text-align: left;
  }

  .category-card__metrics {
    grid-template-columns: 1fr;
  }

  .category-card__metrics > div + div {
    border-top: 1px solid rgba(146, 154, 165, 0.18);
    border-left: 0;
    padding-top: 18px;
    padding-left: 0;
  }
}

@media (max-width: 440px) {
  .category-card__identity {
    align-items: flex-start;
    flex-direction: column;
  }

  .category-card__metric-icon {
    width: 54px;
    height: 54px;
    border-radius: 16px;
  }
}
</style>

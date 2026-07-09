<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

import type { FinancialEvolution } from '@/domain/balance/types'
import { toDecimal } from '@/domain/shared/money'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  evolution: FinancialEvolution[]
  title?: string
  subtitle?: string
  description?: string
}>()

const chartDescription = computed(
  () =>
    props.description ??
    'Acompanhe a curva histórica dos fechamentos mensais e compare o patrimônio líquido com ativos e dívidas.'
)

const chartData = computed(() => ({
  labels: props.evolution.map((entry) => entry.month),
  datasets: [
    {
      label: 'Patrimônio líquido',
      data: props.evolution.map((entry) => toDecimal(entry.netWorth).toNumber()),
      borderColor: '#fcd535',
      backgroundColor: '#fcd535',
      tension: 0.25
    },
    {
      label: 'Ativos',
      data: props.evolution.map((entry) => toDecimal(entry.assetsTotal).toNumber()),
      borderColor: '#0ecb81',
      backgroundColor: '#0ecb81',
      tension: 0.25
    },
    {
      label: 'Dívidas',
      data: props.evolution.map((entry) => toDecimal(entry.debtsTotal).toNumber()),
      borderColor: '#f6465d',
      backgroundColor: '#f6465d',
      tension: 0.25
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#eaecef'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#929aa5' },
      grid: { color: '#2b3139' }
    },
    y: {
      ticks: { color: '#929aa5' },
      grid: { color: '#2b3139' }
    }
  }
}
</script>

<template>
  <section
    class="evolution-chart panel panel--support panel--patrimony"
    aria-labelledby="evolution-chart-title"
  >
    <header class="evolution-chart__header">
      <div class="evolution-chart__heading">
        <p id="evolution-chart-title" class="evolution-chart__eyebrow">
          {{ title ?? 'Evolução patrimonial' }}
        </p>
        <h2>{{ subtitle ?? 'Patrimônio, ativos e dívidas' }}</h2>
        <p class="evolution-chart__description">{{ chartDescription }}</p>
      </div>
    </header>

    <div class="evolution-chart__shell" aria-label="Gráfico de evolução financeira">
      <div class="evolution-chart__canvas">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.evolution-chart {
  display: grid;
  gap: 18px;
  padding: 20px;
  border-color: color-mix(in srgb, var(--color-info) 34%, var(--color-border));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-info) 8%, transparent), transparent 42%),
    var(--color-surface);
}

.evolution-chart__header {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.evolution-chart__heading {
  display: grid;
  min-width: 0;
  gap: 6px;
}

.evolution-chart__eyebrow,
.evolution-chart__description {
  margin: 0;
}

.evolution-chart__eyebrow {
  color: var(--color-muted);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.evolution-chart h2 {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
}

.evolution-chart__description {
  max-width: 70ch;
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.45;
}

.evolution-chart__shell {
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-bg) 52%, var(--color-surface));
  padding: 14px;
}

.evolution-chart__canvas {
  height: 260px;
}

@media (max-width: 760px) {
  .evolution-chart__header {
    flex-direction: column;
  }

  .evolution-chart__canvas {
    height: 220px;
  }
}
</style>

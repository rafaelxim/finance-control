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
}>()

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
  <section class="evolution-chart panel" aria-label="Gráfico de evolução financeira">
    <Line :data="chartData" :options="chartOptions" />
  </section>
</template>

<style scoped>
.evolution-chart {
  height: 320px;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gauge,
  Settings,
  Tags,
  WalletCards
} from 'lucide-vue-next'

import type { MonthKey } from '@/domain/shared/types'
import { useProfileStore } from '@/stores/profile.store'

const links = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/orcamento', label: 'Orçamento', icon: Tags },
  { to: '/despesas', label: 'Despesas', icon: WalletCards },
  { to: '/balanco', label: 'Balanço', icon: CreditCard },
  { to: '/evolucao', label: 'Evolução', icon: BarChart3 },
  { to: '/configuracoes', label: 'Configurações', icon: Settings }
]

const profileStore = useProfileStore()
const monthUpdating = ref(false)
const activeMonth = computed(() => profileStore.activeMonth)
const activeMonthLabel = computed(() => {
  const [year, month] = activeMonth.value.split('-').map(Number)
  const date = new Date(year, month - 1)

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(date)
})

onMounted(() => {
  void profileStore.load()
})

async function saveActiveMonth(month: MonthKey) {
  if (monthUpdating.value) return
  monthUpdating.value = true
  try {
    await profileStore.setActiveMonth(month)
  } finally {
    monthUpdating.value = false
  }
}

function shiftMonth(offset: number) {
  const [year, month] = activeMonth.value.split('-').map(Number)
  const next = new Date(year, month - 1 + offset)
  const nextMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`
  void saveActiveMonth(nextMonth as MonthKey)
}

function updateMonth(value: string) {
  if (!value) return
  void saveActiveMonth(value as MonthKey)
}
</script>

<template>
  <div class="app-shell">
    <aside class="app-shell__sidebar">
      <div class="brand">
        <span class="brand__mark">FC</span>
        <span class="brand__text">Finance Control</span>
      </div>

      <section class="month-context" aria-label="Mês ativo global">
        <div class="month-context__label">
          <CalendarDays :size="16" aria-hidden="true" />
          <span>Mês ativo</span>
        </div>
        <div class="month-context__controls">
          <button
            class="month-context__step"
            type="button"
            aria-label="Mês anterior"
            title="Mês anterior"
            :disabled="monthUpdating"
            @click="shiftMonth(-1)"
          >
            <ChevronLeft :size="16" aria-hidden="true" />
          </button>
          <label class="month-context__field" for="global-active-month">
            <span>{{ activeMonthLabel }}</span>
            <input
              id="global-active-month"
              type="month"
              :value="activeMonth"
              aria-label="Selecionar mês ativo"
              :disabled="monthUpdating"
              @input="updateMonth(($event.target as HTMLInputElement).value)"
              @change="updateMonth(($event.target as HTMLInputElement).value)"
            />
          </label>
          <button
            class="month-context__step"
            type="button"
            aria-label="Próximo mês"
            title="Próximo mês"
            :disabled="monthUpdating"
            @click="shiftMonth(1)"
          >
            <ChevronRight :size="16" aria-hidden="true" />
          </button>
        </div>
      </section>

      <nav class="nav-list" aria-label="Navegação principal">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
          <component :is="link.icon" :size="18" aria-hidden="true" />
          <span>{{ link.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="app-shell__main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gauge,
  Menu,
  Settings,
  Tags,
  WalletCards,
  X
} from 'lucide-vue-next'

import type { MonthKey } from '@/domain/shared/types'
import { useProfileStore } from '@/stores/profile.store'
import logoUrl from '@/assets/logo.png'

const links = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/orcamento', label: 'Orçamento', icon: Tags },
  { to: '/despesas', label: 'Despesas', icon: WalletCards },
  { to: '/balanco', label: 'Balanço', icon: CreditCard },
  { to: '/configuracoes', label: 'Configurações', icon: Settings }
]

const profileStore = useProfileStore()
const monthUpdating = ref(false)
const mobileMenuOpen = ref(false)
const activeMonth = computed(() => profileStore.activeMonth)
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

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="app-shell">
    <header class="mobile-header">
      <button
        class="mobile-header__menu"
        type="button"
        :aria-expanded="mobileMenuOpen"
        aria-controls="mobile-navigation"
        aria-label="Abrir menu"
        @click="mobileMenuOpen = true"
      >
        <Menu :size="22" aria-hidden="true" />
      </button>
      <img class="mobile-header__logo" :src="logoUrl" alt="OrganizaGrana" />
      <span class="mobile-header__spacer" aria-hidden="true"></span>
    </header>

    <aside class="app-shell__sidebar">
      <div class="brand">
        <img class="brand__logo" :src="logoUrl" alt="OrganizaGrana" />
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

    <Teleport to="body">
      <Transition name="mobile-menu">
        <div
          v-if="mobileMenuOpen"
          id="mobile-navigation"
          class="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          <header class="mobile-menu__header">
            <img class="mobile-menu__logo" :src="logoUrl" alt="OrganizaGrana" />
            <button
              class="mobile-menu__close"
              type="button"
              aria-label="Fechar menu"
              @click="closeMobileMenu"
            >
              <X :size="24" aria-hidden="true" />
            </button>
          </header>

          <section class="month-context mobile-menu__month" aria-label="Mês ativo global">
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
              <label class="month-context__field" for="mobile-active-month">
                <input
                  id="mobile-active-month"
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

          <nav class="mobile-menu__nav" aria-label="Navegação principal mobile">
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="mobile-menu__link"
              @click="closeMobileMenu"
            >
              <component :is="link.icon" :size="22" aria-hidden="true" />
              <span>{{ link.label }}</span>
            </RouterLink>
          </nav>
        </div>
      </Transition>
    </Teleport>

    <main class="app-shell__main">
      <RouterView />
    </main>
  </div>
</template>

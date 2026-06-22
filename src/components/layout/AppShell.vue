<script setup lang="ts">
import { BarChart3, CreditCard, Gauge, Settings, Tags, WalletCards } from 'lucide-vue-next'

const links = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/orcamento', label: 'Orçamento', icon: Tags },
  { to: '/despesas', label: 'Despesas', icon: WalletCards },
  { to: '/balanco', label: 'Balanço', icon: CreditCard },
  { to: '/evolucao', label: 'Evolução', icon: BarChart3 },
  { to: '/configuracoes', label: 'Configurações', icon: Settings }
]
</script>

<template>
  <div class="app-shell">
    <aside class="app-shell__sidebar">
      <div class="brand">
        <span class="brand__mark">FC</span>
        <span class="brand__text">Finance Control</span>
      </div>

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

import { createRouter, createWebHistory } from 'vue-router'

import BalancePage from '@/pages/BalancePage.vue'
import BudgetPage from '@/pages/BudgetPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import EvolutionPage from '@/pages/EvolutionPage.vue'
import ExpensesPage from '@/pages/ExpensesPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardPage },
    { path: '/dashboard', redirect: '/' },
    { path: '/orcamento', name: 'budget', component: BudgetPage },
    { path: '/despesas', name: 'expenses', component: ExpensesPage },
    { path: '/balanco', name: 'balance', component: BalancePage },
    { path: '/evolucao', name: 'evolution', component: EvolutionPage },
    { path: '/configuracoes', name: 'settings', component: SettingsPage }
  ]
})

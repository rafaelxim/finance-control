import { createRouter, createWebHistory } from 'vue-router'

import BalancePage from '@/pages/BalancePage.vue'
import BudgetPage from '@/pages/BudgetPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import ExpensesPage from '@/pages/ExpensesPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import { useAuthStore } from '@/stores/auth.store'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginPage, meta: { public: true } },
    { path: '/', name: 'dashboard', component: DashboardPage },
    { path: '/dashboard', redirect: '/' },
    { path: '/orcamento', name: 'budget', component: BudgetPage },
    { path: '/despesas', name: 'expenses', component: ExpensesPage },
    { path: '/balanco', name: 'balance', component: BalancePage },
    { path: '/evolucao', redirect: '/' },
    { path: '/configuracoes', name: 'settings', component: SettingsPage }
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.initialize()

  if (to.meta.public) {
    return authStore.user ? { path: '/' } : true
  }

  if (!authStore.user) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  return true
})

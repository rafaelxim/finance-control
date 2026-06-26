import { expect, test } from '@playwright/test'

const routes = [
  { path: '/', heading: 'Dashboard' },
  { path: '/orcamento', heading: 'Orçamento' },
  { path: '/despesas', heading: 'Despesas' },
  { path: '/balanco', heading: 'Balanço' },
  { path: '/evolucao', heading: 'Evolução' },
  { path: '/configuracoes', heading: 'Configurações' }
]

for (const route of routes) {
  test(`opens ${route.path} without authentication`, async ({ page }) => {
    await page.goto(route.path)

    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible()
    await expect(page.getByText(/Entrar|Login|Cadastro|Sair/i)).toHaveCount(0)
  })
}

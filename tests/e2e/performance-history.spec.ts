import { expect, test } from '@playwright/test'

import {
  FIVE_YEAR_CURRENT_MONTH,
  FIVE_YEAR_FIRST_CATEGORY_NAME,
  seedFiveYearHistory
} from '../fixtures/five-year-history'

test('keeps dashboard and evolution responsive with five years of local history', async ({
  page
}) => {
  await seedFiveYearHistory(page)

  const dashboardStartedAt = Date.now()
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Resumo do orçamento' })).toContainText(
    /R\$\s*10\.475,00/
  )
  await expect(page.getByRole('article', { name: /Categoria 01/ })).toContainText('Seguro')
  expect(Date.now() - dashboardStartedAt).toBeLessThan(1000)

  await page.goto('/orcamento')
  await expect(page.locator('#budget-month')).toHaveValue(FIVE_YEAR_CURRENT_MONTH)
  await expect(page.getByText(FIVE_YEAR_FIRST_CATEGORY_NAME).first()).toBeVisible()

  await page.goto('/evolucao')
  await expect(page.getByRole('heading', { name: 'Evolução' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Gráfico de evolução financeira' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Tabela de evolução financeira' })).toContainText(
    FIVE_YEAR_CURRENT_MONTH
  )
  await expect(page.locator('canvas')).toBeVisible()
})

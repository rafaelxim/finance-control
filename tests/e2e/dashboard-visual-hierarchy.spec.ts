import { expect, test } from '@playwright/test'

import { FIVE_YEAR_CURRENT_MONTH, seedFiveYearHistory } from '../fixtures/five-year-history'

async function forceLatestBalanceDecline(page: Parameters<typeof seedFiveYearHistory>[0]) {
  await page.goto('/balanco')
  await page.locator('#balance-month').fill(FIVE_YEAR_CURRENT_MONTH)

  for (let index = 0; index < 12; index += 1) {
    await page.locator(`#balance-item-amount-${index}`).fill('0.00')
  }

  await page.getByRole('button', { name: 'Salvar fechamento' }).click()
  await expect(page.getByText('Fechamento salvo com sucesso.')).toBeVisible()
}

test('redirects /dashboard to the canonical dashboard route', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})

test('shows the top financial summary before detailed sections', async ({ page }) => {
  await seedFiveYearHistory(page)
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto('/')

  const summary = page.getByRole('region', { name: /Resumo principal/ })
  await expect(summary).toBeVisible()
  await expect(summary).toContainText('Patrimônio líquido')
  await expect(summary).toContainText('Baseado no último balanço')
  await expect(summary).toContainText('Atualizar balanço')

  const summaryBox = await summary.boundingBox()
  const patrimonyBox = await page.getByRole('region', { name: 'Patrimônio' }).boundingBox()
  const budgetBox = await page.getByRole('region', { name: 'Orçamento do mês' }).boundingBox()

  expect(summaryBox?.y).toBeLessThanOrEqual(patrimonyBox?.y ?? Number.POSITIVE_INFINITY)
  expect(summaryBox?.y).toBeLessThanOrEqual(budgetBox?.y ?? Number.POSITIVE_INFINITY)
  expect(summaryBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThan(190)
})

test('uses budget fallback when no balance snapshot exists', async ({ page }) => {
  await page.goto('/')

  const summary = page.getByRole('region', { name: /Resumo principal/ })
  await expect(summary).toContainText('Saldo disponível do mês')
  await expect(summary).toContainText('Saldo disponível')
  await expect(summary).toContainText('Baseado no orçamento do mês')
  await expect(summary).not.toContainText('Baseado no último balanço')
})

test('separates patrimony and budget sections', async ({ page }) => {
  await seedFiveYearHistory(page)
  await page.goto('/')

  await expect(page.getByRole('region', { name: 'Patrimônio' })).toContainText('Ativos')
  await expect(page.getByRole('region', { name: 'Patrimônio' })).toContainText('Dívidas')
  await expect(page.getByRole('region', { name: 'Orçamento do mês' })).toContainText('Disponível')
  await expect(page.getByRole('region', { name: 'Orçamento do mês' })).toContainText('Excedente')
  await expect(page.locator('.panel--patrimony')).toBeVisible()
  await expect(page.locator('.panel--budget')).toBeVisible()
  await expect(page.locator('.panel--patrimony .metric--featured')).toHaveCount(2)
  await expect(page.locator('.panel--budget .metric--featured')).toHaveCount(2)
})

test('keeps category tracking visible above the desktop fold', async ({ page }) => {
  await seedFiveYearHistory(page)
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto('/')

  const categories = page.getByRole('region', { name: 'Uso por categoria' })
  await expect(categories).toBeVisible()

  const categoryBox = await categories.boundingBox()
  const viewport = page.viewportSize()
  expect(categoryBox?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(viewport?.height ?? 0)
})

test('uses cause-oriented wording for negative patrimony variation', async ({ page }) => {
  await seedFiveYearHistory(page)
  await forceLatestBalanceDecline(page)
  await page.goto('/')

  const summary = page.getByRole('region', { name: /Resumo principal/ })
  await expect(summary).toContainText('Patrimônio caiu')
  await expect(summary).toContainText('A variação mais recente está negativa.')
  await expect(summary).toContainText('-R$')
})

test('routes the contextual dashboard action to the relevant workflow', async ({ page }) => {
  await seedFiveYearHistory(page)
  await page.goto('/')

  await page.getByRole('link', { name: 'Atualizar balanço' }).click()

  await expect(page).toHaveURL(/\/balanco$/)
})

test('keeps category title and sidebar destinations accurate', async ({ page }) => {
  await seedFiveYearHistory(page)
  await page.goto('/')

  await expect(page.getByRole('region', { name: 'Uso por categoria' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Uso por categoria' })).not.toContainText(
    'Categorias em atenção'
  )

  const navigation = page.getByRole('navigation', { name: 'Navegação principal' })
  await expect(navigation.getByRole('link', { name: 'Dashboard', exact: true })).toHaveAttribute(
    'href',
    '/'
  )
  await expect(navigation.getByRole('link', { name: 'Orçamento', exact: true })).toHaveAttribute(
    'href',
    '/orcamento'
  )
  await expect(navigation.getByRole('link', { name: 'Despesas', exact: true })).toHaveAttribute(
    'href',
    '/despesas'
  )
})

test('keeps dashboard monetary values readable on mobile width', async ({ page }) => {
  await seedFiveYearHistory(page)
  await page.setViewportSize({ width: 360, height: 780 })
  await page.goto('/')

  await expect(page.getByRole('region', { name: /Resumo principal/ })).toBeVisible()
  await expect(page.getByRole('article', { name: /Categoria 01/ })).toContainText(/% usado/)

  const overflowing = await page
    .locator('main')
    .evaluate((main) => main.scrollWidth > main.clientWidth)
  expect(overflowing).toBe(false)
})

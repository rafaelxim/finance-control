import { expect, test } from '@playwright/test'

import { seedFiveYearHistory } from '../fixtures/five-year-history'

test('redirects /dashboard to the canonical dashboard route', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})

test('shows the top financial summary before detailed sections', async ({ page }) => {
  await seedFiveYearHistory(page)
  await page.goto('/')

  const summary = page.getByRole('region', { name: /Resumo principal/ })
  await expect(summary).toBeVisible()
  await expect(summary).toContainText('Patrimônio líquido')
  await expect(summary).toContainText('Baseado no último balanço')

  const summaryBox = await summary.boundingBox()
  const patrimonyBox = await page.getByRole('region', { name: 'Patrimônio' }).boundingBox()
  const budgetBox = await page.getByRole('region', { name: 'Orçamento do mês' }).boundingBox()

  expect(summaryBox?.y).toBeLessThan(patrimonyBox?.y ?? Number.POSITIVE_INFINITY)
  expect(summaryBox?.y).toBeLessThan(budgetBox?.y ?? Number.POSITIVE_INFINITY)
})

test('uses budget fallback when no balance snapshot exists', async ({ page }) => {
  await page.goto('/')

  const summary = page.getByRole('region', { name: /Resumo principal/ })
  await expect(summary).toContainText('Saldo disponível do mês')
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

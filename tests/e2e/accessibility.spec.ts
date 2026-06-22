import { expect, test } from '@playwright/test'

import { seedFiveYearHistory } from '../fixtures/five-year-history'

const routes = [
  { path: '/', heading: 'Dashboard' },
  { path: '/orcamento', heading: 'Orçamento' },
  { path: '/despesas', heading: 'Despesas' },
  { path: '/balanco', heading: 'Balanço' },
  { path: '/evolucao', heading: 'Evolução' },
  { path: '/configuracoes', heading: 'Configurações' }
]

test('exposes consistent navigation, headings, labels, and non-color state text', async ({
  page
}) => {
  await seedFiveYearHistory(page)

  for (const route of routes) {
    await page.goto(route.path)
    const navigation = page.getByRole('navigation', { name: 'Navegação principal' })
    await expect(navigation).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()

    for (const label of [
      'Dashboard',
      'Orçamento',
      'Despesas',
      'Balanço',
      'Evolução',
      'Configurações'
    ]) {
      await expect(navigation.getByRole('link', { name: label, exact: true })).toBeVisible()
    }

    const unlabeledFields = await page.locator('input, select, textarea').evaluateAll((fields) =>
      fields
        .filter((field) => {
          const id = field.getAttribute('id')
          const hasLabel = id ? Boolean(document.querySelector(`label[for="${id}"]`)) : false
          return (
            !hasLabel &&
            !field.getAttribute('aria-label') &&
            !field.getAttribute('aria-labelledby') &&
            !field.getAttribute('title')
          )
        })
        .map((field) => field.getAttribute('id') ?? field.tagName)
    )
    expect(unlabeledFields).toEqual([])

    const imagesWithoutAlt = await page
      .locator('img')
      .evaluateAll((images) => images.filter((image) => !image.hasAttribute('alt')).length)
    expect(imagesWithoutAlt).toBe(0)
  }

  await page.goto('/')
  await expect(page.getByRole('region', { name: /Resumo principal/ })).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Atualizar balanço|Ajustar orçamento/ })
  ).toBeVisible()
  await expect(page.getByRole('region', { name: 'Patrimônio' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Orçamento do mês' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Uso por categoria' })).toBeVisible()
  await expect(page.getByRole('article', { name: /Categoria 01/ })).toContainText(
    /Seguro|Atenção|Limite atingido|Limite excedido/
  )

  const activeIndicatorWidth = await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Dashboard', exact: true })
    .evaluate((link) => Number.parseFloat(getComputedStyle(link, '::before').width))
  expect(activeIndicatorWidth).toBeGreaterThan(0)
})

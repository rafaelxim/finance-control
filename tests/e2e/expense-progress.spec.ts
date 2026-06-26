import { expect, test } from '@playwright/test'

test('tracks expenses and updates category progress cards', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          ;(window as Window & { __copiedCategoryUsage?: string }).__copiedCategoryUsage = text
        }
      }
    })
  })

  await page.goto('/orcamento')
  await page.getByRole('button', { name: 'Salvar orçamento' }).click()
  await expect(page.getByText('Orçamento salvo com sucesso.')).toBeVisible()

  await page.goto('/despesas')
  await expect(page.getByRole('heading', { name: 'Despesas' })).toBeVisible()

  await page.getByLabel('Valor').fill('75,00')
  await page.locator('#expense-category').selectOption({ label: 'Comida' })
  await page.getByRole('button', { name: 'Registrar despesa' }).click()
  await expect(page.getByRole('region', { name: 'Lista de despesas' })).toContainText(/R\$\s*75,00/)

  await page.getByRole('button', { name: 'Copiar uso das categorias' }).click()
  await expect(page.getByText('Texto copiado')).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as Window & { __copiedCategoryUsage?: string }).__copiedCategoryUsage
      )
    )
    .toContain('Uso por categoria')
  expect(
    await page.evaluate(
      () => (window as Window & { __copiedCategoryUsage?: string }).__copiedCategoryUsage
    )
  ).toContain('*Comida*')

  await page.goto('/')
  await expect(page.getByLabel('Comida: Seguro')).toBeVisible()
  await expect(page.getByText(/R\$\s*75,00/)).toBeVisible()
  await expect(page.getByText(/R\$\s*225,00/)).toBeVisible()
  await expect(page.getByLabel('Comida: Seguro')).toContainText('25% usado')

  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Copiar uso das categorias' }).click()
  await expect(page).toHaveURL('/')
  expect(
    await page.evaluate(
      () => (window as Window & { __copiedCategoryUsage?: string }).__copiedCategoryUsage
    )
  ).toContain('Total gasto: *R$')

  await page.goto('/despesas')
  await page.getByLabel('Valor').fill('250,00')
  await page.locator('#expense-category').selectOption({ label: 'Comida' })
  await page.getByRole('button', { name: 'Registrar despesa' }).click()
  await expect(page.getByRole('region', { name: 'Lista de despesas' })).toContainText(
    /R\$\s*250,00/
  )

  await page.goto('/')
  await expect(page.getByLabel('Comida: Limite excedido')).toBeVisible()
  await expect(page.getByText(/R\$\s*325,00/)).toBeVisible()
  await expect(page.getByText(/-R\$\s*25,00/)).toBeVisible()
  await expect(page.getByLabel('Comida: Limite excedido')).toContainText('108% usado')
  await expect(page.getByLabel('Comida: Limite excedido')).toContainText('Déficit')
})

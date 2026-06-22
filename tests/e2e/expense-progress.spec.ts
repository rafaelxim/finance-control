import { expect, test } from '@playwright/test'

test('tracks expenses and updates category progress cards', async ({ page }) => {
  await page.goto('/orcamento')
  await page.getByRole('button', { name: 'Salvar orçamento' }).click()
  await expect(page.getByText('Orçamento salvo com sucesso.')).toBeVisible()

  await page.goto('/despesas')
  await expect(page.getByRole('heading', { name: 'Despesas' })).toBeVisible()

  await page.getByLabel('Valor').fill('75,00')
  await page.locator('#expense-category').selectOption({ label: 'Comida' })
  await page.getByRole('button', { name: 'Registrar despesa' }).click()
  await expect(page.getByRole('region', { name: 'Lista de despesas' })).toContainText(/R\$\s*75,00/)

  await page.goto('/')
  await expect(page.getByLabel('Comida: Seguro')).toBeVisible()
  await expect(page.getByText(/R\$\s*75,00/)).toBeVisible()
  await expect(page.getByText(/R\$\s*225,00/)).toBeVisible()
  await expect(page.getByLabel('Comida: Seguro')).toContainText('25% usado')

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

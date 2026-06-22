import { expect, test } from '@playwright/test'

test('preserves previous month categories when current month is changed', async ({ page }) => {
  await page.goto('/orcamento')

  await page.locator('#budget-month').fill('2026-05')
  await page.getByRole('button', { name: 'Salvar orçamento' }).click()
  await expect(page.getByText('Orçamento salvo com sucesso.')).toBeVisible()

  await page.locator('#budget-month').fill('2026-06')
  await page.locator('#category-name-1').fill('Mercado')
  await page.getByRole('button', { name: 'Salvar orçamento' }).click()
  await expect(page.getByText('Orçamento salvo com sucesso.')).toBeVisible()

  await page.locator('#budget-month').fill('2026-05')
  await expect(page.locator('#category-name-1')).toHaveValue('Comida')

  await page.locator('#budget-month').fill('2026-06')
  await expect(page.locator('#category-name-1')).toHaveValue('Mercado')
})

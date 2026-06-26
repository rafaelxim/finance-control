import { expect, test } from '@playwright/test'

test('creates a monthly balance snapshot with assets, debts, and net worth', async ({ page }) => {
  await page.goto('/balanco')

  await expect(page.getByRole('heading', { name: 'Balanço' })).toBeVisible()
  await page.locator('#balance-month').fill('2027-08')
  await page.locator('#balance-item-amount-0').fill('7000,00')
  await page.locator('#balance-item-amount-1').fill('1200,00')

  await page.getByRole('button', { name: 'Salvar fechamento' }).click()
  await expect(page.getByText('Fechamento salvo com sucesso.')).toBeVisible()

  const summary = page.getByRole('region', { name: 'Resumo patrimonial' })
  await expect(summary).toContainText(/R\$\s*7\.000,00/)
  await expect(summary).toContainText(/R\$\s*1\.200,00/)
  await expect(summary).toContainText(/R\$\s*5\.800,00/)
})

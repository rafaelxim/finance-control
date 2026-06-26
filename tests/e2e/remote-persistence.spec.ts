import { expect, test } from '@playwright/test'

test('keeps remote data after browser-local storage is cleared', async ({ page }) => {
  await page.goto('/configuracoes')
  await page.getByRole('button', { name: 'Limpar dados remotos' }).click()
  await expect(page.getByText('Dados remotos limpos.')).toBeVisible()

  await page.goto('/orcamento')
  await page.locator('#budget-month').fill('2026-12')
  await page.locator('#available-amount').fill('4321.00')
  await page.getByRole('button', { name: 'Salvar orçamento' }).click()
  await expect(page.getByText('Orçamento salvo com sucesso.')).toBeVisible()

  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  await page.reload()

  await page.locator('#budget-month').fill('2026-12')
  await expect(page.locator('#available-amount')).toHaveValue('4321.00')
})

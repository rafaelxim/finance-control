import { expect, test } from '@playwright/test'

test('imports latest balance item names and types when opening an empty month', async ({
  page
}) => {
  await page.goto('/balanco')

  await page.locator('#balance-month').fill('2027-06')
  await page.locator('#balance-item-name-0').fill('Conta Nubank')
  await page.locator('#balance-item-kind-0').selectOption('asset')
  await page.locator('#balance-item-amount-0').fill('7000,00')
  await page.locator('#balance-item-name-1').fill('Cartao Inter')
  await page.locator('#balance-item-kind-1').selectOption('debt')
  await page.locator('#balance-item-amount-1').fill('1200,00')
  await page.getByRole('button', { name: 'Salvar fechamento' }).click()
  await expect(page.getByText('Fechamento salvo com sucesso.')).toBeVisible()

  await page.locator('#balance-month').fill('2027-07')

  await expect(page.locator('#balance-item-name-0')).toHaveValue('Conta Nubank')
  await expect(page.locator('#balance-item-kind-0')).toHaveValue('asset')
  await expect(page.locator('#balance-item-amount-0')).toHaveValue('0.00')
  await expect(page.locator('#balance-item-name-1')).toHaveValue('Cartao Inter')
  await expect(page.locator('#balance-item-kind-1')).toHaveValue('debt')
  await expect(page.locator('#balance-item-amount-1')).toHaveValue('0.00')
})

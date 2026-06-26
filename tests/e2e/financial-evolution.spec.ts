import { expect, test } from '@playwright/test'

async function saveSnapshot(
  page: import('@playwright/test').Page,
  month: string,
  amounts: string[]
) {
  await page.goto('/balanco')
  await page.locator('#global-active-month').fill(month)
  await page.locator('#balance-item-amount-0').fill(amounts[0])
  await page.locator('#balance-item-amount-1').fill(amounts[1])
  await page.getByRole('button', { name: 'Salvar fechamento' }).click()
  await expect(page.getByText('Fechamento salvo com sucesso.')).toBeVisible()
}

test('shows financial evolution across monthly snapshots', async ({ page }) => {
  await saveSnapshot(page, '2026-05', ['5000,00', '0,00'])
  await saveSnapshot(page, '2026-06', ['7000,00', '1200,00'])

  await page.goto('/evolucao')

  await expect(page.getByRole('heading', { name: 'Evolução' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Tabela de evolução financeira' })).toContainText(
    '2026-05'
  )
  await expect(page.getByRole('region', { name: 'Tabela de evolução financeira' })).toContainText(
    '2026-06'
  )
  await expect(page.getByRole('region', { name: 'Tabela de evolução financeira' })).toContainText(
    /R\$\s*800,00/
  )
  await expect(page.getByRole('region', { name: 'Gráfico de evolução financeira' })).toBeVisible()
})

import { expect, test } from '@playwright/test'

test('exports and imports remote finance data', async ({ page }) => {
  await page.goto('/configuracoes')
  await page.getByRole('button', { name: 'Limpar dados remotos' }).click()
  await expect(page.getByText('Dados remotos limpos.')).toBeVisible()

  await page.goto('/orcamento')
  await page.locator('#global-active-month').fill('2026-06')
  await page.getByRole('button', { name: 'Salvar orçamento' }).click()
  await expect(page.getByText('Orçamento salvo com sucesso.')).toBeVisible()

  await page.goto('/configuracoes')
  await page.getByRole('button', { name: 'Exportar JSON' }).click()
  await expect(page.locator('#export-json')).toHaveValue(/monthlyBudgets/)
  const exported = await page.locator('#export-json').inputValue()
  expect(exported).toContain('monthlyBudgets')
  expect(exported).not.toContain('data:image')

  await page.getByRole('button', { name: 'Limpar dados remotos' }).click()
  await expect(page.getByText('Dados remotos limpos.')).toBeVisible()

  await page.locator('#import-json').fill(exported)
  await page.getByRole('button', { name: 'Importar JSON' }).click()
  await expect(page.getByText('Importação concluída.')).toBeVisible()

  await page.goto('/orcamento')
  await page.locator('#global-active-month').fill('2026-06')
  await expect(page.locator('#category-name-0')).toHaveValue('Aluguel')
})

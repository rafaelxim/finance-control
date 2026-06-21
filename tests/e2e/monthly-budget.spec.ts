import { expect, test } from '@playwright/test'

test('creates a monthly budget with fixed category cards', async ({ page }) => {
  await page.goto('/orcamento')

  await expect(page.getByRole('heading', { name: 'Orçamento mensal' })).toBeVisible()
  await expect(page.getByText('Aluguel')).toBeVisible()
  await expect(page.getByText('Comida')).toBeVisible()
  await expect(page.getByText('Lazer')).toBeVisible()
  await expect(page.getByText(/R\$\s*200,00/)).toBeVisible()

  await page.getByRole('button', { name: 'Salvar orçamento' }).click()
  await expect(page.getByText('Orçamento salvo com sucesso.')).toBeVisible()
})

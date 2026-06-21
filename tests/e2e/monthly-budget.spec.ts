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

  await page.getByLabel('Valor mensal disponível').fill('1500,999')
  await page.getByLabel('Valor mensal disponível').blur()
  await expect(page.getByLabel('Valor mensal disponível')).toHaveValue('1500.99')
  await expect(page.getByRole('region', { name: 'Resumo do orçamento' })).toContainText(
    /R\$\s*1\.000,00/
  )
})

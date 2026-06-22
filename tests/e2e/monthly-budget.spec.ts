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

test('recalculates percentage allocations when monthly amount changes before saving', async ({
  page
}) => {
  await page.goto('/orcamento')

  await page.getByRole('button', { name: 'Adicionar categoria' }).click()
  await page.locator('#category-name-3').fill('Investir')
  await page.locator('#category-type-3').selectOption('percentage')
  await page.locator('#category-percent-3').fill('10')

  await expect(page.getByRole('article', { name: /Investir/ })).toContainText(/R\$\s*100,00/)

  await page.getByLabel('Valor mensal disponível').fill('1500,00')
  await expect(page.getByRole('article', { name: /Investir/ })).toContainText(/R\$\s*150,00/)
  await expect(page.getByRole('article', { name: /Aluguel/ })).toContainText(/R\$\s*400,00/)
})

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { expect, test } from '@playwright/test'

test('navigates migrated backup months after remote import', async ({ page }) => {
  const backup = readFileSync(join(process.cwd(), 'backup.json'), 'utf8')

  await page.goto('/configuracoes')
  await page.locator('#import-json').fill(backup)
  await page.getByRole('button', { name: 'Importar JSON' }).click()
  await expect(page.getByText('Importação concluída.')).toBeVisible()

  await page.goto('/orcamento')
  await page.locator('#global-active-month').fill('2025-08')
  await expect(page.locator('#category-name-0')).not.toHaveValue('')

  await page.goto('/balanco')
  await page.locator('#global-active-month').fill('2025-08')
  await expect(page.getByRole('heading', { name: 'Balanço' })).toBeVisible()
})

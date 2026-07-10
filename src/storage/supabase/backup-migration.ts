import type { DataExportPayload } from '@/domain/shared/data-export'
import {
  dataExportPayloadSchema,
  validateDataExportPayload
} from '@/domain/shared/data-export.validation'

import {
  toBalanceItemRow,
  toBalanceSnapshotRow,
  toBudgetCategoryRow,
  toExpenseRow,
  toMonthlyBudgetRow,
  toProfileRow,
  toVisualPreferencesRow
} from './mappers'
import { assertRemoteSuccess, getAuthenticatedUserId, supabaseClient } from './query-helpers'

export interface BackupMigrationResult {
  counts: {
    monthlyBudgets: number
    budgetCategories: number
    expenses: number
    balanceSnapshots: number
    balanceItems: number
  }
}

export function validateBackupForMigration(input: unknown): DataExportPayload {
  const errors = validateDataExportPayload(input)
  if (errors.length) {
    throw new Error(`Backup inválido: ${errors.join('; ')}`)
  }
  return dataExportPayloadSchema.parse(input)
}

export async function migrateBackupToSupabase(input: unknown): Promise<BackupMigrationResult> {
  const payload = validateBackupForMigration(input)
  const client = supabaseClient()
  const userId = await getAuthenticatedUserId(client)

  if (payload.profile) {
    const { error } = await client.from('profiles').upsert(toProfileRow(payload.profile))
    assertRemoteSuccess(error, 'Falha ao migrar perfil')
  }

  const visualTimestamp = payload.exportedAt
  const { error: visualError } = await client
    .from('visual_preferences')
    .upsert(toVisualPreferencesRow(payload.visualPreferences, visualTimestamp, userId), {
      onConflict: 'user_id'
    })
  assertRemoteSuccess(visualError, 'Falha ao migrar preferências visuais')

  if (payload.monthlyBudgets.length) {
    const { error } = await client
      .from('monthly_budgets')
      .upsert(payload.monthlyBudgets.map(toMonthlyBudgetRow), { onConflict: 'id' })
    assertRemoteSuccess(error, 'Falha ao migrar orçamentos')
  }

  if (payload.budgetCategories.length) {
    const { error } = await client
      .from('budget_categories')
      .upsert(payload.budgetCategories.map(toBudgetCategoryRow), { onConflict: 'id' })
    assertRemoteSuccess(error, 'Falha ao migrar categorias')
  }

  if (payload.expenses.length) {
    const { error } = await client
      .from('expenses')
      .upsert(payload.expenses.map(toExpenseRow), { onConflict: 'id' })
    assertRemoteSuccess(error, 'Falha ao migrar despesas')
  }

  if (payload.balanceSnapshots.length) {
    const { error } = await client
      .from('balance_snapshots')
      .upsert(payload.balanceSnapshots.map(toBalanceSnapshotRow), { onConflict: 'id' })
    assertRemoteSuccess(error, 'Falha ao migrar fechamentos de balanço')
  }

  if (payload.balanceItems.length) {
    const { error } = await client
      .from('balance_items')
      .upsert(payload.balanceItems.map(toBalanceItemRow), { onConflict: 'id' })
    assertRemoteSuccess(error, 'Falha ao migrar itens de balanço')
  }

  return verifyBackupMigration(payload)
}

export async function verifyBackupMigration(
  payload: DataExportPayload
): Promise<BackupMigrationResult> {
  const client = supabaseClient()
  const [budgets, categories, expenses, snapshots, items] = await Promise.all([
    client.from('monthly_budgets').select('id', { count: 'exact', head: true }),
    client.from('budget_categories').select('id', { count: 'exact', head: true }),
    client.from('expenses').select('id', { count: 'exact', head: true }),
    client.from('balance_snapshots').select('id', { count: 'exact', head: true }),
    client.from('balance_items').select('id', { count: 'exact', head: true })
  ])

  assertRemoteSuccess(budgets.error, 'Falha ao verificar orçamentos')
  assertRemoteSuccess(categories.error, 'Falha ao verificar categorias')
  assertRemoteSuccess(expenses.error, 'Falha ao verificar despesas')
  assertRemoteSuccess(snapshots.error, 'Falha ao verificar balanços')
  assertRemoteSuccess(items.error, 'Falha ao verificar itens de balanço')

  const counts = {
    monthlyBudgets: budgets.count ?? 0,
    budgetCategories: categories.count ?? 0,
    expenses: expenses.count ?? 0,
    balanceSnapshots: snapshots.count ?? 0,
    balanceItems: items.count ?? 0
  }

  const expected = {
    monthlyBudgets: payload.monthlyBudgets.length,
    budgetCategories: payload.budgetCategories.length,
    expenses: payload.expenses.length,
    balanceSnapshots: payload.balanceSnapshots.length,
    balanceItems: payload.balanceItems.length
  }

  for (const [key, value] of Object.entries(expected)) {
    const actual = counts[key as keyof typeof counts]
    if (actual < value) {
      throw new Error(
        `Migração incompleta para ${key}: esperado ao menos ${value}, encontrado ${actual}`
      )
    }
  }

  return { counts }
}

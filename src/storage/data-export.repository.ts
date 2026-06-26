import { DATA_EXPORT_SCHEMA_VERSION, type DataExportPayload } from '@/domain/shared/data-export'
import {
  dataExportPayloadSchema,
  validateDataExportPayload
} from '@/domain/shared/data-export.validation'
import { nowIso } from '@/domain/shared/types'

import {
  fromBalanceItemRow,
  fromBalanceSnapshotRow,
  fromBudgetCategoryRow,
  fromExpenseRow,
  fromMonthlyBudgetRow,
  fromProfileRow,
  fromVisualPreferencesRow,
  toBalanceItemRow,
  toBalanceSnapshotRow,
  toBudgetCategoryRow,
  toExpenseRow,
  toMonthlyBudgetRow,
  toProfileRow,
  toVisualPreferencesRow
} from './supabase/mappers'
import { assertRemoteSuccess, clearRemoteTables, supabaseClient } from './supabase/query-helpers'

export async function readVisualPreferences(): Promise<DataExportPayload['visualPreferences']> {
  const { data, error } = await supabaseClient()
    .from('visual_preferences')
    .select('*')
    .eq('id', 'default')
    .maybeSingle()
  assertRemoteSuccess(error, 'Falha ao carregar preferências visuais')
  return data ? fromVisualPreferencesRow(data) : {}
}

export async function saveVisualPreferences(preferences: DataExportPayload['visualPreferences']) {
  const timestamp = nowIso()
  const existing = await readVisualPreferences()
  const row = toVisualPreferencesRow(
    { categoryVisuals: preferences.categoryVisuals ?? existing.categoryVisuals ?? {} },
    timestamp
  )
  const { error } = await supabaseClient()
    .from('visual_preferences')
    .upsert(row, { onConflict: 'id' })
  assertRemoteSuccess(error, 'Falha ao salvar preferências visuais')
}

export async function exportLocalData(): Promise<DataExportPayload> {
  const client = supabaseClient()
  const [
    profiles,
    monthlyBudgets,
    budgetCategories,
    expenses,
    balanceSnapshots,
    balanceItems,
    visualPreferences
  ] = await Promise.all([
    client.from('profiles').select('*').limit(1).maybeSingle(),
    client.from('monthly_budgets').select('*').order('month', { ascending: true }),
    client.from('budget_categories').select('*').order('sort_order', { ascending: true }),
    client.from('expenses').select('*').order('date', { ascending: false }),
    client.from('balance_snapshots').select('*').order('month', { ascending: true }),
    client.from('balance_items').select('*').order('sort_order', { ascending: true }),
    readVisualPreferences()
  ])

  assertRemoteSuccess(profiles.error, 'Falha ao exportar perfil')
  assertRemoteSuccess(monthlyBudgets.error, 'Falha ao exportar orçamentos')
  assertRemoteSuccess(budgetCategories.error, 'Falha ao exportar categorias')
  assertRemoteSuccess(expenses.error, 'Falha ao exportar despesas')
  assertRemoteSuccess(balanceSnapshots.error, 'Falha ao exportar balanços')
  assertRemoteSuccess(balanceItems.error, 'Falha ao exportar itens de balanço')

  return {
    schemaVersion: DATA_EXPORT_SCHEMA_VERSION,
    exportedAt: nowIso(),
    profile: profiles.data ? fromProfileRow(profiles.data) : null,
    monthlyBudgets: (monthlyBudgets.data ?? []).map(fromMonthlyBudgetRow),
    budgetCategories: (budgetCategories.data ?? []).map(fromBudgetCategoryRow),
    expenses: (expenses.data ?? []).map(fromExpenseRow),
    balanceSnapshots: (balanceSnapshots.data ?? []).map(fromBalanceSnapshotRow),
    balanceItems: (balanceItems.data ?? []).map(fromBalanceItemRow),
    visualPreferences
  }
}

export async function importLocalData(input: unknown): Promise<{ errors: string[] }> {
  const errors = validateDataExportPayload(input)
  if (errors.length) return { errors }

  const payload = dataExportPayloadSchema.parse(input)
  const client = supabaseClient()

  await clearRemoteData()

  if (payload.profile) {
    const { error } = await client.from('profiles').upsert(toProfileRow(payload.profile))
    assertRemoteSuccess(error, 'Falha ao importar perfil')
  }

  const operations = [
    payload.monthlyBudgets.length
      ? client.from('monthly_budgets').upsert(payload.monthlyBudgets.map(toMonthlyBudgetRow))
      : null,
    payload.budgetCategories.length
      ? client.from('budget_categories').upsert(payload.budgetCategories.map(toBudgetCategoryRow))
      : null,
    payload.expenses.length ? client.from('expenses').upsert(payload.expenses.map(toExpenseRow)) : null,
    payload.balanceSnapshots.length
      ? client.from('balance_snapshots').upsert(payload.balanceSnapshots.map(toBalanceSnapshotRow))
      : null,
    payload.balanceItems.length
      ? client.from('balance_items').upsert(payload.balanceItems.map(toBalanceItemRow))
      : null
  ].filter(Boolean)

  for (const operation of operations) {
    const { error } = await operation
    assertRemoteSuccess(error, 'Falha ao importar dados')
  }

  await saveVisualPreferences(payload.visualPreferences)

  return { errors: [] }
}

export async function clearLocalData(): Promise<void> {
  await clearRemoteData()
}

export async function clearRemoteData(): Promise<void> {
  await clearRemoteTables()
}

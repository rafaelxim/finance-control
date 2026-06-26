import type { PostgrestError } from '@supabase/supabase-js'

import { assertNoSupabaseError } from './errors'
import { getSupabaseClient, type FinanceSupabaseClient } from './client'

export function supabaseClient(client: FinanceSupabaseClient = getSupabaseClient()) {
  return client
}

export function assertRemoteSuccess(error: PostgrestError | null, fallback?: string) {
  assertNoSupabaseError(error, fallback)
}

export async function clearRemoteTables(client: FinanceSupabaseClient = getSupabaseClient()) {
  const tables = [
    'expenses',
    'budget_categories',
    'monthly_budgets',
    'balance_items',
    'balance_snapshots',
    'profiles',
    'visual_preferences'
  ] as const

  for (const table of tables) {
    const { error } = await client.from(table).delete().neq('id', '__never__')
    assertRemoteSuccess(error, `Falha ao limpar ${table}`)
  }
}

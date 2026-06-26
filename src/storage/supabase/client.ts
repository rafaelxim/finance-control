import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

export type FinanceSupabaseClient = SupabaseClient<Database>

let singleton: FinanceSupabaseClient | null = null

function readEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY') {
  const viteEnv = import.meta.env as Partial<Record<typeof name, string>> | undefined
  const processEnv = typeof process !== 'undefined' ? process.env : undefined
  const value = viteEnv?.[name] ?? processEnv?.[name]
  if (!value) {
    throw new Error(`${name} is required to connect to Supabase`)
  }
  return value
}

export function createFinanceSupabaseClient(): FinanceSupabaseClient {
  return createClient<Database>(
    readEnv('VITE_SUPABASE_URL'),
    readEnv('VITE_SUPABASE_PUBLISHABLE_KEY')
  )
}

export function getSupabaseClient(): FinanceSupabaseClient {
  singleton ??= createFinanceSupabaseClient()
  return singleton
}

export function setSupabaseClientForTests(client: FinanceSupabaseClient | null) {
  singleton = client
}

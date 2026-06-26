import { clearRemoteTables } from '@/storage/supabase/query-helpers'

export async function resetRemoteData() {
  await clearRemoteTables()
}

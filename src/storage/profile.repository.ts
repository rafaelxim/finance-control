import { createDefaultProfile, type UserProfile } from '@/domain/shared/profile'
import type { MonthKey } from '@/domain/shared/types'
import { touchEntity } from '@/storage/repository'

import { fromProfileRow, toProfileRow } from './supabase/mappers'
import { assertRemoteSuccess, supabaseClient } from './supabase/query-helpers'

export async function getOrCreateProfile(): Promise<UserProfile> {
  const client = supabaseClient()
  const { data, error } = await client.from('profiles').select('*').limit(1).maybeSingle()
  assertRemoteSuccess(error, 'Falha ao carregar perfil')

  if (data) return fromProfileRow(data)

  const profile = createDefaultProfile()
  const { error: saveError } = await client.from('profiles').upsert(toProfileRow(profile))
  assertRemoteSuccess(saveError, 'Falha ao criar perfil')
  return profile
}

export async function setProfileActiveMonth(profile: UserProfile, month: MonthKey) {
  const updated = touchEntity({ ...profile, activeMonth: month })
  const { error } = await supabaseClient().from('profiles').upsert(toProfileRow(updated))
  assertRemoteSuccess(error, 'Falha ao atualizar mês ativo')
  return updated
}

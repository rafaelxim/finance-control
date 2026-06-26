import { afterEach, describe, expect, it } from 'vitest'

import { readVisualPreferences, saveVisualPreferences } from '@/storage/data-export.repository'
import { getOrCreateProfile, setProfileActiveMonth } from '@/storage/profile.repository'
import { setSupabaseClientForTests } from '@/storage/supabase/client'
import { createInMemorySupabaseClient } from '@tests/fixtures/supabase/client'

describe('profile and preferences remote repositories', () => {
  afterEach(() => setSupabaseClientForTests(null))

  it('creates a default profile when none exists and persists active month changes', async () => {
    const { client, store } = createInMemorySupabaseClient()
    setSupabaseClientForTests(client)

    const profile = await getOrCreateProfile()
    const updated = await setProfileActiveMonth(profile, '2026-06')

    expect(profile.currency).toBe('BRL')
    expect(updated.activeMonth).toBe('2026-06')
    expect(store.profiles).toHaveLength(1)
    expect(store.profiles[0].active_month).toBe('2026-06')
  })

  it('stores visual preferences as a singleton remote record', async () => {
    const { client, store } = createInMemorySupabaseClient()
    setSupabaseClientForTests(client)

    await saveVisualPreferences({ categoryVisuals: { groceries: 'green' } })
    await saveVisualPreferences({ categoryVisuals: { rent: 'blue' } })

    expect(store.visual_preferences).toHaveLength(1)
    expect(await readVisualPreferences()).toEqual({ categoryVisuals: { rent: 'blue' } })
  })
})

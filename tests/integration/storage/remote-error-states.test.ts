import { afterEach, describe, expect, it } from 'vitest'

import { RemoteStorageError } from '@/storage/supabase/errors'
import { getBudgetByMonth } from '@/storage/budget.repository'
import { setSupabaseClientForTests } from '@/storage/supabase/client'
import { createSupabaseClientDouble } from '@tests/fixtures/supabase/client'

describe('remote repository failure states', () => {
  afterEach(() => setSupabaseClientForTests(null))

  it('normalizes denied reads into recoverable remote storage errors', async () => {
    const client = createSupabaseClientDouble({
      from: () =>
        ({
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: null,
                error: { message: 'permission denied' }
              })
            })
          })
        }) as never
    })
    setSupabaseClientForTests(client)

    await expect(getBudgetByMonth('2026-06')).rejects.toBeInstanceOf(RemoteStorageError)
    await expect(getBudgetByMonth('2026-06')).rejects.toThrow('permission denied')
  })
})

import { describe, expect, it } from 'vitest'

import {
  assertNoSupabaseError,
  normalizeSupabaseError,
  RemoteStorageError
} from '@/storage/supabase/errors'

describe('Supabase error normalization', () => {
  it('returns null when there is no error', () => {
    expect(normalizeSupabaseError(null)).toBeNull()
  })

  it('wraps Supabase-like errors with their message', () => {
    const normalized = normalizeSupabaseError({ message: 'permission denied' })

    expect(normalized).toBeInstanceOf(RemoteStorageError)
    expect(normalized?.message).toBe('permission denied')
  })

  it('throws normalized errors from assertions', () => {
    expect(() => assertNoSupabaseError({ message: 'network failure' })).toThrow(
      'network failure'
    )
  })
})

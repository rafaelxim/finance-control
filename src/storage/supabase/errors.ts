export class RemoteStorageError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'RemoteStorageError'
  }
}

export function normalizeSupabaseError(error: unknown, fallback = 'Falha ao acessar dados remotos') {
  if (!error) return null
  if (error instanceof RemoteStorageError) return error

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = String((error as { message?: unknown }).message || fallback)
    return new RemoteStorageError(message, error)
  }

  return new RemoteStorageError(fallback, error)
}

export function assertNoSupabaseError(error: unknown, fallback?: string): asserts error is null {
  const normalized = normalizeSupabaseError(error, fallback)
  if (normalized) throw normalized
}

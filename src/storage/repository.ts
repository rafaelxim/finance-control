import type { TimestampedEntity } from '@/domain/shared/types'
import { createId, nowIso } from '@/domain/shared/types'

export function createEntityBase(prefix: string): TimestampedEntity {
  const timestamp = nowIso()

  return {
    id: createId(prefix),
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

export function touchEntity<T extends TimestampedEntity>(entity: T): T {
  return {
    ...entity,
    updatedAt: nowIso()
  }
}

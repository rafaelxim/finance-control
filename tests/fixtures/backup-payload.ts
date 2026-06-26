import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { DataExportPayload } from '@/domain/shared/data-export'

export function loadBackupPayload(): DataExportPayload {
  return JSON.parse(readFileSync(join(process.cwd(), 'backup.json'), 'utf8')) as DataExportPayload
}

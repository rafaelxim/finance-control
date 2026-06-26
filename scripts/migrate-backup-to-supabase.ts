import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { migrateBackupToSupabase } from '../src/storage/supabase/backup-migration'

function loadDotEnv() {
  const path = join(process.cwd(), '.env')
  if (!existsSync(path)) return

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue

    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
  }
}

loadDotEnv()

const backupPath = process.argv[2] ?? join(process.cwd(), 'backup.json')
const payload = JSON.parse(readFileSync(backupPath, 'utf8'))
const result = await migrateBackupToSupabase(payload)

console.log(JSON.stringify(result, null, 2))

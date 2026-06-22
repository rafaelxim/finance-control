import { DATA_EXPORT_SCHEMA_VERSION, type DataExportPayload } from '@/domain/shared/data-export'
import {
  dataExportPayloadSchema,
  validateDataExportPayload
} from '@/domain/shared/data-export.validation'
import { nowIso } from '@/domain/shared/types'

import { db } from './database'

const VISUAL_PREFERENCES_KEY = 'finance-control:visual-preferences'

function readVisualPreferences(): DataExportPayload['visualPreferences'] {
  if (typeof localStorage === 'undefined') return {}

  try {
    const raw = localStorage.getItem(VISUAL_PREFERENCES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveVisualPreferences(preferences: DataExportPayload['visualPreferences']) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(VISUAL_PREFERENCES_KEY, JSON.stringify(preferences))
}

export async function exportLocalData(): Promise<DataExportPayload> {
  const [
    profile = null,
    monthlyBudgets,
    budgetCategories,
    expenses,
    balanceSnapshots,
    balanceItems
  ] = await Promise.all([
    db.profiles.toCollection().first(),
    db.monthlyBudgets.toArray(),
    db.budgetCategories.toArray(),
    db.expenses.toArray(),
    db.balanceSnapshots.toArray(),
    db.balanceItems.toArray()
  ])

  return {
    schemaVersion: DATA_EXPORT_SCHEMA_VERSION,
    exportedAt: nowIso(),
    profile,
    monthlyBudgets,
    budgetCategories,
    expenses,
    balanceSnapshots,
    balanceItems,
    visualPreferences: readVisualPreferences()
  }
}

export async function importLocalData(input: unknown): Promise<{ errors: string[] }> {
  const errors = validateDataExportPayload(input)
  if (errors.length) return { errors }

  const payload = dataExportPayloadSchema.parse(input)

  await db.transaction(
    'rw',
    db.profiles,
    db.monthlyBudgets,
    db.budgetCategories,
    db.expenses,
    db.balanceSnapshots,
    db.balanceItems,
    async () => {
      await Promise.all([
        db.profiles.clear(),
        db.monthlyBudgets.clear(),
        db.budgetCategories.clear(),
        db.expenses.clear(),
        db.balanceSnapshots.clear(),
        db.balanceItems.clear()
      ])

      if (payload.profile) {
        await db.profiles.put(payload.profile)
      }
      await db.monthlyBudgets.bulkPut(payload.monthlyBudgets)
      await db.budgetCategories.bulkPut(payload.budgetCategories)
      await db.expenses.bulkPut(payload.expenses)
      await db.balanceSnapshots.bulkPut(payload.balanceSnapshots)
      await db.balanceItems.bulkPut(payload.balanceItems)
    }
  )
  saveVisualPreferences(payload.visualPreferences)

  return { errors: [] }
}

export async function clearLocalData(): Promise<void> {
  await db.transaction(
    'rw',
    db.profiles,
    db.monthlyBudgets,
    db.budgetCategories,
    db.expenses,
    db.balanceSnapshots,
    db.balanceItems,
    async () => {
      await Promise.all([
        db.profiles.clear(),
        db.monthlyBudgets.clear(),
        db.budgetCategories.clear(),
        db.expenses.clear(),
        db.balanceSnapshots.clear(),
        db.balanceItems.clear()
      ])
    }
  )
}

import { defineStore } from 'pinia'

import { createDefaultProfile, type UserProfile } from '@/domain/shared/profile'
import type { MonthKey } from '@/domain/shared/types'
import { db } from '@/storage/database'
import { touchEntity } from '@/storage/repository'

interface ProfileState {
  profile: UserProfile | null
  loading: boolean
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    loading: false
  }),
  getters: {
    activeMonth: (state): MonthKey =>
      state.profile?.activeMonth ?? createDefaultProfile().activeMonth
  },
  actions: {
    async load() {
      this.loading = true
      try {
        const existing = await db.profiles.limit(1).first()
        if (existing) {
          this.profile = existing
          return
        }

        const profile = createDefaultProfile()
        await db.profiles.put(profile)
        this.profile = profile
      } finally {
        this.loading = false
      }
    },
    async setActiveMonth(month: MonthKey) {
      if (!this.profile) await this.load()
      if (!this.profile) return

      const updated = touchEntity({ ...this.profile, activeMonth: month })
      await db.profiles.put(updated)
      this.profile = updated
    }
  }
})

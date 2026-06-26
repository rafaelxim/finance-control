import { defineStore } from 'pinia'

import { createDefaultProfile, type UserProfile } from '@/domain/shared/profile'
import type { MonthKey } from '@/domain/shared/types'
import { getOrCreateProfile, setProfileActiveMonth } from '@/storage/profile.repository'

interface ProfileState {
  profile: UserProfile | null
  loading: boolean
}

let activeMonthWriteQueue: Promise<void> = Promise.resolve()

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
        this.profile = await getOrCreateProfile()
      } finally {
        this.loading = false
      }
    },
    async setActiveMonth(month: MonthKey) {
      if (!this.profile) await this.load()
      if (!this.profile) return

      const previous = this.profile
      this.profile = { ...previous, activeMonth: month }

      const save = activeMonthWriteQueue
        .catch(() => undefined)
        .then(() => setProfileActiveMonth(previous, month))

      activeMonthWriteQueue = save.then(
        () => undefined,
        () => undefined
      )

      try {
        const savedProfile = await save
        if (this.profile?.activeMonth === month) {
          this.profile = savedProfile
        }
      } catch (error) {
        if (this.profile?.activeMonth === month) {
          this.profile = previous
        }
        throw error
      }
    }
  }
})

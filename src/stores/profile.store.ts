import { defineStore } from 'pinia'

import { createDefaultProfile, type UserProfile } from '@/domain/shared/profile'
import type { MonthKey } from '@/domain/shared/types'
import { getOrCreateProfile, setProfileActiveMonth } from '@/storage/profile.repository'

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
        this.profile = await getOrCreateProfile()
      } finally {
        this.loading = false
      }
    },
    async setActiveMonth(month: MonthKey) {
      if (!this.profile) await this.load()
      if (!this.profile) return

      this.profile = await setProfileActiveMonth(this.profile, month)
    }
  }
})

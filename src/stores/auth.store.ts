import type { Session, User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'

import { getSupabaseClient } from '@/storage/supabase/client'

interface AuthState {
  initialized: boolean
  loading: boolean
  session: Session | null
  user: User | null
}

let authSubscriptionStarted = false
let initializePromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    initialized: false,
    loading: false,
    session: null,
    user: null
  }),
  actions: {
    async initialize() {
      if (this.initialized) return
      if (initializePromise) return initializePromise

      initializePromise = (async () => {
        this.loading = true
        const client = getSupabaseClient()
        const { data, error } = await client.auth.getSession()
        if (error) throw error

        this.session = data.session
        this.user = data.session?.user ?? null
        this.initialized = true

        if (!authSubscriptionStarted) {
          authSubscriptionStarted = true
          client.auth.onAuthStateChange((_event, session) => {
            this.session = session
            this.user = session?.user ?? null
            this.initialized = true
          })
        }
      })()

      try {
        await initializePromise
      } finally {
        this.loading = false
        initializePromise = null
      }
    },
    async signIn(email: string, password: string) {
      this.loading = true
      try {
        const { data, error } = await getSupabaseClient().auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error

        this.session = data.session
        this.user = data.user
        this.initialized = true
      } finally {
        this.loading = false
      }
    },
    async signUp(email: string, password: string) {
      this.loading = true
      try {
        const { data, error } = await getSupabaseClient().auth.signUp({
          email,
          password
        })
        if (error) throw error

        this.session = data.session
        this.user = data.session?.user ?? null
        this.initialized = true
        return data
      } finally {
        this.loading = false
      }
    },
    async signOut() {
      this.loading = true
      try {
        const { error } = await getSupabaseClient().auth.signOut()
        if (error) throw error

        this.session = null
        this.user = null
      } finally {
        this.loading = false
      }
    }
  }
})

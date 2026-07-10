<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogIn, UserPlus } from 'lucide-vue-next'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import logoUrl from '@/assets/logo.png'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const mode = ref<'sign-in' | 'sign-up'>('sign-in')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const title = computed(() => (mode.value === 'sign-in' ? 'Entrar' : 'Criar conta'))
const submitLabel = computed(() => (mode.value === 'sign-in' ? 'Entrar' : 'Criar conta'))
const redirectTo = computed(() => {
  const value = route.query.redirect
  return typeof value === 'string' && value.startsWith('/') ? value : '/'
})

function toggleMode(nextMode: 'sign-in' | 'sign-up') {
  mode.value = nextMode
  errorMessage.value = ''
  successMessage.value = ''
}

async function submit() {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (mode.value === 'sign-in') {
      await authStore.signIn(email.value.trim(), password.value)
      await router.replace(redirectTo.value)
      return
    }

    const result = await authStore.signUp(email.value.trim(), password.value)
    if (result.session) {
      await router.replace(redirectTo.value)
      return
    }

    successMessage.value = 'Conta criada. Confirme seu email antes de entrar.'
    mode.value = 'sign-in'
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Não foi possível autenticar. Tente novamente.'
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card" aria-labelledby="auth-title">
      <img class="auth-card__logo" :src="logoUrl" alt="OrganizaGrana" />

      <div class="auth-card__heading">
        <h1 id="auth-title">{{ title }}</h1>
        <p>Acesse sua conta para carregar seus dados financeiros.</p>
      </div>

      <div class="auth-card__tabs" role="tablist" aria-label="Tipo de acesso">
        <button
          type="button"
          :aria-selected="mode === 'sign-in'"
          role="tab"
          @click="toggleMode('sign-in')"
        >
          Entrar
        </button>
        <button
          type="button"
          :aria-selected="mode === 'sign-up'"
          role="tab"
          @click="toggleMode('sign-up')"
        >
          Criar conta
        </button>
      </div>

      <form class="auth-card__form" @submit.prevent="submit">
        <BaseInput
          id="auth-email"
          v-model="email"
          autocomplete="email"
          label="Email"
          placeholder="voce@email.com"
          type="email"
        />
        <BaseInput
          id="auth-password"
          v-model="password"
          autocomplete="current-password"
          label="Senha"
          placeholder="Sua senha"
          type="password"
        />

        <p v-if="errorMessage" class="auth-card__message auth-card__message--error" role="alert">
          {{ errorMessage }}
        </p>
        <p
          v-if="successMessage"
          class="auth-card__message auth-card__message--success"
          role="status"
        >
          {{ successMessage }}
        </p>

        <BaseButton type="submit" :disabled="authStore.loading || !email || !password">
          <LogIn v-if="mode === 'sign-in'" :size="18" aria-hidden="true" />
          <UserPlus v-else :size="18" aria-hidden="true" />
          {{ authStore.loading ? 'Aguarde...' : submitLabel }}
        </BaseButton>
      </form>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  background:
    radial-gradient(circle at 50% 0%, rgba(252, 213, 53, 0.1), transparent 34%), var(--color-bg);
  padding: 20px;
}

.auth-card {
  display: grid;
  width: min(100%, 420px);
  gap: 20px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  box-shadow: var(--shadow);
  padding: 26px;
}

.auth-card__logo {
  width: 250px;
  max-width: 100%;
  justify-self: center;
}

.auth-card__heading {
  display: grid;
  gap: 8px;
  text-align: center;
}

.auth-card__heading h1,
.auth-card__heading p {
  margin: 0;
}

.auth-card__heading h1 {
  color: var(--color-text);
  font-size: 1.8rem;
  line-height: 1.05;
}

.auth-card__heading p {
  color: var(--color-muted);
}

.auth-card__tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.auth-card__tabs button {
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-surface-muted) 42%, transparent);
  color: var(--color-muted);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.auth-card__tabs button[aria-selected='true'] {
  border-color: color-mix(in srgb, var(--color-primary) 62%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 14%, var(--color-surface));
  color: var(--color-primary);
}

.auth-card__form {
  display: grid;
  gap: 14px;
}

.auth-card__message {
  border-radius: 8px;
  margin: 0;
  padding: 10px 12px;
}

.auth-card__message--error {
  border: 1px solid rgba(246, 70, 93, 0.42);
  background: rgba(246, 70, 93, 0.08);
  color: var(--color-danger);
}

.auth-card__message--success {
  border: 1px solid rgba(14, 203, 129, 0.42);
  background: rgba(14, 203, 129, 0.08);
  color: var(--color-up);
}

@media (max-width: 520px) {
  .auth-card {
    padding: 20px;
  }
}
</style>

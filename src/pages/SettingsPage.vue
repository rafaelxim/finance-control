<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Download, ExternalLink, Save, ShieldCheck, Trash2, UserX } from 'lucide-vue-next'

import CategoryVisualSelector from '@/components/budget/CategoryVisualSelector.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import {
  clearFinancialData,
  exportLocalData,
  readVisualPreferences,
  saveVisualPreferences
} from '@/storage/data-export.repository'
import { useAuthStore } from '@/stores/auth.store'
import { useBalanceStore } from '@/stores/balance.store'
import { useBudgetStore } from '@/stores/budget.store'
import { useExpensesStore } from '@/stores/expenses.store'
import { useProfileStore } from '@/stores/profile.store'

const router = useRouter()
const authStore = useAuthStore()
const budgetStore = useBudgetStore()
const expensesStore = useExpensesStore()
const balanceStore = useBalanceStore()
const profileStore = useProfileStore()
const categoryVisuals = ref<Record<string, string>>({})
const saving = ref(false)
const status = ref('')
const privacyStatus = ref<{ tone: 'success' | 'error'; message: string } | null>(null)
const exportingData = ref(false)
const clearingFinancialData = ref(false)
const deletingAccount = ref(false)
const pageHydrating = ref(true)
const pageLoading = computed(() => pageHydrating.value || budgetStore.loading)

onMounted(async () => {
  try {
    categoryVisuals.value = (await readVisualPreferences()).categoryVisuals ?? {}
    await budgetStore.loadMonth(profileStore.activeMonth)
  } finally {
    pageHydrating.value = false
  }
})

function updateVisuals(value: Record<string, string>) {
  categoryVisuals.value = value
  status.value = ''
}

async function saveVisuals() {
  saving.value = true
  try {
    await saveVisualPreferences({ categoryVisuals: categoryVisuals.value })
    status.value = 'Preferências visuais salvas.'
  } finally {
    saving.value = false
  }
}

function downloadJson(payload: unknown) {
  const exportedAt = new Date().toISOString().slice(0, 10)
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `organizagrana-dados-${exportedAt}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function exportData() {
  privacyStatus.value = null
  exportingData.value = true

  try {
    const payload = await exportLocalData()
    downloadJson(payload)
    privacyStatus.value = {
      tone: 'success',
      message: 'Arquivo JSON gerado com seus dados exportáveis.'
    }
  } catch (error) {
    privacyStatus.value = {
      tone: 'error',
      message: error instanceof Error ? error.message : 'Não foi possível exportar seus dados.'
    }
  } finally {
    exportingData.value = false
  }
}

async function clearFinancialRecords() {
  privacyStatus.value = null
  const confirmed = window.confirm(
    'Limpar dados financeiros? Esta ação remove orçamentos, categorias, despesas, balanços e preferências visuais. Sua conta e perfil serão mantidos.'
  )
  if (!confirmed) return

  clearingFinancialData.value = true
  try {
    await clearFinancialData()
    categoryVisuals.value = {}
    budgetStore.$reset()
    expensesStore.$reset()
    balanceStore.$reset()
    await budgetStore.loadMonth(profileStore.activeMonth)
    privacyStatus.value = {
      tone: 'success',
      message: 'Dados financeiros removidos. Sua conta foi mantida.'
    }
  } catch (error) {
    privacyStatus.value = {
      tone: 'error',
      message:
        error instanceof Error ? error.message : 'Não foi possível limpar os dados financeiros.'
    }
  } finally {
    clearingFinancialData.value = false
  }
}

async function deleteAccount() {
  privacyStatus.value = null
  const confirmed = window.confirm(
    'Excluir sua conta permanentemente? Esta ação remove a conta, encerra sessões e apaga os dados associados. Ela não pode ser desfeita.'
  )
  if (!confirmed) return

  const typedConfirmation = window.prompt('Digite EXCLUIR para confirmar a exclusão da conta.')
  if (typedConfirmation !== 'EXCLUIR') {
    privacyStatus.value = {
      tone: 'error',
      message: 'Exclusão cancelada. A confirmação digitada não corresponde a EXCLUIR.'
    }
    return
  }

  deletingAccount.value = true
  try {
    await authStore.deleteAccount()
    profileStore.$reset()
    budgetStore.$reset()
    expensesStore.$reset()
    balanceStore.$reset()
    await router.replace('/login')
  } catch (error) {
    privacyStatus.value = {
      tone: 'error',
      message: error instanceof Error ? error.message : 'Não foi possível excluir a conta.'
    }
  } finally {
    deletingAccount.value = false
  }
}
</script>

<template>
  <section class="page">
    <LoadingState v-if="pageLoading" />

    <template v-else>
      <header class="page__header">
        <h1>Configurações</h1>
        <p>Preferências visuais para personalizar as categorias do orçamento.</p>
      </header>

      <CategoryVisualSelector
        v-model="categoryVisuals"
        :categories="budgetStore.activeCategories"
        @update:model-value="updateVisuals"
      />

      <div class="settings-actions">
        <BaseButton :disabled="saving" @click="saveVisuals">
          <Save :size="17" aria-hidden="true" />
          {{ saving ? 'Salvando...' : 'Salvar preferências visuais' }}
        </BaseButton>
        <p v-if="status" class="settings-status" role="status">{{ status }}</p>
      </div>

      <section class="privacy-data panel" aria-labelledby="privacy-data-title">
        <header class="privacy-data__header">
          <div>
            <p class="privacy-data__eyebrow">LGPD</p>
            <h2 id="privacy-data-title">Privacidade e dados</h2>
            <p>
              Consulte sua política, exporte seus registros e gerencie dados armazenados no
              Supabase.
            </p>
          </div>
          <ShieldCheck :size="28" aria-hidden="true" />
        </header>

        <div class="privacy-data__grid">
          <section class="privacy-data__item">
            <div>
              <h3>Exportação</h3>
              <p>Baixe um JSON com perfil, orçamentos, despesas, balanços e preferências.</p>
            </div>
            <BaseButton :disabled="exportingData" @click="exportData">
              <Download :size="17" aria-hidden="true" />
              {{ exportingData ? 'Exportando...' : 'Baixar JSON' }}
            </BaseButton>
          </section>

          <section class="privacy-data__item">
            <div>
              <h3>Limpeza financeira</h3>
              <p>Remove registros financeiros e preferências visuais, mantendo sua conta ativa.</p>
            </div>
            <BaseButton
              variant="secondary"
              :disabled="clearingFinancialData"
              @click="clearFinancialRecords"
            >
              <Trash2 :size="17" aria-hidden="true" />
              {{ clearingFinancialData ? 'Limpando...' : 'Limpar dados financeiros' }}
            </BaseButton>
          </section>

          <section class="privacy-data__item">
            <div>
              <h3>Exclusão de conta</h3>
              <p>
                Remove a conta no Supabase Auth, encerra sessões e apaga registros associados.
              </p>
            </div>
            <BaseButton variant="secondary" :disabled="deletingAccount" @click="deleteAccount">
              <UserX :size="17" aria-hidden="true" />
              {{ deletingAccount ? 'Excluindo...' : 'Excluir conta' }}
            </BaseButton>
          </section>

          <section class="privacy-data__item">
            <div>
              <h3>Política e contato</h3>
              <p>
                Canal LGPD/controlador: a definir antes do uso público. Use a política para ver o
                tratamento atual documentado.
              </p>
            </div>
            <RouterLink class="button button--secondary privacy-data__link" to="/privacidade">
              <ExternalLink :size="17" aria-hidden="true" />
              Política de privacidade
            </RouterLink>
          </section>
        </div>

        <p
          v-if="privacyStatus"
          class="privacy-data__status"
          :class="`privacy-data__status--${privacyStatus.tone}`"
          role="status"
        >
          {{ privacyStatus.message }}
        </p>
      </section>
    </template>
  </section>
</template>

<style scoped>
.settings-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.settings-status {
  margin: 0;
  color: var(--color-up);
  font-size: 0.9rem;
  font-weight: 700;
}

.privacy-data {
  display: grid;
  gap: 18px;
  margin-top: 8px;
}

.privacy-data__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.privacy-data__header h2,
.privacy-data__header p,
.privacy-data__item h3,
.privacy-data__item p,
.privacy-data__eyebrow {
  margin: 0;
}

.privacy-data__eyebrow {
  color: var(--color-primary);
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.privacy-data__header h2 {
  margin-top: 4px;
  color: var(--color-text);
  font-size: 1.25rem;
}

.privacy-data__header p,
.privacy-data__item p {
  color: var(--color-muted);
  line-height: 1.5;
}

.privacy-data__header svg {
  color: var(--color-primary);
  flex: 0 0 auto;
}

.privacy-data__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.privacy-data__item {
  display: grid;
  align-content: space-between;
  gap: 16px;
  min-height: 178px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--color-bg) 52%, var(--color-surface));
  padding: 14px;
}

.privacy-data__item h3 {
  color: var(--color-text);
  font-size: 1rem;
}

.privacy-data__item .button {
  width: fit-content;
}

.privacy-data__link {
  color: var(--color-text);
  text-decoration: none;
}

.privacy-data__status {
  border-radius: var(--radius);
  margin: 0;
  padding: 10px 12px;
  font-size: 0.92rem;
  font-weight: 750;
}

.privacy-data__status--success {
  border: 1px solid color-mix(in srgb, var(--color-up) 36%, var(--color-border));
  background: color-mix(in srgb, var(--color-up) 9%, transparent);
  color: var(--color-up);
}

.privacy-data__status--error {
  border: 1px solid color-mix(in srgb, var(--color-danger) 42%, var(--color-border));
  background: color-mix(in srgb, var(--color-danger) 9%, transparent);
  color: var(--color-danger);
}

@media (max-width: 860px) {
  .privacy-data__grid {
    grid-template-columns: 1fr;
  }

  .privacy-data__item {
    min-height: 0;
  }
}

@media (max-width: 560px) {
  .privacy-data__header {
    display: grid;
  }
}
</style>

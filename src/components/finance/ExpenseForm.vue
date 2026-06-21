<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CurrencyInput from '@/components/ui/CurrencyInput.vue'
import FormError from '@/components/ui/FormError.vue'
import type { BudgetCategory } from '@/domain/budget/types'
import { expenseDraftSchema } from '@/domain/expenses/schemas'
import type { Expense, ExpenseDraftInput } from '@/domain/expenses/types'
import { flattenZodErrors } from '@/domain/shared/validation'

const props = withDefaults(
  defineProps<{
    budgetId: string | null
    categories: BudgetCategory[]
    defaultDate: string
    editingExpense?: Expense | null
    saving?: boolean
  }>(),
  {
    editingExpense: null,
    saving: false
  }
)

const emit = defineEmits<{
  submit: [expense: ExpenseDraftInput]
  'create-category': []
}>()

const form = reactive({
  categoryId: '',
  amount: '',
  date: props.defaultDate,
  description: ''
})
const localErrors = ref<string[]>([])

const activeCategories = computed(() =>
  props.categories.filter((category) => category.status === 'active')
)
const categoryOptions = computed(() =>
  activeCategories.value.map((category) => ({ value: category.id, label: category.name }))
)

watch(
  () => [
    props.defaultDate,
    activeCategories.value.map((category) => category.id).join('|'),
    props.editingExpense?.id
  ],
  () => {
    if (props.editingExpense) {
      form.categoryId = props.editingExpense.categoryId
      form.amount = props.editingExpense.amount
      form.date = props.editingExpense.date
      form.description = props.editingExpense.description ?? ''
    } else {
      form.date = props.defaultDate
    }

    if (
      !props.editingExpense &&
      !activeCategories.value.some((category) => category.id === form.categoryId)
    ) {
      form.categoryId = activeCategories.value[0]?.id ?? ''
    }
  },
  { immediate: true }
)

function resetForm() {
  form.amount = ''
  form.description = ''
}

function submit() {
  const payload: ExpenseDraftInput = {
    id: props.editingExpense?.id,
    budgetId: props.budgetId ?? '',
    categoryId: form.categoryId,
    amount: form.amount,
    date: form.date,
    description: form.description.trim() || undefined
  }
  const parsed = expenseDraftSchema.safeParse(payload)
  localErrors.value = flattenZodErrors(parsed)
  if (!parsed.success) return

  emit('submit', payload)
  resetForm()
}
</script>

<template>
  <form class="expense-form panel" aria-label="Registrar despesa" @submit.prevent="submit">
    <FormError :errors="localErrors" />

    <div class="expense-form__grid">
      <CurrencyInput
        id="expense-amount"
        v-model="form.amount"
        label="Valor"
        :error="localErrors.find((error) => error.includes('valor'))"
      />
      <BaseInput id="expense-date" v-model="form.date" label="Data" type="date" />
      <BaseSelect
        id="expense-category"
        v-model="form.categoryId"
        label="Categoria"
        :options="categoryOptions"
      />
      <BaseInput
        id="expense-description"
        v-model="form.description"
        label="Descrição"
        placeholder="Ex.: Mercado"
      />
    </div>

    <div class="expense-form__actions">
      <BaseButton type="submit" :disabled="saving || !budgetId || !activeCategories.length">
        {{ editingExpense ? 'Salvar alteração' : 'Registrar despesa' }}
      </BaseButton>
      <BaseButton
        data-test="create-category"
        type="button"
        variant="secondary"
        @click="emit('create-category')"
      >
        Criar categoria
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.expense-form {
  display: grid;
  gap: 16px;
}

.expense-form__grid {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) minmax(140px, 1fr) minmax(160px, 1fr) minmax(180px, 2fr);
  gap: 12px;
}

.expense-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 920px) {
  .expense-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>

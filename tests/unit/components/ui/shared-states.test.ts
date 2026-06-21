import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import EmptyState from '@/components/ui/EmptyState.vue'
import FormError from '@/components/ui/FormError.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

describe('shared UI states', () => {
  it('renders empty, loading, and validation states', () => {
    expect(
      mount(EmptyState, {
        props: { title: 'Nada aqui', description: 'Crie o primeiro item.' }
      }).text()
    ).toContain('Nada aqui')
    expect(mount(LoadingState).text()).toContain('Carregando')
    expect(mount(FormError, { props: { errors: ['Campo obrigatório'] } }).text()).toContain(
      'Campo obrigatório'
    )
  })
})

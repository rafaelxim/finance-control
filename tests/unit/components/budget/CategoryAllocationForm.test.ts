import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CategoryAllocationForm from '@/components/budget/CategoryAllocationForm.vue'

describe('CategoryAllocationForm', () => {
  it('renders a compact summary and emits edit and remove actions', async () => {
    const wrapper = mount(CategoryAllocationForm, {
      props: {
        index: 0,
        category: {
          name: 'Comida',
          allocationType: 'fixed',
          allocationValue: '300.00'
        },
        computedLimit: '300.00'
      }
    })

    expect(wrapper.text()).toContain('Limite calculado')
    expect(wrapper.text().replace(/\s+/g, ' ')).toContain('R$ 300,00')
    expect(wrapper.find('details').exists()).toBe(false)

    await wrapper.get('[aria-label="Editar categoria"]').trigger('click')
    await wrapper.get('[aria-label="Remover categoria"]').trigger('click')

    expect(wrapper.emitted('edit')?.[0]).toEqual([0])
    expect(wrapper.emitted('remove')?.[0]).toEqual([0])
  })
})

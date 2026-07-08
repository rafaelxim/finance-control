import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CategoryAllocationForm from '@/components/budget/CategoryAllocationForm.vue'

describe('CategoryAllocationForm', () => {
  it('renders a compact summary and emits updates for the editable fields', async () => {
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
    expect(wrapper.find('details').attributes('open')).toBeUndefined()

    await wrapper.get('summary').trigger('click')
    await wrapper.get('#category-name-0').setValue('Mercado')
    await wrapper.get('#category-type-0').setValue('percentage')

    expect(wrapper.emitted('update')).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Clique para editar ou recolher')
  })
})

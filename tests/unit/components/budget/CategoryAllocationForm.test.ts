import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CategoryAllocationForm from '@/components/budget/CategoryAllocationForm.vue'

describe('CategoryAllocationForm', () => {
  it('emits updates for category name and allocation type', async () => {
    const wrapper = mount(CategoryAllocationForm, {
      props: {
        index: 0,
        category: {
          name: 'Comida',
          allocationType: 'fixed',
          allocationValue: '300.00'
        }
      }
    })

    await wrapper.get('#category-name-0').setValue('Mercado')
    await wrapper.get('#category-type-0').setValue('percentage')

    expect(wrapper.emitted('update')).toHaveLength(2)
  })
})

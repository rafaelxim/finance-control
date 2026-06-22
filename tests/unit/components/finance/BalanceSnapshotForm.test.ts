import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BalanceSnapshotForm from '@/components/finance/BalanceSnapshotForm.vue'
import type { BalanceDraftItemInput } from '@/domain/balance/types'

const items: BalanceDraftItemInput[] = [
  { name: 'Banco e investimentos', kind: 'asset', amount: '2000.00', sortOrder: 0 },
  { name: 'Cartões', kind: 'debt', amount: '1200.00', sortOrder: 1 }
]

describe('BalanceSnapshotForm', () => {
  it('renders totals and emits item add, edit, delete, and save actions', async () => {
    const wrapper = mount(BalanceSnapshotForm, {
      props: {
        month: '2026-06',
        notes: '',
        items,
        totals: {
          assetsTotal: '2000.00',
          debtsTotal: '1200.00',
          netWorth: '800.00'
        }
      }
    })

    expect(wrapper.text()).toContain('Patrimônio líquido')
    expect(wrapper.text()).toContain('R$')

    await wrapper.get('#balance-item-name-0').setValue('Ativos principais')
    expect(wrapper.emitted('update-item')?.[0][0]).toBe(0)
    expect(wrapper.emitted('update-item')?.[0][1]).toMatchObject({ name: 'Ativos principais' })

    await wrapper.get('[data-test="add-balance-item"]').trigger('click')
    expect(wrapper.emitted('add-item')).toHaveLength(1)

    await wrapper.get('[data-test="remove-balance-item-1"]').trigger('click')
    expect(wrapper.emitted('remove-item')?.[0]).toEqual([1])

    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('save')).toHaveLength(1)
  })
})

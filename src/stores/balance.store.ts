import { defineStore } from 'pinia'

import { calculateBalanceTotals, calculateFinancialEvolution } from '@/domain/balance/evolution'
import type {
  BalanceDraftItemInput,
  BalanceItem,
  BalanceSnapshot,
  BalanceSnapshotWithItems
} from '@/domain/balance/types'
import type { MonthKey } from '@/domain/shared/types'
import { currentMonthKey } from '@/domain/shared/types'
import {
  getBalanceHistory,
  getBalanceSnapshotByMonth,
  saveBalanceSnapshot
} from '@/storage/balance.repository'

interface BalanceState {
  snapshot: BalanceSnapshot | null
  items: BalanceItem[]
  history: BalanceSnapshotWithItems[]
  draftMonth: MonthKey
  draftNotes: string
  draftItems: BalanceDraftItemInput[]
  loading: boolean
  lastSavedAt: string | null
}

function defaultDraftItems(): BalanceDraftItemInput[] {
  return [
    { name: 'Ativos', kind: 'asset', amount: '0.00', sortOrder: 0 },
    { name: 'Dívidas', kind: 'debt', amount: '0.00', sortOrder: 1 }
  ]
}

export const useBalanceStore = defineStore('balance', {
  state: (): BalanceState => ({
    snapshot: null,
    items: [],
    history: [],
    draftMonth: currentMonthKey(),
    draftNotes: '',
    draftItems: defaultDraftItems(),
    loading: false,
    lastSavedAt: null
  }),
  getters: {
    draftTotals(state) {
      return calculateBalanceTotals(
        state.draftItems.map((item) => ({
          kind: item.kind,
          amount: item.amount || '0'
        }))
      )
    },
    savedTotals(state) {
      return calculateBalanceTotals(state.items)
    },
    evolution(state) {
      return calculateFinancialEvolution(state.history)
    },
    latestEvolution(state) {
      return calculateFinancialEvolution(state.history).at(-1) ?? null
    }
  },
  actions: {
    async loadMonth(month: MonthKey) {
      this.loading = true
      try {
        const { snapshot, items } = await getBalanceSnapshotByMonth(month)
        this.snapshot = snapshot
        this.items = items
        this.draftMonth = month
        this.draftNotes = snapshot?.notes ?? ''
        this.draftItems = items.length
          ? items.map((item) => ({
              id: item.id,
              name: item.name,
              kind: item.kind,
              amount: item.amount,
              institution: item.institution,
              notes: item.notes,
              sortOrder: item.sortOrder
            }))
          : defaultDraftItems()
      } finally {
        this.loading = false
      }
    },
    addItem(kind: BalanceDraftItemInput['kind'] = 'asset') {
      this.draftItems.push({
        name: '',
        kind,
        amount: '0.00',
        sortOrder: this.draftItems.length
      })
    },
    updateItem(index: number, item: BalanceDraftItemInput) {
      this.draftItems[index] = {
        ...item,
        amount: item.amount || '0.00',
        sortOrder: index
      }
    },
    removeItem(index: number) {
      this.draftItems.splice(index, 1)
      this.draftItems = this.draftItems.map((item, sortOrder) => ({ ...item, sortOrder }))
    },
    async save() {
      const saved = await saveBalanceSnapshot({
        month: this.draftMonth,
        notes: this.draftNotes,
        items: this.draftItems
      })
      this.snapshot = saved.snapshot
      this.items = saved.items
      this.draftItems = saved.items.map((item) => ({
        id: item.id,
        name: item.name,
        kind: item.kind,
        amount: item.amount,
        institution: item.institution,
        notes: item.notes,
        sortOrder: item.sortOrder
      }))
      this.lastSavedAt = new Date().toISOString()
      await this.loadHistory()
    },
    async loadHistory() {
      this.history = await getBalanceHistory()
    }
  }
})

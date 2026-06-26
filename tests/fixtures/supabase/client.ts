import type { FinanceSupabaseClient } from '@/storage/supabase/client'

export interface SupabaseResponse<T> {
  data: T
  error: null
}

type TableName =
  | 'profiles'
  | 'monthly_budgets'
  | 'budget_categories'
  | 'expenses'
  | 'balance_snapshots'
  | 'balance_items'
  | 'visual_preferences'

type Row = Record<string, unknown> & { id: string }

type Store = Record<TableName, Row[]>

export function ok<T>(data: T): SupabaseResponse<T> {
  return { data, error: null }
}

export function createSupabaseClientDouble(overrides: Partial<FinanceSupabaseClient> = {}) {
  return overrides as FinanceSupabaseClient
}

function createEmptyStore(): Store {
  return {
    profiles: [],
    monthly_budgets: [],
    budget_categories: [],
    expenses: [],
    balance_snapshots: [],
    balance_items: [],
    visual_preferences: []
  }
}

class QueryBuilder {
  private filters: Array<(row: Row) => boolean> = []
  private orderBy: { column: string; ascending: boolean } | null = null
  private selected = false
  private deleteMode = false
  private maybeSingleMode = false
  private countMode = false
  private headMode = false
  private limitCount: number | null = null
  private pendingUpsert: Row[] | null = null

  constructor(
    private readonly store: Store,
    private readonly table: TableName
  ) {}

  select(_columns?: string, options?: { count?: 'exact'; head?: boolean }) {
    void _columns
    this.selected = true
    this.countMode = options?.count === 'exact'
    this.headMode = options?.head === true
    return this
  }

  eq(column: string, value: unknown) {
    this.filters.push((row) => row[column] === value)
    return this
  }

  neq(column: string, value: unknown) {
    this.filters.push((row) => row[column] !== value)
    return this
  }

  in(column: string, values: unknown[]) {
    this.filters.push((row) => values.includes(row[column]))
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy = { column, ascending: options?.ascending ?? true }
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  maybeSingle() {
    this.maybeSingleMode = true
    return this.execute()
  }

  upsert(rows: Row | Row[]) {
    this.pendingUpsert = Array.isArray(rows) ? rows : [rows]
    return this.execute()
  }

  delete() {
    this.deleteMode = true
    return this
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.execute().then(onfulfilled, onrejected)
  }

  private async execute() {
    if (this.pendingUpsert) {
      for (const row of this.pendingUpsert) {
        const index = this.store[this.table].findIndex((existing) => existing.id === row.id)
        if (index >= 0) {
          this.store[this.table][index] = { ...this.store[this.table][index], ...row }
        } else {
          this.store[this.table].push({ ...row })
        }
      }
      return { data: null, error: null }
    }

    const filtered = this.applyFilters()

    if (this.deleteMode) {
      const ids = new Set(filtered.map((row) => row.id))
      this.store[this.table] = this.store[this.table].filter((row) => !ids.has(row.id))
      return { data: null, error: null }
    }

    let rows = filtered
    if (this.orderBy) {
      const { column, ascending } = this.orderBy
      rows = [...rows].sort((left, right) => {
        const a = String(left[column] ?? '')
        const b = String(right[column] ?? '')
        return ascending ? a.localeCompare(b) : b.localeCompare(a)
      })
    }

    if (this.limitCount !== null) rows = rows.slice(0, this.limitCount)

    if (this.countMode && this.headMode) {
      return { data: null, error: null, count: rows.length }
    }

    if (this.maybeSingleMode) {
      return { data: rows[0] ?? null, error: null }
    }

    if (this.selected) {
      return { data: rows, error: null }
    }

    return { data: null, error: null }
  }

  private applyFilters() {
    return this.store[this.table].filter((row) => this.filters.every((filter) => filter(row)))
  }
}

export function createInMemorySupabaseClient(initialData: Partial<Store> = {}) {
  const store = createEmptyStore()
  for (const [table, rows] of Object.entries(initialData) as Array<[TableName, Row[]]>) {
    store[table] = rows.map((row) => ({ ...row }))
  }

  const client = {
    from(table: TableName) {
      return new QueryBuilder(store, table)
    }
  }

  return {
    client: client as unknown as FinanceSupabaseClient,
    store
  }
}

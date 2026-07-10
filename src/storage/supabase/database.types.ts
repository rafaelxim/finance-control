export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          currency: 'BRL'
          active_month: string
          theme_mode: 'light' | 'dark' | 'system'
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id: string
          display_name?: string | null
          currency: 'BRL'
          active_month: string
          theme_mode: 'light' | 'dark' | 'system'
          created_at: string
          updated_at: string
          user_id?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          currency?: 'BRL'
          active_month?: string
          theme_mode?: 'light' | 'dark' | 'system'
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      monthly_budgets: {
        Row: {
          id: string
          month: string
          available_amount: string
          notes: string | null
          status: 'draft' | 'active' | 'closed'
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['monthly_budgets']['Row'], 'user_id'> & {
          user_id?: string
        }
        Update: Partial<Database['public']['Tables']['monthly_budgets']['Row']>
      }
      budget_categories: {
        Row: {
          id: string
          budget_id: string
          name: string
          allocation_type: 'fixed' | 'percentage'
          allocation_value: string
          computed_limit: string
          sort_order: number
          status: 'active' | 'archived'
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['budget_categories']['Row'], 'user_id'> & {
          user_id?: string
        }
        Update: Partial<Database['public']['Tables']['budget_categories']['Row']>
      }
      expenses: {
        Row: {
          id: string
          budget_id: string
          category_id: string
          amount: string
          date: string
          description: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'user_id'> & {
          user_id?: string
        }
        Update: Partial<Database['public']['Tables']['expenses']['Row']>
      }
      balance_snapshots: {
        Row: {
          id: string
          month: string
          notes: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['balance_snapshots']['Row'], 'user_id'> & {
          user_id?: string
        }
        Update: Partial<Database['public']['Tables']['balance_snapshots']['Row']>
      }
      balance_items: {
        Row: {
          id: string
          snapshot_id: string
          name: string
          kind: 'asset' | 'debt'
          amount: string
          institution: string | null
          notes: string | null
          sort_order: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['balance_items']['Row'], 'user_id'> & {
          user_id?: string
        }
        Update: Partial<Database['public']['Tables']['balance_items']['Row']>
      }
      visual_preferences: {
        Row: {
          id: string
          category_visuals: Record<string, string>
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['visual_preferences']['Row'], 'user_id'> & {
          user_id?: string
        }
        Update: Partial<Database['public']['Tables']['visual_preferences']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

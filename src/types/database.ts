export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      capacity_alerts: {
        Row: {
          id: string
          notified_at: string | null
          order_date: string
          product_id: string
        }
        Insert: {
          id?: string
          notified_at?: string | null
          order_date: string
          product_id: string
        }
        Update: {
          id?: string
          notified_at?: string | null
          order_date?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capacity_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          is_active: boolean
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      homepage_pins: {
        Row: {
          category: string
          created_at: string | null
          id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          product_id: string
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "homepage_pins_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean
          link_url: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean
          link_url?: string | null
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean
          link_url?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      order_payment_logs: {
        Row: {
          changed_by: string | null
          created_at: string | null
          from_amount: number | null
          from_status: string | null
          id: string
          order_id: string
          to_amount: number
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          from_amount?: number | null
          from_status?: string | null
          id?: string
          order_id: string
          to_amount: number
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          from_amount?: number | null
          from_status?: string | null
          id?: string
          order_id?: string
          to_amount?: number
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_payment_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_payment_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "public_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_rate_limit: {
        Row: {
          created_at: string | null
          id: string
          ip_hash: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_hash: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_hash?: string
        }
        Relationships: []
      }
      order_status_logs: {
        Row: {
          changed_by: string | null
          created_at: string | null
          from_status: string
          id: string
          order_id: string
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          from_status: string
          id?: string
          order_id: string
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          from_status?: string
          id?: string
          order_id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "public_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_paid: number
          created_at: string | null
          customer_address: string | null
          customer_name: string
          customer_phone: string
          deleted_at: string | null
          id: string
          is_anonymous: boolean | null
          items: Json
          note: string | null
          order_code: string
          order_date: string
          payment_status: string
          status: string | null
          total: number
          user_id: string | null
        }
        Insert: {
          amount_paid?: number
          created_at?: string | null
          customer_address?: string | null
          customer_name: string
          customer_phone: string
          deleted_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          items: Json
          note?: string | null
          order_code: string
          order_date: string
          payment_status?: string
          status?: string | null
          total: number
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          customer_address?: string | null
          customer_name?: string
          customer_phone?: string
          deleted_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          items?: Json
          note?: string | null
          order_code?: string
          order_date?: string
          payment_status?: string
          status?: string | null
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      password_attempts: {
        Row: {
          created_at: string | null
          id: string
          ip_hash: string
          success: boolean
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_hash: string
          success?: boolean
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_hash?: string
          success?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          daily_capacity: number
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          min_order_qty: number
          name: string
          price: number
          ready_stock: number
        }
        Insert: {
          created_at?: string | null
          daily_capacity?: number
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          min_order_qty?: number
          name: string
          price: number
          ready_stock?: number
        }
        Update: {
          created_at?: string | null
          daily_capacity?: number
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          min_order_qty?: number
          name?: string
          price?: number
          ready_stock?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          phone?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      role_change_logs: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          new_role: string
          old_role: string
          user_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_role: string
          old_role: string
          user_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_role?: string
          old_role?: string
          user_id?: string
        }
        Relationships: []
      }
      schedule: {
        Row: {
          date: string
          id: string
          is_available: boolean | null
          note: string | null
        }
        Insert: {
          date: string
          id?: string
          is_available?: boolean | null
          note?: string | null
        }
        Update: {
          date?: string
          id?: string
          is_available?: boolean | null
          note?: string | null
        }
        Relationships: []
      }
      settings_audit_logs: {
        Row: {
          action: string
          changed_by: string | null
          created_at: string | null
          id: string
          key: string
        }
        Insert: {
          action: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          key: string
        }
        Update: {
          action?: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          key?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          platform: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          platform: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          platform?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_orders: {
        Row: {
          customer_name: string | null
          id: string | null
          order_date: string | null
          status: string | null
        }
        Insert: {
          customer_name?: string | null
          id?: string | null
          order_date?: string | null
          status?: string | null
        }
        Update: {
          customer_name?: string | null
          id?: string | null
          order_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_and_create_capacity_alert: {
        Args: { p_order_date: string; p_product_id: string }
        Returns: Json
      }
      count_role_change_logs: { Args: { p_days?: number }; Returns: number }
      get_capacity_utilization: {
        Args: never
        Returns: {
          daily_capacity: number
          order_date: string
          product_id: string
          product_name: string
          used_qty: number
          utilization: number
        }[]
      }
      get_monthly_revenue: {
        Args: { p_months?: number }
        Returns: {
          month_key: string
          month_label: string
          order_count: number
          revenue: number
        }[]
      }
      get_order_payment_timeline: {
        Args: { p_order_id: string }
        Returns: {
          changed_by: string
          changed_by_email: string
          changed_by_name: string
          created_at: string
          from_amount: number
          from_status: string
          id: string
          to_amount: number
          to_status: string
        }[]
      }
      get_order_timeline: {
        Args: { p_order_id: string }
        Returns: {
          changed_by: string
          changed_by_email: string
          changed_by_name: string
          created_at: string
          from_status: string
          id: string
          to_status: string
        }[]
      }
      get_product_capacity_for_date: {
        Args: { p_order_date: string }
        Returns: {
          daily_capacity: number
          product_id: string
          remaining: number
          used_qty: number
        }[]
      }
      get_top_customers: {
        Args: { p_end_date: string; p_limit?: number; p_start_date: string }
        Returns: {
          customer_name: string
          customer_phone: string
          order_count: number
          total_spent: number
        }[]
      }
      get_top_products: {
        Args: { p_end_date: string; p_limit?: number; p_start_date: string }
        Returns: {
          product_id: string
          product_name: string
          total_qty: number
          total_revenue: number
        }[]
      }
      get_top_selling_products: {
        Args: { p_days?: number; p_limit?: number }
        Returns: {
          product_id: string
          total_qty: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_superadmin: { Args: never; Returns: boolean }
      list_role_change_logs: {
        Args: { p_days?: number; p_limit?: number; p_offset?: number }
        Returns: {
          changed_by: string
          changed_by_display_name: string
          changed_by_email: string
          created_at: string
          id: string
          new_role: string
          old_role: string
          user_display_name: string
          user_email: string
          user_id: string
        }[]
      }
      list_users_with_profile: {
        Args: { p_query?: string; p_role?: string }
        Returns: {
          avatar_url: string
          created_at: string
          display_name: string
          email: string
          id: string
          phone: string
          role: string
        }[]
      }
      set_user_role: {
        Args: { p_new_role: string; p_user_id: string }
        Returns: Json
      }
      soft_delete_order: { Args: { p_order_id: string }; Returns: Json }
      update_order_data: {
        Args: {
          p_customer_address: string
          p_customer_name: string
          p_customer_phone: string
          p_items: Json
          p_note: string
          p_order_date: string
          p_order_id: string
        }
        Returns: Json
      }
      update_order_payment: {
        Args: {
          p_amount_paid: number
          p_new_status: string
          p_order_id: string
        }
        Returns: Json
      }
      update_order_status: {
        Args: { p_new_status: string; p_order_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

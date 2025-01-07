export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      csv_analysis: {
        Row: {
          created_at: string
          file_name: string
          id: string
          metrics_analysis: Json
          recommendations: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          metrics_analysis: Json
          recommendations: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          metrics_analysis?: Json
          recommendations?: string[]
          user_id?: string
        }
        Relationships: []
      }
      dismissed_notifications: {
        Row: {
          client: string | null
          dismissed_at: string | null
          id: string
          notification_type: string
          platform: string | null
          user_id: string
        }
        Insert: {
          client?: string | null
          dismissed_at?: string | null
          id?: string
          notification_type: string
          platform?: string | null
          user_id: string
        }
        Update: {
          client?: string | null
          dismissed_at?: string | null
          id?: string
          notification_type?: string
          platform?: string | null
          user_id?: string
        }
        Relationships: []
      }
      optimizations: {
        Row: {
          campaign_name: string
          categories: string[]
          client: string
          created_at: string
          effort_level: number
          hypothesis: string | null
          id: string
          impact_level: number
          kpi: string
          optimization_date: string
          platform: string
          recommended_action: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_name: string
          categories: string[]
          client: string
          created_at?: string
          effort_level: number
          hypothesis?: string | null
          id?: string
          impact_level: number
          kpi: string
          optimization_date: string
          platform: string
          recommended_action: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_name?: string
          categories?: string[]
          client?: string
          created_at?: string
          effort_level?: number
          hypothesis?: string | null
          id?: string
          impact_level?: number
          kpi?: string
          optimization_date?: string
          platform?: string
          recommended_action?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          has_seen_welcome: boolean | null
          id: string
          last_name: string | null
          position: Database["public"]["Enums"]["user_position"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          has_seen_welcome?: boolean | null
          id: string
          last_name?: string | null
          position?: Database["public"]["Enums"]["user_position"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          has_seen_welcome?: boolean | null
          id?: string
          last_name?: string | null
          position?: Database["public"]["Enums"]["user_position"] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_clients: {
        Row: {
          client: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          client: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          client?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_clients: {
        Args: {
          p_user_id: string
          p_clients: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      user_position:
        | "activation_executive"
        | "activation_manager"
        | "activation_director"
        | "digital_partner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

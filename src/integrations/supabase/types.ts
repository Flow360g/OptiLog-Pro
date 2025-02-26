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
          logo_path: string | null
          position: Database["public"]["Enums"]["user_position"] | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          has_seen_welcome?: boolean | null
          id: string
          last_name?: string | null
          logo_path?: string | null
          position?: Database["public"]["Enums"]["user_position"] | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          has_seen_welcome?: boolean | null
          id?: string
          last_name?: string | null
          logo_path?: string | null
          position?: Database["public"]["Enums"]["user_position"] | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rsa_optimizations: {
        Row: {
          additional_instructions: string | null
          ads_file_path: string | null
          created_at: string | null
          id: string
          keywords_file_path: string | null
          optimization_prompt: string | null
          output_file_path: string | null
          results: Json | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_instructions?: string | null
          ads_file_path?: string | null
          created_at?: string | null
          id?: string
          keywords_file_path?: string | null
          optimization_prompt?: string | null
          output_file_path?: string | null
          results?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_instructions?: string | null
          ads_file_path?: string | null
          created_at?: string | null
          id?: string
          keywords_file_path?: string | null
          optimization_prompt?: string | null
          output_file_path?: string | null
          results?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      test_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_templates: {
        Row: {
          created_at: string
          effort_level: number | null
          hypothesis: string
          id: string
          impact_level: number | null
          kpi: string
          name: string
          platform: string
          test_type_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effort_level?: number | null
          hypothesis: string
          id?: string
          impact_level?: number | null
          kpi: string
          name: string
          platform: string
          test_type_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effort_level?: number | null
          hypothesis?: string
          id?: string
          impact_level?: number | null
          kpi?: string
          name?: string
          platform?: string
          test_type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_templates_test_type_id_fkey"
            columns: ["test_type_id"]
            isOneToOne: false
            referencedRelation: "test_types"
            referencedColumns: ["id"]
          },
        ]
      }
      test_types: {
        Row: {
          category_id: string
          created_at: string
          default_hypothesis: string | null
          description: string | null
          id: string
          name: string
          tooltip: string | null
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          default_hypothesis?: string | null
          description?: string | null
          id?: string
          name: string
          tooltip?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          default_hypothesis?: string | null
          description?: string | null
          id?: string
          name?: string
          tooltip?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "test_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          client: string
          created_at: string
          effort_level: number | null
          end_date: string | null
          executive_summary: string | null
          hypothesis: string
          id: string
          impact_level: number | null
          kpi: string
          name: string
          platform: Database["public"]["Enums"]["test_platform"]
          results: Json | null
          start_date: string | null
          status: Database["public"]["Enums"]["test_status"]
          test_type_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client: string
          created_at?: string
          effort_level?: number | null
          end_date?: string | null
          executive_summary?: string | null
          hypothesis: string
          id?: string
          impact_level?: number | null
          kpi: string
          name: string
          platform: Database["public"]["Enums"]["test_platform"]
          results?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          test_type_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client?: string
          created_at?: string
          effort_level?: number | null
          end_date?: string | null
          executive_summary?: string | null
          hypothesis?: string
          id?: string
          impact_level?: number | null
          kpi?: string
          name?: string
          platform?: Database["public"]["Enums"]["test_platform"]
          results?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          test_type_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_test_type_id_fkey"
            columns: ["test_type_id"]
            isOneToOne: false
            referencedRelation: "test_types"
            referencedColumns: ["id"]
          },
        ]
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
      template_category: "new" | "library"
      test_category: "Creative Test" | "Audience Test" | "Bid Strategy Test"
      test_platform: "facebook" | "google" | "tiktok"
      test_status:
        | "draft"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
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

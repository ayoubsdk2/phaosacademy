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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academy_module_catalog: {
        Row: {
          day_id: number
          is_active: boolean
          module_id: string
          module_index: number
          module_type: string
          score_total: number | null
          updated_at: string
          xp: number
        }
        Insert: {
          day_id: number
          is_active?: boolean
          module_id: string
          module_index: number
          module_type: string
          score_total?: number | null
          updated_at?: string
          xp?: number
        }
        Update: {
          day_id?: number
          is_active?: boolean
          module_id?: string
          module_index?: number
          module_type?: string
          score_total?: number | null
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      client_errors: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json
          route: string | null
          stack: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json
          route?: string | null
          stack?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json
          route?: string | null
          stack?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coaching_transcripts: {
        Row: {
          created_at: string
          id: string
          module_id: string
          score: number | null
          transcript: Json
          user_id: string
          verdict: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          module_id: string
          score?: number | null
          transcript: Json
          user_id: string
          verdict?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string
          score?: number | null
          transcript?: Json
          user_id?: string
          verdict?: string | null
        }
        Relationships: []
      }
      executive_scripts: {
        Row: {
          audio_url: string | null
          created_at: string
          day_id: number
          id: string
          module_id: string
          script_text: string
          title: string
          video_url: string | null
          voice: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          day_id: number
          id?: string
          module_id: string
          script_text: string
          title: string
          video_url?: string | null
          voice: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          day_id?: number
          id?: string
          module_id?: string
          script_text?: string
          title?: string
          video_url?: string | null
          voice?: string
        }
        Relationships: []
      }
      jae_cohort_members: {
        Row: {
          added_at: string
          added_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string
          added_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      jae_user_profiles: {
        Row: {
          created_at: string
          id: string
          last_completed_day: number
          last_completed_module_index: number
          level: number
          quiz_score_pct: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_completed_day?: number
          last_completed_module_index?: number
          level?: number
          quiz_score_pct?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_completed_day?: number
          last_completed_module_index?: number
          level?: number
          quiz_score_pct?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jae_user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          day_id: number
          id: string
          module_id: string
          score: number | null
          status: string
          time_spent: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          day_id: number
          id?: string
          module_id: string
          score?: number | null
          status?: string
          time_spent?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          day_id?: number
          id?: string
          module_id?: string
          score?: number | null
          status?: string
          time_spent?: number | null
          user_id?: string
        }
        Relationships: []
      }
      manager_actions: {
        Row: {
          action: string
          created_at: string
          id: string
          manager_id: string
          metadata: Json
          target_user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          manager_id: string
          metadata?: Json
          target_user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          manager_id?: string
          metadata?: Json
          target_user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_streak: number
          full_name: string
          hidden_from_leaderboard: boolean
          id: string
          last_completed_day: number
          last_completed_module_index: number
          level: number
          onboarding_completed_at: string | null
          quiz_score_pct: number
          referriser_lives_used: number
          referriser_time_seconds: number
          total_xp: number
          tower_best_floor: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number
          full_name?: string
          hidden_from_leaderboard?: boolean
          id: string
          last_completed_day?: number
          last_completed_module_index?: number
          level?: number
          onboarding_completed_at?: string | null
          quiz_score_pct?: number
          referriser_lives_used?: number
          referriser_time_seconds?: number
          total_xp?: number
          tower_best_floor?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number
          full_name?: string
          hidden_from_leaderboard?: boolean
          id?: string
          last_completed_day?: number
          last_completed_module_index?: number
          level?: number
          onboarding_completed_at?: string | null
          quiz_score_pct?: number
          referriser_lives_used?: number
          referriser_time_seconds?: number
          total_xp?: number
          tower_best_floor?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          badge_name: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          badge_id: string
          badge_name: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          badge_name?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          day_id: number
          id: string
          module_id: string
          score: number | null
          status: string
          time_spent: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          day_id: number
          id?: string
          module_id: string
          score?: number | null
          status?: string
          time_spent?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          day_id?: number
          id?: string
          module_id?: string
          score?: number | null
          status?: string
          time_spent?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      academy_leaderboard_mv: {
        Row: {
          coaching_earned: number | null
          coaching_pct: number | null
          coaching_possible: number | null
          completion_pct: number | null
          full_name: string | null
          id: string | null
          last_completed_day: number | null
          last_completed_module_index: number | null
          level: number | null
          modules_completed: number | null
          profile_updated_at: string | null
          quiz_score_pct: number | null
          referriser_lives_used: number | null
          referriser_time_seconds: number | null
          total_modules: number | null
          total_xp: number | null
          tower_best_floor: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      ensure_current_user_academy_access: { Args: never; Returns: Json }
      get_academy_leaderboard: {
        Args: { _limit?: number }
        Returns: {
          coaching_earned: number
          coaching_pct: number
          coaching_possible: number
          completion_pct: number
          full_name: string
          id: string
          last_completed_day: number
          last_completed_module_index: number
          level: number
          modules_completed: number
          quiz_score_pct: number
          referriser_lives_used: number
          referriser_time_seconds: number
          total_modules: number
          total_xp: number
          tower_best_floor: number
        }[]
      }
      get_academy_manager_stats: {
        Args: never
        Returns: {
          coaching_earned: number
          coaching_pct: number
          coaching_possible: number
          completed_modules: number
          completion_pct: number
          full_name: string
          id: string
          last_completed_day: number
          last_completed_module_index: number
          level: number
          quiz_score_pct: number
          referriser_lives_used: number
          referriser_time_seconds: number
          total_modules: number
          total_xp: number
          tower_best_floor: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_jae_member: { Args: { _user_id: string }; Returns: boolean }
      is_superadmin: { Args: { _user_id: string }; Returns: boolean }
      recalculate_academy_profile: {
        Args: { _use_jae?: boolean; _user_id: string }
        Returns: undefined
      }
      refresh_academy_leaderboard_if_active: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "learner" | "manager"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["learner", "manager"],
    },
  },
} as const

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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          email: string | null
          id: string
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          email?: string | null
          id: string
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      suggestion: {
        Row: {
          cycleId: string
          director: string | null
          genre: string | null
          id: string
          imdbId: string | null
          imdbRating: string | null
          movieDetails: string | null
          movieTitle: string
          plot: string | null
          posterUrl: string | null
          runtime: string | null
          submittedAt: string
          submittedById: string
          year: string | null
        }
        Insert: {
          cycleId: string
          director?: string | null
          genre?: string | null
          id?: string
          imdbId?: string | null
          imdbRating?: string | null
          movieDetails?: string | null
          movieTitle: string
          plot?: string | null
          posterUrl?: string | null
          runtime?: string | null
          submittedAt?: string
          submittedById: string
          year?: string | null
        }
        Update: {
          cycleId?: string
          director?: string | null
          genre?: string | null
          id?: string
          imdbId?: string | null
          imdbRating?: string | null
          movieDetails?: string | null
          movieTitle?: string
          plot?: string | null
          posterUrl?: string | null
          runtime?: string | null
          submittedAt?: string
          submittedById?: string
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_cycleId_fkey"
            columns: ["cycleId"]
            isOneToOne: false
            referencedRelation: "VotingCycle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_submittedById_fkey"
            columns: ["submittedById"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vote: {
        Row: {
          cycleId: string
          id: string
          suggestionId: string
          votedAt: string
          voterId: string
        }
        Insert: {
          cycleId: string
          id?: string
          suggestionId: string
          votedAt?: string
          voterId: string
        }
        Update: {
          cycleId?: string
          id?: string
          suggestionId?: string
          votedAt?: string
          voterId?: string
        }
        Relationships: [
          {
            foreignKeyName: "vote_cycleId_fkey"
            columns: ["cycleId"]
            isOneToOne: false
            referencedRelation: "VotingCycle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vote_suggestionId_fkey"
            columns: ["suggestionId"]
            isOneToOne: false
            referencedRelation: "suggestion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vote_voterId_fkey"
            columns: ["voterId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      VotingCycle: {
        Row: {
          id: string
          name: string
          suggestionStart: string
          votingEnd: string
          votingStart: string
          winnerId: string | null
        }
        Insert: {
          id?: string
          name: string
          suggestionStart: string
          votingEnd: string
          votingStart: string
          winnerId?: string | null
        }
        Update: {
          id?: string
          name?: string
          suggestionStart?: string
          votingEnd?: string
          votingStart?: string
          winnerId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "VotingCycle_winnerId_fkey"
            columns: ["winnerId"]
            isOneToOne: true
            referencedRelation: "suggestion"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

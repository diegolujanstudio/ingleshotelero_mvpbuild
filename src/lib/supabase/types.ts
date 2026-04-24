/**
 * Database types — hand-authored to match supabase/migrations/0001_initial_schema.sql.
 *
 * Regenerate from Supabase once connected:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 *
 * All tables require `Relationships: []` so that Database["public"] satisfies
 * GenericSchema from @supabase/postgrest-js, which is required for createClient<Database>
 * to resolve Schema as Database["public"] rather than `never`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CEFRLevel = "A1" | "A2" | "B1" | "B2";
export type RoleModule = "bellboy" | "frontdesk" | "restaurant";
export type ExamType = "placement" | "monthly" | "final";
export type ExamStatus =
  | "in_progress"
  | "listening_done"
  | "speaking_done"
  | "scoring"
  | "complete"
  | "abandoned";
export type ScoringStatus = "pending" | "processing" | "complete" | "failed";
export type HRRole = "super_admin" | "org_admin" | "property_admin" | "viewer";
export type Shift = "morning" | "afternoon" | "night";
export type EmployeeSource = "self_registered" | "hr_invited" | "csv_imported";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          type: "chain" | "independent";
          logo_url: string | null;
          subscription_tier: "pilot" | "starter" | "professional" | "enterprise";
          subscription_status: "active" | "past_due" | "canceled" | "archived";
          max_properties: number;
          max_employees: number;
          billing_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: "chain" | "independent";
          logo_url?: string | null;
          subscription_tier?: "pilot" | "starter" | "professional" | "enterprise";
          subscription_status?: "active" | "past_due" | "canceled" | "archived";
          max_properties?: number;
          max_employees?: number;
          billing_email?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "chain" | "independent";
          logo_url?: string | null;
          subscription_tier?: "pilot" | "starter" | "professional" | "enterprise";
          subscription_status?: "active" | "past_due" | "canceled" | "archived";
          max_properties?: number;
          max_employees?: number;
          billing_email?: string | null;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          slug: string;
          city: string | null;
          state: string | null;
          country: string;
          room_count: number | null;
          timezone: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          slug: string;
          city?: string | null;
          state?: string | null;
          country?: string;
          room_count?: number | null;
          timezone?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          slug?: string;
          city?: string | null;
          state?: string | null;
          country?: string;
          room_count?: number | null;
          timezone?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      hr_users: {
        Row: {
          id: string;
          organization_id: string | null;
          property_id: string | null;
          email: string;
          name: string;
          role: HRRole;
          is_active: boolean;
          last_login_at: string | null;
          invite_sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id?: string | null;
          property_id?: string | null;
          email: string;
          name: string;
          role: HRRole;
          is_active?: boolean;
          last_login_at?: string | null;
          invite_sent_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          property_id?: string | null;
          email?: string;
          name?: string;
          role?: HRRole;
          is_active?: boolean;
          last_login_at?: string | null;
          invite_sent_at?: string | null;
        };
        Relationships: [];
      };
      employees: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          hotel_role: RoleModule;
          current_level: CEFRLevel | null;
          department: string | null;
          shift: Shift | null;
          whatsapp_opted_in: boolean;
          is_active: boolean;
          source: EmployeeSource;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          hotel_role: RoleModule;
          current_level?: CEFRLevel | null;
          department?: string | null;
          shift?: Shift | null;
          whatsapp_opted_in?: boolean;
          is_active?: boolean;
          source?: EmployeeSource;
        };
        Update: {
          id?: string;
          property_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          hotel_role?: RoleModule;
          current_level?: CEFRLevel | null;
          department?: string | null;
          shift?: Shift | null;
          whatsapp_opted_in?: boolean;
          is_active?: boolean;
          source?: EmployeeSource;
        };
        Relationships: [];
      };
      exam_sessions: {
        Row: {
          id: string;
          employee_id: string;
          module: RoleModule;
          exam_type: ExamType;
          status: ExamStatus;
          current_step: string;
          listening_score: number | null;
          listening_total: number;
          speaking_avg_score: number | null;
          final_level: CEFRLevel | null;
          level_confidence: number | null;
          started_at: string;
          completed_at: string | null;
          scored_at: string | null;
        };
        Insert: {
          id?: string;
          employee_id: string;
          module: RoleModule;
          exam_type: ExamType;
          status?: ExamStatus;
          current_step?: string;
          listening_score?: number | null;
          listening_total?: number;
          speaking_avg_score?: number | null;
          final_level?: CEFRLevel | null;
          level_confidence?: number | null;
          completed_at?: string | null;
          scored_at?: string | null;
        };
        Update: {
          id?: string;
          employee_id?: string;
          module?: RoleModule;
          exam_type?: ExamType;
          status?: ExamStatus;
          current_step?: string;
          listening_score?: number | null;
          listening_total?: number;
          speaking_avg_score?: number | null;
          final_level?: CEFRLevel | null;
          level_confidence?: number | null;
          completed_at?: string | null;
          scored_at?: string | null;
        };
        Relationships: [];
      };
      speaking_recordings: {
        Row: {
          id: string;
          session_id: string;
          prompt_index: number;
          audio_url: string;
          audio_duration_seconds: number | null;
          level_tag: CEFRLevel;
          transcript: string | null;
          ai_score_intent: number | null;
          ai_score_vocabulary: number | null;
          ai_score_fluency: number | null;
          ai_score_tone: number | null;
          ai_score_total: number | null;
          ai_feedback_es: string | null;
          ai_model_response: string | null;
          ai_level_estimate: CEFRLevel | null;
          scoring_status: ScoringStatus;
          scoring_attempts: number;
          created_at: string;
          scored_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          prompt_index: number;
          audio_url: string;
          audio_duration_seconds?: number | null;
          level_tag: CEFRLevel;
          transcript?: string | null;
          ai_score_intent?: number | null;
          ai_score_vocabulary?: number | null;
          ai_score_fluency?: number | null;
          ai_score_tone?: number | null;
          ai_score_total?: number | null;
          ai_feedback_es?: string | null;
          ai_model_response?: string | null;
          ai_level_estimate?: CEFRLevel | null;
          scoring_status?: ScoringStatus;
          scoring_attempts?: number;
          scored_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          prompt_index?: number;
          audio_url?: string;
          audio_duration_seconds?: number | null;
          level_tag?: CEFRLevel;
          transcript?: string | null;
          ai_score_intent?: number | null;
          ai_score_vocabulary?: number | null;
          ai_score_fluency?: number | null;
          ai_score_tone?: number | null;
          ai_score_total?: number | null;
          ai_feedback_es?: string | null;
          ai_model_response?: string | null;
          ai_level_estimate?: CEFRLevel | null;
          scoring_status?: ScoringStatus;
          scoring_attempts?: number;
          scored_at?: string | null;
        };
        Relationships: [];
      };
      diagnostic_answers: {
        Row: {
          id: string;
          session_id: string;
          question_index: number;
          answer_value: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_index: number;
          answer_value?: Json | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          question_index?: number;
          answer_value?: Json | null;
        };
        Relationships: [];
      };
      listening_answers: {
        Row: {
          id: string;
          session_id: string;
          question_index: number;
          selected_option: number;
          is_correct: boolean;
          level_tag: CEFRLevel;
          response_time_ms: number | null;
          replay_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_index: number;
          selected_option: number;
          is_correct: boolean;
          level_tag: CEFRLevel;
          response_time_ms?: number | null;
          replay_count?: number;
        };
        Update: {
          id?: string;
          session_id?: string;
          question_index?: number;
          selected_option?: number;
          is_correct?: boolean;
          level_tag?: CEFRLevel;
          response_time_ms?: number | null;
          replay_count?: number;
        };
        Relationships: [];
      };
      practice_sessions: {
        Row: {
          id: string;
          employee_id: string;
          date: string;
          channel: "web" | "whatsapp";
          listening_correct: number | null;
          speaking_score: number | null;
          vocabulary_reviewed: number | null;
          duration_seconds: number | null;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          date?: string;
          channel?: "web" | "whatsapp";
          listening_correct?: number | null;
          speaking_score?: number | null;
          vocabulary_reviewed?: number | null;
          duration_seconds?: number | null;
          completed?: boolean;
        };
        Update: {
          id?: string;
          employee_id?: string;
          date?: string;
          channel?: "web" | "whatsapp";
          listening_correct?: number | null;
          speaking_score?: number | null;
          vocabulary_reviewed?: number | null;
          duration_seconds?: number | null;
          completed?: boolean;
        };
        Relationships: [];
      };
      vocabulary_progress: {
        Row: {
          id: string;
          employee_id: string;
          word: string;
          module: RoleModule;
          level: CEFRLevel;
          ease_factor: number;
          interval_days: number;
          repetitions: number;
          last_reviewed_at: string | null;
          next_review_at: string | null;
          times_correct: number;
          times_incorrect: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          word: string;
          module: RoleModule;
          level: CEFRLevel;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          last_reviewed_at?: string | null;
          next_review_at?: string | null;
          times_correct?: number;
          times_incorrect?: number;
        };
        Update: {
          id?: string;
          employee_id?: string;
          word?: string;
          module?: RoleModule;
          level?: CEFRLevel;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          last_reviewed_at?: string | null;
          next_review_at?: string | null;
          times_correct?: number;
          times_incorrect?: number;
        };
        Relationships: [];
      };
      streaks: {
        Row: {
          id: string;
          employee_id: string;
          current_streak: number;
          longest_streak: number;
          last_practice_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_practice_date?: string | null;
        };
        Update: {
          id?: string;
          employee_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_practice_date?: string | null;
        };
        Relationships: [];
      };
      cohorts: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          module: RoleModule;
          target_level: CEFRLevel;
          start_date: string | null;
          end_date: string | null;
          completion_target_pct: number;
          status: "draft" | "active" | "completed" | "archived";
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          module: RoleModule;
          target_level: CEFRLevel;
          start_date?: string | null;
          end_date?: string | null;
          completion_target_pct?: number;
          status?: "draft" | "active" | "completed" | "archived";
          created_by?: string | null;
        };
        Update: {
          id?: string;
          property_id?: string;
          name?: string;
          module?: RoleModule;
          target_level?: CEFRLevel;
          start_date?: string | null;
          end_date?: string | null;
          completion_target_pct?: number;
          status?: "draft" | "active" | "completed" | "archived";
          created_by?: string | null;
        };
        Relationships: [];
      };
      cohort_members: {
        Row: {
          id: string;
          cohort_id: string;
          employee_id: string;
          enrollment_date: string;
          status: "active" | "completed" | "dropped" | "paused";
          completion_pct: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cohort_id: string;
          employee_id: string;
          enrollment_date?: string;
          status?: "active" | "completed" | "dropped" | "paused";
          completion_pct?: number;
        };
        Update: {
          id?: string;
          cohort_id?: string;
          employee_id?: string;
          enrollment_date?: string;
          status?: "active" | "completed" | "dropped" | "paused";
          completion_pct?: number;
        };
        Relationships: [];
      };
      content_items: {
        Row: {
          id: string;
          module: RoleModule;
          level: CEFRLevel;
          skill: "listening" | "speaking" | "vocabulary";
          item_type: "exam" | "drill" | "assessment";
          audio_text: string | null;
          audio_url: string | null;
          options: Json | null;
          scenario_es: string | null;
          expected_keywords: string[] | null;
          model_response: string | null;
          model_response_audio_url: string | null;
          word: string | null;
          word_audio_url: string | null;
          topic: string | null;
          is_active: boolean;
          usage_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          module: RoleModule;
          level: CEFRLevel;
          skill: "listening" | "speaking" | "vocabulary";
          item_type: "exam" | "drill" | "assessment";
          audio_text?: string | null;
          audio_url?: string | null;
          options?: Json | null;
          scenario_es?: string | null;
          expected_keywords?: string[] | null;
          model_response?: string | null;
          model_response_audio_url?: string | null;
          word?: string | null;
          word_audio_url?: string | null;
          topic?: string | null;
          is_active?: boolean;
          usage_count?: number;
        };
        Update: {
          id?: string;
          module?: RoleModule;
          level?: CEFRLevel;
          skill?: "listening" | "speaking" | "vocabulary";
          item_type?: "exam" | "drill" | "assessment";
          audio_text?: string | null;
          audio_url?: string | null;
          options?: Json | null;
          scenario_es?: string | null;
          expected_keywords?: string[] | null;
          model_response?: string | null;
          model_response_audio_url?: string | null;
          word?: string | null;
          word_audio_url?: string | null;
          topic?: string | null;
          is_active?: boolean;
          usage_count?: number;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          employee_id: string | null;
          property_id: string | null;
          session_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          employee_id?: string | null;
          property_id?: string | null;
          session_id?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          event_type?: string;
          employee_id?: string | null;
          property_id?: string | null;
          session_id?: string | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

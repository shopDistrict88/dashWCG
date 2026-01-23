// Supabase Database Types for WCG Creative Operating System

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'creator' | 'artist' | 'musician' | 'designer' | 'filmmaker' | 'writer' | 'builder' | 'business'
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          onboarding_completed: boolean
          creative_momentum_index: number
          audience_trust_score: number
          burnout_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'creator' | 'artist' | 'musician' | 'designer' | 'filmmaker' | 'writer' | 'builder' | 'business'
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          onboarding_completed?: boolean
          creative_momentum_index?: number
          audience_trust_score?: number
          burnout_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'creator' | 'artist' | 'musician' | 'designer' | 'filmmaker' | 'writer' | 'builder' | 'business'
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          onboarding_completed?: boolean
          creative_momentum_index?: number
          audience_trust_score?: number
          burnout_level?: number
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'active' | 'paused' | 'completed' | 'dormant' | 'archived'
          type: 'creative' | 'business' | 'personal' | 'collaboration'
          start_date: string | null
          target_date: string | null
          completion_date: string | null
          momentum_score: number
          dormancy_days: number
          version: number
          parent_project_id: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'active' | 'paused' | 'completed' | 'dormant' | 'archived'
          type?: 'creative' | 'business' | 'personal' | 'collaboration'
          start_date?: string | null
          target_date?: string | null
          completion_date?: string | null
          momentum_score?: number
          dormancy_days?: number
          version?: number
          parent_project_id?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          status?: 'active' | 'paused' | 'completed' | 'dormant' | 'archived'
          type?: 'creative' | 'business' | 'personal' | 'collaboration'
          start_date?: string | null
          target_date?: string | null
          completion_date?: string | null
          momentum_score?: number
          dormancy_days?: number
          version?: number
          parent_project_id?: string | null
          metadata?: Json | null
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: 'post' | 'article' | 'video' | 'music' | 'design' | 'other'
          status: 'draft' | 'scheduled' | 'published' | 'archived'
          platform: 'instagram' | 'youtube' | 'tiktok' | 'x' | 'spotify' | 'soundcloud' | 'website' | 'other' | null
          published_at: string | null
          scheduled_for: string | null
          views: number
          likes: number
          comments: number
          shares: number
          saves: number
          engagement_rate: number
          half_life_hours: number | null
          narrative_thread_id: string | null
          content_url: string | null
          thumbnail_url: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type: 'post' | 'article' | 'video' | 'music' | 'design' | 'other'
          status?: 'draft' | 'scheduled' | 'published' | 'archived'
          platform?: 'instagram' | 'youtube' | 'tiktok' | 'x' | 'spotify' | 'soundcloud' | 'website' | 'other' | null
          published_at?: string | null
          scheduled_for?: string | null
          views?: number
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          engagement_rate?: number
          half_life_hours?: number | null
          narrative_thread_id?: string | null
          content_url?: string | null
          thumbnail_url?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          type?: 'post' | 'article' | 'video' | 'music' | 'design' | 'other'
          status?: 'draft' | 'scheduled' | 'published' | 'archived'
          platform?: 'instagram' | 'youtube' | 'tiktok' | 'x' | 'spotify' | 'soundcloud' | 'website' | 'other' | null
          published_at?: string | null
          scheduled_for?: string | null
          views?: number
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          engagement_rate?: number
          half_life_hours?: number | null
          narrative_thread_id?: string | null
          content_url?: string | null
          thumbnail_url?: string | null
          metadata?: Json | null
          updated_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          user_id: string
          name: string
          tagline: string | null
          mission: string | null
          voice_description: string | null
          visual_identity: Json | null
          messaging_vault: Json | null
          consistency_score: number
          drift_detection_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          tagline?: string | null
          mission?: string | null
          voice_description?: string | null
          visual_identity?: Json | null
          messaging_vault?: Json | null
          consistency_score?: number
          drift_detection_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          tagline?: string | null
          mission?: string | null
          voice_description?: string | null
          visual_identity?: Json | null
          messaging_vault?: Json | null
          consistency_score?: number
          drift_detection_enabled?: boolean
          updated_at?: string
        }
      }
      music_files: {
        Row: {
          id: string
          user_id: string
          title: string
          file_url: string
          file_type: 'beat' | 'track' | 'demo' | 'stems' | 'cover' | 'master'
          duration_seconds: number | null
          bpm: number | null
          key: string | null
          genre: string | null
          mood: string | null
          is_released: boolean
          release_date: string | null
          collaborators: string[] | null
          plays: number
          saves: number
          revenue: number
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_url: string
          file_type: 'beat' | 'track' | 'demo' | 'stems' | 'cover' | 'master'
          duration_seconds?: number | null
          bpm?: number | null
          key?: string | null
          genre?: string | null
          mood?: string | null
          is_released?: boolean
          release_date?: string | null
          collaborators?: string[] | null
          plays?: number
          saves?: number
          revenue?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          file_url?: string
          file_type?: 'beat' | 'track' | 'demo' | 'stems' | 'cover' | 'master'
          duration_seconds?: number | null
          bpm?: number | null
          key?: string | null
          genre?: string | null
          mood?: string | null
          is_released?: boolean
          release_date?: string | null
          collaborators?: string[] | null
          plays?: number
          saves?: number
          revenue?: number
          metadata?: Json | null
          updated_at?: string
        }
      }
      design_files: {
        Row: {
          id: string
          user_id: string
          title: string
          file_url: string
          file_type: 'design' | 'source' | 'export' | 'concept' | 'mockup'
          file_format: string
          dimensions: string | null
          tags: string[] | null
          project_id: string | null
          thumbnail_url: string | null
          usage_rights: string | null
          client_ready: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_url: string
          file_type: 'design' | 'source' | 'export' | 'concept' | 'mockup'
          file_format: string
          dimensions?: string | null
          tags?: string[] | null
          project_id?: string | null
          thumbnail_url?: string | null
          usage_rights?: string | null
          client_ready?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          file_url?: string
          file_type?: 'design' | 'source' | 'export' | 'concept' | 'mockup'
          file_format?: string
          dimensions?: string | null
          tags?: string[] | null
          project_id?: string | null
          thumbnail_url?: string | null
          usage_rights?: string | null
          client_ready?: boolean
          metadata?: Json | null
          updated_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string | null
          status: 'captured' | 'expanded' | 'validated' | 'active' | 'dormant' | 'archived'
          viability_score: number | null
          ai_expansion: string | null
          parent_idea_id: string | null
          lineage_depth: number
          dormancy_days: number
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category?: string | null
          status?: 'captured' | 'expanded' | 'validated' | 'active' | 'dormant' | 'archived'
          viability_score?: number | null
          ai_expansion?: string | null
          parent_idea_id?: string | null
          lineage_depth?: number
          dormancy_days?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          category?: string | null
          status?: 'captured' | 'expanded' | 'validated' | 'active' | 'dormant' | 'archived'
          viability_score?: number | null
          ai_expansion?: string | null
          parent_idea_id?: string | null
          lineage_depth?: number
          dormancy_days?: number
          metadata?: Json | null
          updated_at?: string
        }
      }
      experiments: {
        Row: {
          id: string
          user_id: string
          name: string
          hypothesis: string | null
          type: 'ab_test' | 'content_format' | 'timing' | 'messaging' | 'platform' | 'other'
          status: 'planned' | 'running' | 'completed' | 'paused'
          start_date: string | null
          end_date: string | null
          results: Json | null
          impact_score: number | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          hypothesis?: string | null
          type?: 'ab_test' | 'content_format' | 'timing' | 'messaging' | 'platform' | 'other'
          status?: 'planned' | 'running' | 'completed' | 'paused'
          start_date?: string | null
          end_date?: string | null
          results?: Json | null
          impact_score?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          hypothesis?: string | null
          type?: 'ab_test' | 'content_format' | 'timing' | 'messaging' | 'platform' | 'other'
          status?: 'planned' | 'running' | 'completed' | 'paused'
          start_date?: string | null
          end_date?: string | null
          results?: Json | null
          impact_score?: number | null
          metadata?: Json | null
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          messages: Json
          context_snapshot: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          messages: Json
          context_snapshot?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string | null
          messages?: Json
          context_snapshot?: Json | null
          updated_at?: string
        }
      }
      social_connections: {
        Row: {
          id: string
          user_id: string
          platform: 'instagram' | 'youtube' | 'tiktok' | 'x' | 'spotify' | 'soundcloud'
          platform_user_id: string | null
          username: string | null
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          is_active: boolean
          followers_count: number
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'instagram' | 'youtube' | 'tiktok' | 'x' | 'spotify' | 'soundcloud'
          platform_user_id?: string | null
          username?: string | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          is_active?: boolean
          followers_count?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          platform_user_id?: string | null
          username?: string | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          is_active?: boolean
          followers_count?: number
          metadata?: Json | null
          updated_at?: string
        }
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
  }
}

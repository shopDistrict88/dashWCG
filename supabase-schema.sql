-- WCG Creative Operating System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('creator', 'artist', 'musician', 'designer', 'filmmaker', 'writer', 'builder', 'business')),
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  creative_momentum_index NUMERIC DEFAULT 50.0,
  audience_trust_score NUMERIC DEFAULT 50.0,
  burnout_level NUMERIC DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'dormant', 'archived')),
  type TEXT DEFAULT 'creative' CHECK (type IN ('creative', 'business', 'personal', 'collaboration')),
  start_date TIMESTAMP WITH TIME ZONE,
  target_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  momentum_score NUMERIC DEFAULT 50.0,
  dormancy_days INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  parent_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('post', 'article', 'video', 'music', 'design', 'other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  platform TEXT CHECK (platform IN ('instagram', 'youtube', 'tiktok', 'x', 'spotify', 'soundcloud', 'website', 'other')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0.0,
  half_life_hours NUMERIC,
  narrative_thread_id UUID,
  content_url TEXT,
  thumbnail_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  mission TEXT,
  voice_description TEXT,
  visual_identity JSONB,
  messaging_vault JSONB,
  consistency_score NUMERIC DEFAULT 50.0,
  drift_detection_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Music files table
CREATE TABLE IF NOT EXISTS music_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('beat', 'track', 'demo', 'stems', 'cover', 'master')),
  duration_seconds INTEGER,
  bpm INTEGER,
  key TEXT,
  genre TEXT,
  mood TEXT,
  is_released BOOLEAN DEFAULT FALSE,
  release_date TIMESTAMP WITH TIME ZONE,
  collaborators TEXT[],
  plays INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0.0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Design files table
CREATE TABLE IF NOT EXISTS design_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('design', 'source', 'export', 'concept', 'mockup')),
  file_format TEXT NOT NULL,
  dimensions TEXT,
  tags TEXT[],
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  usage_rights TEXT,
  client_ready BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'captured' CHECK (status IN ('captured', 'expanded', 'validated', 'active', 'dormant', 'archived')),
  viability_score NUMERIC,
  ai_expansion TEXT,
  parent_idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  lineage_depth INTEGER DEFAULT 0,
  dormancy_days INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiments table
CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hypothesis TEXT,
  type TEXT DEFAULT 'ab_test' CHECK (type IN ('ab_test', 'content_format', 'timing', 'messaging', 'platform', 'other')),
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'running', 'completed', 'paused')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  results JSONB,
  impact_score NUMERIC,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB NOT NULL,
  context_snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social connections table
CREATE TABLE IF NOT EXISTS social_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'youtube', 'tiktok', 'x', 'spotify', 'soundcloud')),
  platform_user_id TEXT,
  username TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  followers_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_platform ON content(platform);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_music_files_user_id ON music_files(user_id);
CREATE INDEX IF NOT EXISTS idx_design_files_user_id ON design_files(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_user_id ON social_connections(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Content policies
CREATE POLICY "Users can view own content" ON content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content" ON content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content" ON content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content" ON content FOR DELETE USING (auth.uid() = user_id);

-- Brands policies
CREATE POLICY "Users can view own brands" ON brands FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brands" ON brands FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brands" ON brands FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own brands" ON brands FOR DELETE USING (auth.uid() = user_id);

-- Music files policies
CREATE POLICY "Users can view own music" ON music_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own music" ON music_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own music" ON music_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own music" ON music_files FOR DELETE USING (auth.uid() = user_id);

-- Design files policies
CREATE POLICY "Users can view own designs" ON design_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own designs" ON design_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own designs" ON design_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own designs" ON design_files FOR DELETE USING (auth.uid() = user_id);

-- Ideas policies
CREATE POLICY "Users can view own ideas" ON ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ideas" ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ideas" ON ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON ideas FOR DELETE USING (auth.uid() = user_id);

-- Experiments policies
CREATE POLICY "Users can view own experiments" ON experiments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experiments" ON experiments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiments" ON experiments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experiments" ON experiments FOR DELETE USING (auth.uid() = user_id);

-- AI conversations policies
CREATE POLICY "Users can view own conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON ai_conversations FOR DELETE USING (auth.uid() = user_id);

-- Social connections policies
CREATE POLICY "Users can view own connections" ON social_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own connections" ON social_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own connections" ON social_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own connections" ON social_connections FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'creator')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_music_files_updated_at BEFORE UPDATE ON music_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_design_files_updated_at BEFORE UPDATE ON design_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON experiments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_connections_updated_at BEFORE UPDATE ON social_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

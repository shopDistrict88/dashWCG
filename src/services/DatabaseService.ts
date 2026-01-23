/**
 * DatabaseService - Centralized service for all Supabase database operations
 * Provides type-safe CRUD operations for all tables with error handling
 */

import { supabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { Database } from '../types/database'

type Tables = Database['public']['Tables']

class DatabaseService {
  /**
   * Check if Supabase is configured
   */
  isConfigured(): boolean {
    return isSupabaseConfigured()
  }

  // ===== PROFILES =====

  async getProfile(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error: error as Error }
    }
  }

  async updateProfile(
    userId: string,
    updates: Tables['profiles']['Update']
  ) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error: error as Error }
    }
  }

  // ===== PROJECTS =====

  async getProjects(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return { data: null, error: error as Error }
    }
  }

  async getProject(projectId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching project:', error)
      return { data: null, error: error as Error }
    }
  }

  async createProject(project: Tables['projects']['Insert']) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .insert(project)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating project:', error)
      return { data: null, error: error as Error }
    }
  }

  async updateProject(projectId: string, updates: Tables['projects']['Update']) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating project:', error)
      return { data: null, error: error as Error }
    }
  }

  async deleteProject(projectId: string) {
    if (!this.isConfigured()) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting project:', error)
      return { error: error as Error }
    }
  }

  // ===== CONTENT =====

  async getContent(userId: string, status?: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      let query = supabaseClient
        .from('content')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching content:', error)
      return { data: null, error: error as Error }
    }
  }

  async createContent(content: Tables['content']['Insert']) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('content')
        .insert(content)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating content:', error)
      return { data: null, error: error as Error }
    }
  }

  async updateContent(contentId: string, updates: Tables['content']['Update']) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('content')
        .update(updates)
        .eq('id', contentId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating content:', error)
      return { data: null, error: error as Error }
    }
  }

  async deleteContent(contentId: string) {
    if (!this.isConfigured()) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { error } = await supabaseClient
        .from('content')
        .delete()
        .eq('id', contentId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting content:', error)
      return { error: error as Error }
    }
  }

  // ===== BRANDS =====

  async getBrands(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('brands')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching brands:', error)
      return { data: null, error: error as Error }
    }
  }

  async createBrand(brand: Tables['brands']['Insert']) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('brands')
        .insert(brand)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating brand:', error)
      return { data: null, error: error as Error }
    }
  }

  async updateBrand(brandId: string, updates: Tables['brands']['Update']) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient
        .from('brands')
        .update(updates)
        .eq('id', brandId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating brand:', error)
      return { data: null, error: error as Error }
    }
  }

  // ===== SIMPLIFIED METHODS FOR OTHER TABLES =====
  // Use similar pattern as above for music_files, design_files, ideas, experiments, ai_conversations, social_connections

  async getMusicFiles(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    const { data, error } = await supabaseClient
      .from('music_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error: error as Error | null }
  }

  async getDesignFiles(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    const { data, error } = await supabaseClient
      .from('design_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error: error as Error | null }
  }

  async getIdeas(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    const { data, error } = await supabaseClient
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error: error as Error | null }
  }

  async getExperiments(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    const { data, error } = await supabaseClient
      .from('experiments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error: error as Error | null }
  }

  async getAIConversations(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    const { data, error } = await supabaseClient
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    return { data, error: error as Error | null }
  }

  async getSocialConnections(userId: string) {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    const { data, error } = await supabaseClient
      .from('social_connections')
      .select('*')
      .eq('user_id', userId)
      .order('connected_at', { ascending: false })
    return { data, error: error as Error | null }
  }

  // ===== STORAGE OPERATIONS =====

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<{ data: { path: string; url: string } | null; error: Error | null }> {
    if (!this.isConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return {
        data: {
          path: data.path,
          url: urlData.publicUrl,
        },
        error: null,
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      return { data: null, error: error as Error }
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(
    bucket: string,
    path: string
  ): Promise<{ error: Error | null }> {
    if (!this.isConfigured()) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { error } = await supabaseClient.storage.from(bucket).remove([path])

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error deleting file:', error)
      return { error: error as Error }
    }
  }

  /**
   * Get public URL for a file in storage
   */
  getFileUrl(bucket: string, path: string): string | null {
    if (!this.isConfigured()) {
      return null
    }

    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Export class for testing
export default DatabaseService

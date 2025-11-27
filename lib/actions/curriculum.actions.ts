'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CurriculumDocument } from '@/types'

export interface UploadCurriculumDocumentInput {
  title: string
  description?: string
  file_path: string
  file_url: string
  file_type: string
  file_size: number
  program_id?: string
  course_id?: string
  category: 'syllabus' | 'curriculum' | 'handbook' | 'guide' | 'template' | 'other'
}

/**
 * Upload a curriculum document
 */
export async function uploadCurriculumDocument(input: UploadCurriculumDocumentInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to upload documents.')
  }

  const { data, error } = await supabase
    .from('curriculum_documents')
    .insert([
      {
        title: input.title,
        description: input.description,
        file_path: input.file_path,
        file_url: input.file_url,
        file_type: input.file_type,
        file_size: input.file_size,
        program_id: input.program_id || null,
        course_id: input.course_id || null,
        category: input.category,
        uploaded_by: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to upload document: ${error.message}`)
  }

  revalidatePath('/admin/curriculum')
  return data as CurriculumDocument
}

/**
 * Get all curriculum documents
 */
export async function getCurriculumDocuments(filters?: {
  program_id?: string
  course_id?: string
  category?: string
}): Promise<CurriculumDocument[]> {
  const supabase = await createClient()

  if (!supabase) {
    return []
  }

  let query = supabase.from('curriculum_documents').select('*').order('created_at', { ascending: false })

  if (filters?.program_id) {
    query = query.eq('program_id', filters.program_id)
  }

  if (filters?.course_id) {
    query = query.eq('course_id', filters.course_id)
  }

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching curriculum documents:', error)
    return []
  }

  return (data || []) as CurriculumDocument[]
}

/**
 * Delete a curriculum document
 */
export async function deleteCurriculumDocument(id: string) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { error } = await supabase.from('curriculum_documents').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`)
  }

  revalidatePath('/admin/curriculum')
  return { success: true }
}


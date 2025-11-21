'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ProgramCourse } from '@/types'

export interface CreateProgramCourseInput {
  program_id: string
  course_id: string
  semester: number
  year: number
}

export async function linkCourseToProgram(input: CreateProgramCourseInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase
    .from('program_courses')
    .insert([
      {
        program_id: input.program_id,
        course_id: input.course_id,
        semester: input.semester,
        year: input.year,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to link course to program: ${error.message}`)
  }

  revalidatePath(`/admin/programs/${input.program_id}`)
  return data
}

export async function getProgramCourses(programId: string) {
  const supabase = await createClient()

  if (!supabase) {
    // Return empty array when Supabase is not configured
    return []
  }

  const { data, error } = await supabase
    .from('program_courses')
    .select(`
      *,
      courses (
        id,
        course_code,
        title,
        description
      )
    `)
    .eq('program_id', programId)
    .order('year', { ascending: true })
    .order('semester', { ascending: true })

  if (error) {
    console.error('Error fetching program courses:', error)
    return []
  }

  return data || []
}

export async function unlinkCourseFromProgram(id: string, programId: string) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { error } = await supabase
    .from('program_courses')
    .eq('id', id)
    .delete()

  if (error) {
    throw new Error(`Failed to unlink course: ${error.message}`)
  }

  revalidatePath(`/admin/programs/${programId}`)
}


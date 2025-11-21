'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Course } from '@/types'

export interface CreateCourseInput {
  course_code: string
  title: string
  description: string
}

export async function createCourse(input: CreateCourseInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase
    .from('courses')
    .insert([
      {
        course_code: input.course_code,
        title: input.title,
        description: input.description,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create course: ${error.message}`)
  }

  revalidatePath('/admin/courses')
  return data
}

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient()

  if (!supabase) {
    // Return mock data when Supabase is not configured
    return [
      {
        id: '1',
        course_code: 'CTH 101',
        title: 'Old Testament Survey',
        description: 'An overview of the Old Testament',
        created_at: new Date().toISOString(),
      },
    ]
  }

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('course_code', { ascending: true })

  if (error) {
    console.error('Error fetching courses:', error)
    // Return mock data on error
    return [
      {
        id: '1',
        course_code: 'CTH 101',
        title: 'Old Testament Survey',
        description: 'An overview of the Old Testament',
        created_at: new Date().toISOString(),
      },
    ]
  }

  return data || []
}

export async function getCourseById(id: string): Promise<Course | null> {
  const supabase = await createClient()

  if (!supabase) {
    // Return mock data when Supabase is not configured
    return {
      id: id,
      course_code: 'CTH 101',
      title: 'Old Testament Survey',
      description: 'An overview of the Old Testament',
      created_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }

  return data
}

export async function updateCourse(id: string, input: CreateCourseInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase
    .from('courses')
    .update({
      course_code: input.course_code,
      title: input.title,
      description: input.description,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update course: ${error.message}`)
  }

  revalidatePath('/admin/courses')
  return data
}

export async function deleteCourse(id: string) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { error } = await supabase
    .from('courses')
    .eq('id', id)
    .delete()

  if (error) {
    throw new Error(`Failed to delete course: ${error.message}`)
  }

  revalidatePath('/admin/courses')
}


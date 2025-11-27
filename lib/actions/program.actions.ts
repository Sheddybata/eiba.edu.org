'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Program } from '@/types'

export interface CreateProgramInput {
  title: string
  duration_years: number
  level?: 'Certificate' | 'Diploma' | 'Degree'
  mode?: 'Full-time' | 'Part-time' | 'Online' | 'Hybrid'
  description?: string
}

export async function createProgram(input: CreateProgramInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase
    .from('programs')
    .insert([
      {
        title: input.title,
        duration_years: input.duration_years,
        level: input.level,
        mode: input.mode,
        description: input.description,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create program: ${error.message}`)
  }

  revalidatePath('/admin/programs')
  return data
}

export async function getPrograms(): Promise<Program[]> {
  const supabase = await createClient()

  if (!supabase) {
    // Return mock data when Supabase is not configured
    return [
      {
        id: '1',
        title: 'Diploma in Theology',
        duration_years: 2,
        created_at: new Date().toISOString(),
      },
    ]
  }

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching programs:', error)
    // Return mock data on error
    return [
      {
        id: '1',
        title: 'Diploma in Theology',
        duration_years: 2,
        created_at: new Date().toISOString(),
      },
    ]
  }

  return data || []
}

export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = await createClient()

  if (!supabase) {
    // Return mock data when Supabase is not configured
    return {
      id: id,
      title: 'Diploma in Theology',
      duration_years: 2,
      created_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching program:', error)
    return null
  }

  return data
}

export async function updateProgram(id: string, input: CreateProgramInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase
    .from('programs')
    .update({
      title: input.title,
      duration_years: input.duration_years,
      level: input.level,
      mode: input.mode,
      description: input.description,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update program: ${error.message}`)
  }

  revalidatePath('/admin/programs')
  revalidatePath(`/admin/programs/${id}`)
  return data
}

export async function deleteProgram(id: string) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete program: ${error.message}`)
  }

  revalidatePath('/admin/programs')
}


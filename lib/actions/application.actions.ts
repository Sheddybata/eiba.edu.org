'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Application } from '@/types'

export interface CreateApplicationInput {
  full_name: string
  email: string
  phone: string
  country: string
  program_id?: string
  program_title?: string
  preferred_schedule: string
  desired_start_term?: string
  payment_plan?: string
  testimony: string
  ministry_context?: string
  reference_name: string
  reference_relationship: string
  reference_email: string
  reference_phone?: string
  reference_notes?: string
}

export interface UpdateApplicationStatusInput {
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'waitlisted'
  admin_notes?: string
}

/**
 * Submit a new application
 */
export async function submitApplication(input: CreateApplicationInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase
    .from('applications')
    .insert([
      {
        full_name: input.full_name,
        email: input.email,
        phone: input.phone,
        country: input.country,
        program_id: input.program_id || null,
        program_title: input.program_title,
        preferred_schedule: input.preferred_schedule,
        desired_start_term: input.desired_start_term,
        payment_plan: input.payment_plan,
        testimony: input.testimony,
        ministry_context: input.ministry_context,
        reference_name: input.reference_name,
        reference_relationship: input.reference_relationship,
        reference_email: input.reference_email,
        reference_phone: input.reference_phone,
        reference_notes: input.reference_notes,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to submit application: ${error.message}`)
  }

  revalidatePath('/admin/applications')
  return data
}

/**
 * Get all applications (admin only)
 */
export async function getApplications(status?: string): Promise<Application[]> {
  const supabase = await createClient()

  if (!supabase) {
    // Return empty array when Supabase is not configured
    return []
  }

  let query = supabase.from('applications').select('*').order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  return (data || []) as Application[]
}

/**
 * Get a single application by ID
 */
export async function getApplicationById(id: string): Promise<Application | null> {
  const supabase = await createClient()

  if (!supabase) {
    return null
  }

  const { data, error } = await supabase.from('applications').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching application:', error)
    return null
  }

  return data as Application
}

/**
 * Update application status (admin only)
 */
export async function updateApplicationStatus(
  id: string,
  input: UpdateApplicationStatusInput
): Promise<Application> {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  // Get current user for reviewed_by
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('applications')
    .update({
      status: input.status,
      admin_notes: input.admin_notes,
      reviewed_by: user?.id || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update application: ${error.message}`)
  }

  revalidatePath('/admin/applications')
  revalidatePath(`/admin/applications/${id}`)
  return data as Application
}

/**
 * Get application statistics
 */
export async function getApplicationStats() {
  const supabase = await createClient()

  if (!supabase) {
    return {
      total: 0,
      pending: 0,
      reviewing: 0,
      approved: 0,
      rejected: 0,
      waitlisted: 0,
    }
  }

  const { data, error } = await supabase.from('applications').select('status')

  if (error) {
    console.error('Error fetching application stats:', error)
    return {
      total: 0,
      pending: 0,
      reviewing: 0,
      approved: 0,
      rejected: 0,
      waitlisted: 0,
    }
  }

  const stats = {
    total: data?.length || 0,
    pending: data?.filter((a) => a.status === 'pending').length || 0,
    reviewing: data?.filter((a) => a.status === 'reviewing').length || 0,
    approved: data?.filter((a) => a.status === 'approved').length || 0,
    rejected: data?.filter((a) => a.status === 'rejected').length || 0,
    waitlisted: data?.filter((a) => a.status === 'waitlisted').length || 0,
  }

  return stats
}


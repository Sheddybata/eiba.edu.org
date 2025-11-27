'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface LoginInput {
  email: string
  password: string
}

export interface SignUpInput {
  email: string
  password: string
  full_name?: string
}

/**
 * Sign in with email and password
 */
export async function signIn(input: LoginInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error('Login failed. Please check your credentials.')
  }

  // Determine redirect based on user role
  // TODO: Check user_roles table to determine if admin/faculty or student
  // For now, redirect to dashboard
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign up a new user
 * Note: In production, you may want to disable direct signup
 * and use an admin approval process instead
 */
export async function signUp(input: SignUpInput) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.full_name,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  // After signup, you may want to:
  // 1. Create a student record
  // 2. Send verification email
  // 3. Redirect to a "check your email" page

  revalidatePath('/', 'layout')
  return { user: data.user, session: data.session }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  if (!supabase) {
    return null
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Get the current user's role
 */
export async function getUserRole() {
  const supabase = await createClient()

  if (!supabase) {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Query user_roles table
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    // Default to 'student' if no role found
    return 'student'
  }

  return data.role as 'student' | 'faculty' | 'admin'
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}


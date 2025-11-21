'use server'

import { createClient } from '@/lib/supabase/server'
import type { Student, StudentProgram, StudentCourse } from '@/types'

export async function getCurrentStudent() {
  const supabase = await createClient()

  if (!supabase) {
    // Return mock data when Supabase is not configured
    return {
      id: '1',
      user_id: 'mock-user-id',
      program_id: '1',
      created_at: new Date().toISOString(),
    }
  }

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error fetching user:', userError)
    // Return mock data for now
    return {
      id: '1',
      user_id: 'mock-user-id',
      program_id: '1',
      created_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching student:', error)
    // Return mock data for now
    return {
      id: '1',
      user_id: user.id,
      program_id: '1',
      created_at: new Date().toISOString(),
    }
  }

  return data
}

export async function getStudentProgram(programId: string): Promise<StudentProgram | null> {
  const supabase = await createClient()

  if (!supabase) {
    // Return mock data when Supabase is not configured
    return {
      id: programId,
      title: 'Diploma in Theology',
      duration_years: 2,
    }
  }

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', programId)
    .single()

  if (error) {
    console.error('Error fetching student program:', error)
    // Return mock data for now
    return {
      id: programId,
      title: 'Diploma in Theology',
      duration_years: 2,
    }
  }

  return data
}

export async function getStudentCourses(programId: string, currentSemester: number, currentYear: number): Promise<StudentCourse[]> {
  const supabase = await createClient()

  if (!supabase) {
    // Return mock data when Supabase is not configured
    return [
      {
        id: '1',
        course_code: 'CTH 101',
        title: 'Old Testament Survey',
        description: 'An overview of the Old Testament',
        semester: currentSemester,
        year: currentYear,
        progress: 45,
      },
      {
        id: '2',
        course_code: 'CTH 102',
        title: 'New Testament Survey',
        description: 'An overview of the New Testament',
        semester: currentSemester,
        year: currentYear,
        progress: 30,
      },
    ]
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
    .eq('semester', currentSemester)
    .eq('year', currentYear)

  if (error) {
    console.error('Error fetching student courses:', error)
    // Return mock data for now
    return [
      {
        id: '1',
        course_code: 'CTH 101',
        title: 'Old Testament Survey',
        description: 'An overview of the Old Testament',
        semester: currentSemester,
        year: currentYear,
        progress: 45,
      },
      {
        id: '2',
        course_code: 'CTH 102',
        title: 'New Testament Survey',
        description: 'An overview of the New Testament',
        semester: currentSemester,
        year: currentYear,
        progress: 30,
      },
    ]
  }

  // Transform the data to match StudentCourse interface
  return (data || []).map((pc: any) => ({
    id: pc.courses.id,
    course_code: pc.courses.course_code,
    title: pc.courses.title,
    description: pc.courses.description,
    semester: pc.semester,
    year: pc.year,
    progress: Math.floor(Math.random() * 100), // Mock progress for now
  }))
}


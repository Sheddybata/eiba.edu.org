export interface Program {
  id: string
  title: string
  duration_years: number
  level?: 'Diploma' | 'Certificate' | 'Degree'
  mode?: 'Full-time' | 'Part-time' | 'Online' | 'Hybrid'
  description?: string
  created_at: string
}

export interface Course {
  id: string
  course_code: string
  title: string
  description: string | null
  credits?: number
  category?: 'Core' | 'Elective'
  instructor?: string
  created_at: string
}

export interface ProgramCourse {
  id: string
  program_id: string
  course_id: string
  semester: number
  year: number
  created_at: string
}

export interface Student {
  id: string
  user_id: string
  program_id: string | null
  created_at: string
}

export interface StudentProgram {
  id: string
  title: string
  duration_years: number
  level?: Program['level']
}

export interface StudentCourse {
  id: string
  course_code: string
  title: string
  description: string | null
  semester: number
  year: number
  progress: number
  credits?: number
  instructor?: string
}

export interface Milestone {
  id: string
  program_id: string
  title: string
  description: string
  type: 'assignment' | 'exam' | 'retreat' | 'practicum' | 'checkpoint'
  due_date: string
  semester: number
  year: number
  completed: boolean
  course_id?: string
}

export interface Announcement {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'urgent'
  created_at: string
  author: string
  read: boolean
  target_audience?: 'all' | 'program' | 'course'
  target_id?: string
}

export interface CourseResource {
  id: string
  course_id: string
  title: string
  type: 'syllabus' | 'slides' | 'video' | 'reading' | 'assignment' | 'link'
  url?: string
  file_path?: string
  description?: string
}

export interface ModuleReadingPage {
  id: string
  title: string
  content: string
  display_order: number
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  description: string
  display_order: number
  completed: boolean
  resources: CourseResource[]
  videoUrl?: string
  readingPages?: ModuleReadingPage[]
}

export interface StudyGroup {
  id: string
  name: string
  course_id?: string
  program_id: string
  description: string
  member_count: number
  meeting_schedule?: string
  created_at: string
}

export interface CommunityEvent {
  id: string
  title: string
  description: string
  event_date: string
  event_time?: string
  location?: string
  type: 'cohort' | 'workshop' | 'social' | 'spiritual'
  program_id?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  course_id?: string
  milestone_id?: string
  created_at: string
}

export interface FocusSession {
  id: string
  duration_minutes: number
  course_id?: string
  task_id?: string
  completed_at: string
  notes?: string
}

export interface SupportService {
  id: string
  name: string
  description: string
  contact_email?: string
  contact_phone?: string
  booking_url?: string
  available: boolean
  category: 'advising' | 'counseling' | 'chaplaincy' | 'tech' | 'academic'
}

export interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  country: string
  program_id: string | null
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
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'waitlisted'
  reviewed_by?: string
  reviewed_at?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface CurriculumDocument {
  id: string
  title: string
  description?: string
  file_path: string
  file_url: string
  file_type: string
  file_size: number
  program_id?: string
  course_id?: string
  category: 'syllabus' | 'curriculum' | 'handbook' | 'guide' | 'template' | 'other'
  uploaded_by: string
  created_at: string
}


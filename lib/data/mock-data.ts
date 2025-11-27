import type {
  Course,
  Program,
  ProgramCourse,
  Student,
  StudentCourse,
  StudentProgram,
  Milestone,
  Announcement,
  CourseResource,
  CourseModule,
  StudyGroup,
  CommunityEvent,
  Task,
  FocusSession,
  SupportService,
} from '@/types'

const now = new Date().toISOString()

export const mockPrograms: Program[] = [
  {
    id: 'program-1',
    title: 'Diploma in Theology',
    duration_years: 2,
    level: 'Diploma',
    mode: 'Full-time',
    description: 'A foundational program covering biblical studies, theology, and ministry fundamentals.',
    created_at: now,
  },
  {
    id: 'program-2',
    title: 'Bachelor of Christian Education',
    duration_years: 4,
    level: 'Degree',
    mode: 'Hybrid',
    description: 'Prepares future educators with a blend of pedagogy, theology, and leadership.',
    created_at: now,
  },
  {
    id: 'program-3',
    title: 'Certificate in Worship Arts',
    duration_years: 1,
    level: 'Certificate',
    mode: 'Part-time',
    description: 'Focuses on contemporary worship leadership, music theory, and production.',
    created_at: now,
  },
]

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    course_code: 'CTH 101',
    title: 'Old Testament Survey',
    description: 'An overview of the Old Testament highlighting key themes.',
    credits: 3,
    category: 'Core',
    instructor: 'Prophet Dr. Isa El-buba Sadiq',
    created_at: now,
  },
  {
    id: 'course-2',
    course_code: 'CTH 102',
    title: 'New Testament Foundations',
    description: 'Explores the life of Christ and the early church.',
    credits: 3,
    category: 'Core',
    instructor: 'Pastor Choice El-buba',
    created_at: now,
  },
  {
    id: 'course-3',
    course_code: 'CED 210',
    title: 'Principles of Christian Education',
    description: 'Pedagogical strategies for faith-based environments.',
    credits: 4,
    category: 'Core',
    instructor: 'Prophet Dr. Isa El-buba Sadiq',
    created_at: now,
  },
  {
    id: 'course-4',
    course_code: 'WOR 205',
    title: 'Creative Worship Design',
    description: 'Practical course on crafting immersive worship experiences.',
    credits: 2,
    category: 'Elective',
    instructor: 'Pastor Choice El-buba',
    created_at: now,
  },
  {
    id: 'course-5',
    course_code: 'MIN 330',
    title: 'Pastoral Care & Counseling',
    description: 'Equips students with counseling skills for ministry contexts.',
    credits: 3,
    category: 'Core',
    instructor: 'Prophet Dr. Isa El-buba Sadiq',
    created_at: now,
  },
]

export const mockProgramCourses: ProgramCourse[] = [
  { id: 'pc-1', program_id: 'program-1', course_id: 'course-1', semester: 1, year: 1, created_at: now },
  { id: 'pc-2', program_id: 'program-1', course_id: 'course-2', semester: 1, year: 1, created_at: now },
  { id: 'pc-3', program_id: 'program-1', course_id: 'course-5', semester: 2, year: 1, created_at: now },
  { id: 'pc-4', program_id: 'program-2', course_id: 'course-3', semester: 1, year: 1, created_at: now },
  { id: 'pc-5', program_id: 'program-2', course_id: 'course-1', semester: 1, year: 1, created_at: now },
  { id: 'pc-6', program_id: 'program-3', course_id: 'course-4', semester: 1, year: 1, created_at: now },
]

export const mockStudent: Student = {
  id: 'student-1',
  user_id: 'mock-user-id',
  program_id: 'program-1',
  created_at: now,
}

export const mockStudentProgram: StudentProgram = {
  id: mockStudent.program_id!,
  title: 'Diploma in Theology',
  duration_years: 2,
  level: 'Diploma',
}

export function getMockCourseById(courseId: string) {
  return mockCourses.find((course) => course.id === courseId)
}

export function getMockProgramById(programId: string) {
  return mockPrograms.find((program) => program.id === programId)
}

export function getMockProgramCourses(programId: string) {
  return mockProgramCourses.filter((pc) => pc.program_id === programId)
}

export function getMockStudentCourses(
  programId: string,
  currentSemester: number,
  currentYear: number
): StudentCourse[] {
  const linkedCourses = mockProgramCourses.filter(
    (pc) =>
      pc.program_id === programId &&
      pc.semester === currentSemester &&
      pc.year === currentYear
  )

  return linkedCourses.map((pc) => {
    const course = getMockCourseById(pc.course_id)!
    return {
      id: course.id,
      course_code: course.course_code,
      title: course.title,
      description: course.description,
      semester: pc.semester,
      year: pc.year,
      progress: Math.floor(Math.random() * 60) + 20,
      credits: course.credits,
      instructor: course.instructor,
    }
  })
}

// Milestones
export const mockMilestones: Milestone[] = [
  {
    id: 'm1',
    program_id: 'program-1',
    title: 'Old Testament Survey - Midterm Exam',
    description: 'Comprehensive exam covering Genesis through 2 Kings',
    type: 'exam',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    semester: 1,
    year: 1,
    completed: false,
    course_id: 'course-1',
  },
  {
    id: 'm2',
    program_id: 'program-1',
    title: 'Worship Reflection Essay',
    description: 'Submit a 1500-word reflection on contemporary worship practices',
    type: 'assignment',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    semester: 1,
    year: 1,
    completed: false,
    course_id: 'course-2',
  },
  {
    id: 'm3',
    program_id: 'program-1',
    title: 'Spiritual Formation Retreat',
    description: 'Weekend retreat focusing on personal spiritual growth',
    type: 'retreat',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    semester: 1,
    year: 1,
    completed: false,
  },
  {
    id: 'm4',
    program_id: 'program-1',
    title: 'Module 1 Checkpoint',
    description: 'Complete all assignments and quizzes for Module 1',
    type: 'checkpoint',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    semester: 1,
    year: 1,
    completed: true,
  },
]

// Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'New Course Materials Available',
    message: 'Week 3 lecture slides and reading materials have been uploaded to the course portal.',
    type: 'info',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: 'Prophet Dr. Isa El-buba Sadiq',
    read: false,
    target_audience: 'course',
    target_id: 'course-1',
  },
  {
    id: 'a2',
    title: 'Grade Posted: Old Testament Survey Quiz',
    message: 'Your quiz results are now available. Average score: 87%.',
    type: 'success',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author: 'Pastor Choice El-buba',
    read: false,
    target_audience: 'course',
    target_id: 'course-1',
  },
  {
    id: 'a3',
    title: 'Upcoming Program Meeting',
    message: 'All first-year students are invited to a program orientation meeting next Monday at 2 PM.',
    type: 'info',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    author: 'Prophet Dr. Isa El-buba Sadiq',
    read: true,
    target_audience: 'program',
    target_id: 'program-1',
  },
  {
    id: 'a4',
    title: 'Library Hours Extended',
    message: 'The library will be open until 10 PM during exam week.',
    type: 'info',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'Library Services',
    read: true,
    target_audience: 'all',
  },
]

// Course Resources
export const mockCourseResources: CourseResource[] = [
  {
    id: 'r1',
    course_id: 'course-1',
    title: 'Course Syllabus',
    type: 'syllabus',
    url: '#',
    description: 'Complete course outline and grading rubric',
  },
  {
    id: 'r2-video',
    course_id: 'course-1',
    title: 'Pre-recorded Lecture: Covenant Foundations',
    type: 'video',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    description: 'Prophet Dr. Isa El-buba Sadiq teaching through Genesis 1-3',
  },
  {
    id: 'r2',
    course_id: 'course-1',
    title: 'Week 1 Lecture Slides',
    type: 'slides',
    url: '#',
    description: 'Introduction to Old Testament Studies',
  },
  {
    id: 'r3',
    course_id: 'course-1',
    title: 'Required Reading: Genesis Commentary',
    type: 'reading',
    url: '#',
    description: 'Chapter 1-11 analysis',
  },
  {
    id: 'r4',
    course_id: 'course-1',
    title: 'Zoom Office Hours',
    type: 'link',
    url: 'https://zoom.us/j/123456789',
    description: 'Every Tuesday 2-3 PM',
  },
]

// Course Modules
export const mockCourseModules: CourseModule[] = [
  {
    id: 'mod1',
    course_id: 'course-1',
    title: 'Module 1: Introduction to Old Testament',
    description: 'Foundational concepts and historical context',
    display_order: 1,
    completed: true,
    resources: mockCourseResources.filter((r) => r.course_id === 'course-1'),
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      readingPages: [
      {
        id: 'mod1-page1',
        title: 'Why Genesis Still Speaks',
        content:
          'Prophet Dr. Isa El-buba Sadiq unpacks how the opening chapters of Genesis reveal the nature of covenant love and provide a blueprint for ministry today.',
        display_order: 1,
      },
      {
        id: 'mod1-page2',
        title: 'Formation Practices',
        content:
          'Practice lectio divina with Genesis 12 and journal how God calls Abram into mission. Use the reflection prompts to discern your own calling statements.',
        display_order: 2,
      },
    ],
  },
  {
    id: 'mod2',
    course_id: 'course-1',
    title: 'Module 2: The Pentateuch',
    description: 'Genesis through Deuteronomy',
    display_order: 2,
    completed: false,
    resources: [],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    readingPages: [
      {
        id: 'mod2-page1',
        title: 'Walk with Moses',
        content:
          'Pastor Choice El-buba guides you through Exodus, highlighting leadership lessons, intercession, and obedience in the wilderness.',
        display_order: 1,
      },
      {
        id: 'mod2-page2',
        title: 'Tabernacle Patterns',
        content:
          'Study the tabernacle blueprints and note how worship spaces today can mirror reverence, beauty, and accessibility for new believers.',
        display_order: 2,
      },
    ],
  },
  {
    id: 'mod3',
    course_id: 'course-1',
    title: 'Module 3: Historical Books',
    description: 'Joshua through 2 Kings',
    display_order: 3,
    completed: false,
    resources: [],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    readingPages: [
      {
        id: 'mod3-page1',
        title: 'Leadership Transitions',
        content:
          "Prophet Dr. Isa challenges you to compare Joshua's commissioning with your transition moments. What promises sustain your obedience?",
        display_order: 1,
      },
      {
        id: 'mod3-page2',
        title: 'Prophetic Courage',
        content:
          "Reflect on Elijah and Elisha's persistence. Write a short prayer asking God for double portions to serve your city.",
        display_order: 2,
      },
    ],
  },
]

// Study Groups
export const mockStudyGroups: StudyGroup[] = [
  {
    id: 'sg1',
    name: 'OT Survey Study Group',
    course_id: 'course-1',
    program_id: 'program-1',
    description: 'Weekly study sessions for Old Testament Survey',
    member_count: 8,
    meeting_schedule: 'Thursdays 6-7 PM',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sg2',
    name: 'Theology Cohort 2024',
    program_id: 'program-1',
    description: 'General study group for all theology students',
    member_count: 15,
    meeting_schedule: 'Saturdays 10 AM-12 PM',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Community Events
export const mockCommunityEvents: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Cohort Welcome Social',
    description: 'Meet and greet for all new students',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    event_time: '6:00 PM',
    location: 'Student Center',
    type: 'social',
    program_id: 'program-1',
  },
  {
    id: 'e2',
    title: 'Biblical Hermeneutics Workshop',
    description: 'Learn advanced techniques for biblical interpretation',
    event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    event_time: '2:00 PM',
    location: 'Room 201',
    type: 'workshop',
  },
  {
    id: 'e3',
    title: 'Morning Prayer & Devotion',
    description: 'Weekly spiritual formation gathering',
    event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    event_time: '7:30 AM',
    location: 'Chapel',
    type: 'spiritual',
  },
]

// Tasks
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Read Genesis 1-11',
    description: 'Complete reading assignment for Module 1',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    priority: 'high',
    course_id: 'course-1',
    milestone_id: 'm4',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't2',
    title: 'Prepare for Midterm Exam',
    description: 'Review all lecture notes and readings',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    priority: 'high',
    course_id: 'course-1',
    milestone_id: 'm1',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't3',
    title: 'Draft Worship Reflection Essay',
    description: 'Start working on the 1500-word reflection',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    priority: 'medium',
    course_id: 'course-2',
    milestone_id: 'm2',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Support Services
export const mockSupportServices: SupportService[] = [
  {
    id: 'ss1',
    name: 'Academic Advising',
    description: 'Get guidance on course selection and academic planning',
    contact_email: 'advising@eiba.edu',
    contact_phone: '(555) 123-4567',
    booking_url: '#',
    available: true,
    category: 'advising',
  },
  {
    id: 'ss2',
    name: 'Student Counseling',
    description: 'Professional counseling services for personal and academic support',
    contact_email: 'counseling@eiba.edu',
    contact_phone: '(555) 123-4568',
    booking_url: '#',
    available: true,
    category: 'counseling',
  },
  {
    id: 'ss3',
    name: 'Chaplaincy Services',
    description: 'Spiritual guidance and pastoral care',
    contact_email: 'chaplain@eiba.edu',
    contact_phone: '(555) 123-4569',
    booking_url: '#',
    available: true,
    category: 'chaplaincy',
  },
  {
    id: 'ss4',
    name: 'IT Support',
    description: 'Technical assistance with portal, email, and software',
    contact_email: 'itsupport@eiba.edu',
    contact_phone: '(555) 123-4570',
    booking_url: '#',
    available: true,
    category: 'tech',
  },
]

// Helper functions
export function getMockMilestones(programId: string, semester?: number, year?: number): Milestone[] {
  let filtered = mockMilestones.filter((m) => m.program_id === programId)
  if (semester !== undefined) filtered = filtered.filter((m) => m.semester === semester)
  if (year !== undefined) filtered = filtered.filter((m) => m.year === year)
  return filtered.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
}

export function getMockAnnouncements(studentProgramId?: string): Announcement[] {
  return mockAnnouncements
    .filter((a) => a.target_audience === 'all' || (a.target_audience === 'program' && a.target_id === studentProgramId))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getMockUnreadAnnouncementsCount(): number {
  return mockAnnouncements.filter((a) => !a.read).length
}

export function getMockCourseModules(courseId: string): CourseModule[] {
  return mockCourseModules
    .filter((m) => m.course_id === courseId)
    .sort((a, b) => a.display_order - b.display_order)
}

export function getMockCourseResources(courseId: string): CourseResource[] {
  return mockCourseResources.filter((r) => r.course_id === courseId)
}

export function getMockStudyGroups(programId: string, courseId?: string): StudyGroup[] {
  return mockStudyGroups.filter((sg) => {
    if (courseId) return sg.course_id === courseId && sg.program_id === programId
    return sg.program_id === programId
  })
}

export function getMockCommunityEvents(programId?: string): CommunityEvent[] {
  return mockCommunityEvents
    .filter((e) => !programId || !e.program_id || e.program_id === programId)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 5)
}

export function getMockTasks(): Task[] {
  return mockTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (a.due_date && b.due_date) return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    return 0
  })
}


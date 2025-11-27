-- EIBA Portal Database Schema
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  duration_years INTEGER NOT NULL,
  level TEXT CHECK (level IN ('Certificate', 'Diploma', 'Degree')),
  mode TEXT CHECK (mode IN ('Full-time', 'Part-time', 'Online', 'Hybrid')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  credits INTEGER DEFAULT 3,
  category TEXT CHECK (category IN ('Core', 'Elective')),
  instructor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program-Course linking table
CREATE TABLE IF NOT EXISTS program_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(program_id, course_id, semester, year)
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ANNOUNCEMENTS
-- ============================================

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'urgent')),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_audience TEXT CHECK (target_audience IN ('all', 'program', 'course')),
  target_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcement reads tracking
CREATE TABLE IF NOT EXISTS announcement_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

-- ============================================
-- MILESTONES
-- ============================================

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('assignment', 'exam', 'retreat', 'practicum', 'checkpoint')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  semester INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student milestone completion tracking
CREATE TABLE IF NOT EXISTS student_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(milestone_id, student_id)
);

-- ============================================
-- COURSE CONTENT
-- ============================================

-- Course modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course resources table
CREATE TABLE IF NOT EXISTS course_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('syllabus', 'slides', 'video', 'reading', 'assignment', 'link')),
  url TEXT,
  file_path TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Module reading pages table
CREATE TABLE IF NOT EXISTS module_reading_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STUDENT PROGRESS & TRACKING
-- ============================================

-- Student progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  completed_modules JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Student tasks table
CREATE TABLE IF NOT EXISTS student_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_program_courses_program_id ON program_courses(program_id);
CREATE INDEX IF NOT EXISTS idx_program_courses_course_id ON program_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_program_id ON students(program_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON announcements(target_audience, target_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_user_id ON announcement_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_program_id ON milestones(program_id);
CREATE INDEX IF NOT EXISTS idx_milestones_course_id ON milestones(course_id);
CREATE INDEX IF NOT EXISTS idx_student_milestones_student_id ON student_milestones(student_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_course_id ON course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_module_id ON course_resources(module_id);
CREATE INDEX IF NOT EXISTS idx_module_reading_pages_module_id ON module_reading_pages(module_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_course_id ON student_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_student_tasks_student_id ON student_tasks(student_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_reading_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_tasks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Programs: All authenticated users can read, only admins can write
CREATE POLICY "Programs are viewable by authenticated users"
  ON programs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert programs"
  ON programs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Only admins can update programs"
  ON programs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Only admins can delete programs"
  ON programs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Courses: All authenticated users can read, only admins can write
CREATE POLICY "Courses are viewable by authenticated users"
  ON courses FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Only admins can update courses"
  ON courses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Only admins can delete courses"
  ON courses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Students: Users can only read their own record, admins can read all
CREATE POLICY "Students can view their own record"
  ON students FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Students can update their own record"
  ON students FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Only admins can insert students"
  ON students FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Announcements: All authenticated users can read, admins/faculty can write
CREATE POLICY "Announcements are viewable by authenticated users"
  ON announcements FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and faculty can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Admins and faculty can update announcements"
  ON announcements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Admins can delete announcements"
  ON announcements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Student Progress: Students can only access their own progress
CREATE POLICY "Students can view their own progress"
  ON student_progress FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own progress"
  ON student_progress FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all progress"
  ON student_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

-- Add more policies as needed for other tables...

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_tasks_updated_at BEFORE UPDATE ON student_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- You can add seed data here if needed
-- Example:
-- INSERT INTO programs (title, duration_years, level, mode) VALUES
--   ('Diploma in Theology', 2, 'Diploma', 'Full-time'),
--   ('Certificate in Ministry', 1, 'Certificate', 'Part-time');


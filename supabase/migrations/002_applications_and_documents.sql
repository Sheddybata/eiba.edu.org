-- Applications and Curriculum Documents Migration
-- Run this after 001_initial_schema.sql

-- ============================================
-- APPLICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  program_title TEXT, -- Store program name in case program is deleted
  preferred_schedule TEXT NOT NULL,
  desired_start_term TEXT,
  payment_plan TEXT,
  testimony TEXT NOT NULL,
  ministry_context TEXT,
  reference_name TEXT NOT NULL,
  reference_relationship TEXT NOT NULL,
  reference_email TEXT NOT NULL,
  reference_phone TEXT,
  reference_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'waitlisted')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CURRICULUM DOCUMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS curriculum_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('syllabus', 'curriculum', 'handbook', 'guide', 'template', 'other')),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_program_id ON applications(program_id);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_curriculum_documents_program_id ON curriculum_documents(program_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_documents_course_id ON curriculum_documents(course_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_documents_category ON curriculum_documents(category);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_documents ENABLE ROW LEVEL SECURITY;

-- Applications: Public can create, admins can read/update
CREATE POLICY "Anyone can submit an application"
  ON applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

-- Curriculum Documents: All authenticated users can read, admins can write
CREATE POLICY "Authenticated users can view curriculum documents"
  ON curriculum_documents FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can upload curriculum documents"
  ON curriculum_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "Admins can update curriculum documents"
  ON curriculum_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'faculty')
    )
  );

CREATE POLICY "Admins can delete curriculum documents"
  ON curriculum_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curriculum_documents_updated_at BEFORE UPDATE ON curriculum_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


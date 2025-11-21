# EIBA Portal

A comprehensive educational institution management system built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

### Admin Panel
- **Programs Management**: Create and manage academic programs (degrees)
- **Courses Management**: Create and manage courses
- **Program-Course Linking**: Link courses to programs with semester and year information

### Student Dashboard
- View enrolled program information
- View current semester courses with progress tracking
- Modern, Coursera-like interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Backend**: Supabase
- **Form Handling**: React Hook Form + Zod

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application expects the following Supabase tables:

### programs
- `id` (uuid, primary key)
- `title` (text)
- `duration_years` (integer)
- `created_at` (timestamp)

### courses
- `id` (uuid, primary key)
- `course_code` (text)
- `title` (text)
- `description` (text, nullable)
- `created_at` (timestamp)

### program_courses
- `id` (uuid, primary key)
- `program_id` (uuid, foreign key to programs)
- `course_id` (uuid, foreign key to courses)
- `semester` (integer)
- `year` (integer)
- `created_at` (timestamp)

### students
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `program_id` (uuid, foreign key to programs, nullable)
- `created_at` (timestamp)

## Project Structure

```
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── programs/
│   │   │   ├── page.tsx        # Programs list page
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Program detail page
│   │   └── courses/
│   │       └── page.tsx        # Courses list page
│   ├── dashboard/
│   │   └── page.tsx            # Student dashboard
│   └── layout.tsx              # Root layout
├── components/
│   └── ui/                     # Shadcn/UI components
├── lib/
│   ├── actions/                # Server actions
│   └── supabase/               # Supabase client setup
└── package.json
```

## Routes

- `/` - Home page
- `/login` - Login page (Student & Faculty)
- `/apply` - Application page
- `/programs` - Programs and enrollment information
- `/admin` - Admin dashboard
- `/admin/programs` - Manage programs
- `/admin/programs/[id]` - Program details and course linking
- `/admin/courses` - Manage courses
- `/admin/students` - Student management
- `/admin/announcements` - Manage announcements
- `/admin/milestones` - Manage milestones
- `/dashboard` - Student dashboard
- `/profile` - Student profile and settings

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` (optional - app works with mock data)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional - app works with mock data)
5. Deploy!

The application works with mock data if Supabase environment variables are not configured.


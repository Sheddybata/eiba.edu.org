import Link from 'next/link'
import { ArrowRight, BookOpen, ClipboardList, GraduationCap, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockCourses, mockPrograms, mockProgramCourses } from '@/lib/data/mock-data'

export default function AdminDashboardPage() {
  const stats = [
    {
      label: 'Active Programs',
      value: mockPrograms.length,
      change: '+2 this quarter',
      icon: GraduationCap,
    },
    {
      label: 'Published Courses',
      value: mockCourses.length,
      change: '12 running this week',
      icon: BookOpen,
    },
    {
      label: 'Enrolled Students',
      value: 248,
      change: '+18 new enrollments',
      icon: Users,
    },
    {
      label: 'Program-Course Links',
      value: mockProgramCourses.length,
      change: '3 pending reviews',
      icon: ClipboardList,
    },
  ]

  const recentPrograms = mockPrograms.slice(0, 3)
  const highlightedCourses = mockCourses.slice(0, 4)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">EIBA Administration</p>
          <h1 className="text-3xl font-bold tracking-tight">Operational Overview</h1>
          <p className="text-muted-foreground mt-2">
            Track the health of your academic catalog, approve updates, and jump into key modules.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/courses">
              Manage Courses
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/programs">
              New Program
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recently Updated Programs</CardTitle>
              <CardDescription>Keep an eye on programs that were touched this month.</CardDescription>
            </div>
            <Button variant="ghost" asChild>
              <Link className="text-sm" href="/admin/programs">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPrograms.map((program) => (
              <div
                key={program.id}
                className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">{program.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{program.duration_years} years</p>
                  </div>
                  <Badge variant="info">{program.mode}</Badge>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/programs/${program.id}`}>Open</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Health</CardTitle>
            <CardDescription>Snapshot of trending courses and facilitators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {highlightedCourses.map((course) => (
              <div key={course.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{course.course_code}</p>
                    <p className="font-semibold">{course.title}</p>
                  </div>
                  <Badge variant={course.category === 'Core' ? 'success' : 'secondary'}>
                    {course.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Instructor • {course.instructor}
                </p>
              </div>
            ))}
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              Keep adding modules to maintain an engaging catalog.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


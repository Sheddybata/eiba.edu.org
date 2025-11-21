'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { mockCourses, mockPrograms, mockProgramCourses } from '@/lib/data/mock-data'
import type { Course, Program, ProgramCourse } from '@/types'
import { Plus, ArrowLeft, Trash2 } from 'lucide-react'

const linkCourseSchema = z.object({
  course_id: z.string().min(1, 'Course is required'),
  semester: z.number().min(1, 'Semester must be at least 1'),
  year: z.number().min(1, 'Year must be at least 1'),
})

type LinkCourseFormValues = z.infer<typeof linkCourseSchema>
type ProgramCourseWithMeta = ProgramCourse & { course: Course }

export default function ProgramDetailPage() {
  const params = useParams()
  const router = useRouter()
  const programId = params.id as string

  const [program] = useState<Program | undefined>(() =>
    mockPrograms.find((item) => item.id === programId)
  )
  const [linkedCourses, setLinkedCourses] = useState<ProgramCourseWithMeta[]>(() =>
    mockProgramCourses
      .filter((pc) => pc.program_id === programId)
      .map((pc) => ({
        ...pc,
        course: mockCourses.find((c) => c.id === pc.course_id)!,
      }))
  )
  const [notes, setNotes] = useState(
    'Use this space to capture internal notes about this cohort, prerequisites, or upcoming accreditation tasks.'
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LinkCourseFormValues>({
    resolver: zodResolver(linkCourseSchema),
  })

  const selectedCourseId = watch('course_id')
  const availableCourses = useMemo(() => {
    const linkedIds = new Set(linkedCourses.map((item) => item.course_id))
    return mockCourses.filter((course) => !linkedIds.has(course.id))
  }, [linkedCourses])

  if (!program) {
    return (
      <div className="space-y-2">
        <p className="text-lg font-semibold">Program not found</p>
        <Button variant="link" onClick={() => router.push('/admin/programs')}>
          Return to programs
        </Button>
      </div>
    )
  }

  function onSubmit(data: LinkCourseFormValues) {
    const selectedCourse = mockCourses.find((course) => course.id === data.course_id)
    if (!selectedCourse) return

    const newLink: ProgramCourseWithMeta = {
      id: `pc-${crypto.randomUUID()}`,
      program_id: programId,
      course_id: selectedCourse.id,
      semester: data.semester,
      year: data.year,
      created_at: new Date().toISOString(),
      course: selectedCourse,
    }

    setLinkedCourses((prev) => [...prev, newLink])
    reset()
    setIsDialogOpen(false)
  }

  function handleUnlink(id: string) {
    if (!confirm('Remove this course from the program?')) return
    setLinkedCourses((prev) => prev.filter((link) => link.id !== id))
  }

  const curriculumTimeline = [...linkedCourses].sort((a, b) =>
    a.year === b.year ? a.semester - b.semester : a.year - b.year
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/programs')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-sm font-medium text-primary">Program Workspace</p>
            <h1 className="text-3xl font-bold">{program.title}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{program.level}</Badge>
          <Badge variant="outline">{program.mode}</Badge>
          <Badge variant="muted">{program.duration_years} yrs</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Program Overview</CardTitle>
            <CardDescription>Snapshot of the curriculum experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{program.description}</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{linkedCourses.length}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Mode</p>
                <p className="text-2xl font-bold">{program.mode}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{program.duration_years} yrs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Internal Notes</CardTitle>
            <CardDescription>Only admins can see these.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={8} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Curriculum Map</h2>
          <p className="text-sm text-muted-foreground">
            Organized by academic sequence for quick audit readiness.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Link Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attach Course</DialogTitle>
              <DialogDescription>
                Select a course and define where it belongs in the roadmap.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="course_id">Course</Label>
                <Select
                  value={selectedCourseId}
                  onValueChange={(value) => setValue('course_id', value, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.length === 0 && (
                      <SelectItem value="__none" disabled>
                        All courses linked
                      </SelectItem>
                    )}
                    {availableCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.course_code} · {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.course_id && <p className="text-sm text-destructive">{errors.course_id.message}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    min={1}
                    max={8}
                    placeholder="1"
                    {...register('semester', { valueAsNumber: true })}
                  />
                  {errors.semester && <p className="text-sm text-destructive">{errors.semester.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min={1}
                    max={program.duration_years}
                    placeholder="1"
                    {...register('year', { valueAsNumber: true })}
                  />
                  {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Link Course</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {curriculumTimeline.length === 0 ? (
        <p className="text-muted-foreground">No courses linked to this program yet.</p>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curriculumTimeline.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="space-y-1">
                    <p className="font-semibold">{entry.course.course_code}</p>
                    <p>{entry.course.title}</p>
                  </TableCell>
                  <TableCell>Semester {entry.semester}</TableCell>
                  <TableCell>Year {entry.year}</TableCell>
                  <TableCell>{entry.course.instructor}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleUnlink(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}


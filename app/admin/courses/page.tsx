'use client'

import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockCourses } from '@/lib/data/mock-data'
import type { Course } from '@/types'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'

const courseSchema = z.object({
  course_code: z.string().min(3, 'Course code is required'),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description should provide a bit more detail'),
  category: z.enum(['Core', 'Elective']),
  credits: z.number().min(1).max(6),
  instructor: z.string().min(3, 'Instructor name is required'),
})

type CourseFormValues = z.infer<typeof courseSchema>

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Core' | 'Elective'>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      category: 'Core',
      credits: 3,
    },
  })

  const courseStats = useMemo(() => {
    const core = courses.filter((course) => course.category === 'Core').length
    const elective = courses.filter((course) => course.category === 'Elective').length
    return {
      total: courses.length,
      core,
      elective,
    }
  }, [courses])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [courses, searchTerm, categoryFilter])

  function onSubmit(data: CourseFormValues) {
    if (editingCourse) {
      // Update existing course
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                course_code: data.course_code,
                title: data.title,
                description: data.description,
                category: data.category,
                credits: data.credits,
                instructor: data.instructor,
              }
            : c
        )
      )
    } else {
      // Create new course
      const newCourse: Course = {
        id: `course-${crypto.randomUUID()}`,
        course_code: data.course_code,
        title: data.title,
        description: data.description,
        category: data.category,
        credits: data.credits,
        instructor: data.instructor,
        created_at: new Date().toISOString(),
      }
      setCourses((prev) => [newCourse, ...prev])
    }
    reset({ category: 'Core', credits: 3 })
    setEditingCourse(null)
    setIsDialogOpen(false)
  }

  function handleEdit(course: Course) {
    setEditingCourse(course)
    setValue('course_code', course.course_code)
    setValue('title', course.title)
    setValue('description', course.description || '')
    setValue('category', course.category || 'Core')
    setValue('credits', course.credits || 3)
    setValue('instructor', course.instructor || '')
    setIsDialogOpen(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Remove this course?')) return
    setCourses((prev) => prev.filter((course) => course.id !== id))
  }

  function handleDialogClose() {
    setIsDialogOpen(false)
    setEditingCourse(null)
    reset({ category: 'Core', credits: 3 })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Course Library</p>
          <h1 className="text-3xl font-bold">Learning Modules</h1>
          <p className="text-muted-foreground mt-2">
            Keep your curriculum fresh by curating compelling courses and instructors.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCourse(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Publish a Course'}</DialogTitle>
              <DialogDescription>
                {editingCourse
                  ? 'Update the course details below.'
                  : 'Students will see this in the program catalog.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="course_code">Course Code</Label>
                <Input id="course_code" placeholder="e.g., CTH 101" {...register('course_code')} />
                {errors.course_code && <p className="text-sm text-destructive">{errors.course_code.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" placeholder="e.g., Old Testament Survey" {...register('title')} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What will learners gain from this module?"
                  {...register('description')}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2 md:col-span-1">
                  <Label>Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Core">Core</SelectItem>
                          <SelectItem value="Elective">Elective</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    min={1}
                    max={6}
                    {...register('credits', { valueAsNumber: true })}
                  />
                  {errors.credits && <p className="text-sm text-destructive">{errors.credits.message}</p>}
                </div>
                <div className="grid gap-2 md:col-span-1">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    placeholder="e.g., Pastor Jeremiah El-buba"
                    {...register('instructor')}
                  />
                  {errors.instructor && <p className="text-sm text-destructive">{errors.instructor.message}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Publish Course'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-3xl">{courseStats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Across core and elective categories.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Core Modules</CardDescription>
            <CardTitle className="text-3xl">{courseStats.core}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Required courses for every cohort.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Electives</CardDescription>
            <CardTitle className="text-3xl">{courseStats.elective}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Optional modules to personalize journeys.</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses"
              className="pl-9"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'Core', 'Elective'] as const).map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={categoryFilter === filter ? 'default' : 'outline'}
                onClick={() => setCategoryFilter(filter)}
              >
                {filter === 'all' ? 'All' : filter}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id} className="hover:bg-muted/40">
                <TableCell className="space-y-1">
                  <p className="font-semibold">{course.course_code}</p>
                  <p>{course.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {course.description}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant={course.category === 'Core' ? 'success' : 'secondary'}>
                    {course.category}
                  </Badge>
                </TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(course)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { mockMilestones, mockPrograms, mockCourses } from '@/lib/data/mock-data'
import type { Milestone } from '@/types'
import { Plus, Trash2, Pencil, Target, FileText, BookOpen, Users } from 'lucide-react'
import { format } from 'date-fns'

const milestoneSchema = z.object({
  program_id: z.string().min(1, 'Program is required'),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  type: z.enum(['assignment', 'exam', 'retreat', 'practicum', 'checkpoint']),
  due_date: z.string().min(1, 'Due date is required'),
  semester: z.number().min(1),
  year: z.number().min(1),
  course_id: z.string().optional(),
})

type MilestoneFormValues = z.infer<typeof milestoneSchema>

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      type: 'assignment',
      semester: 1,
      year: 1,
    },
  })

  const selectedProgramId = watch('program_id')

  function onSubmit(data: MilestoneFormValues) {
    if (editingMilestone) {
      // Update existing milestone
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === editingMilestone.id
            ? {
                ...m,
                program_id: data.program_id,
                title: data.title,
                description: data.description,
                type: data.type,
                due_date: data.due_date,
                semester: data.semester,
                year: data.year,
                course_id: data.course_id || undefined,
              }
            : m
        )
      )
    } else {
      // Create new milestone
      const newMilestone: Milestone = {
        id: `milestone-${crypto.randomUUID()}`,
        program_id: data.program_id,
        title: data.title,
        description: data.description,
        type: data.type,
        due_date: data.due_date,
        semester: data.semester,
        year: data.year,
        completed: false,
        course_id: data.course_id || undefined,
      }
      setMilestones((prev) => [...prev, newMilestone])
    }
    reset()
    setEditingMilestone(null)
    setIsDialogOpen(false)
  }

  function handleEdit(milestone: Milestone) {
    setEditingMilestone(milestone)
    setValue('program_id', milestone.program_id)
    setValue('title', milestone.title)
    setValue('description', milestone.description)
    setValue('type', milestone.type)
    setValue('due_date', new Date(milestone.due_date).toISOString().slice(0, 16))
    setValue('semester', milestone.semester)
    setValue('year', milestone.year)
    setValue('course_id', milestone.course_id || '')
    setIsDialogOpen(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this milestone?')) return
    setMilestones((prev) => prev.filter((m) => m.id !== id))
  }

  function handleDialogClose() {
    setIsDialogOpen(false)
    setEditingMilestone(null)
    reset()
  }

  function getTypeIcon(type: Milestone['type']) {
    switch (type) {
      case 'exam':
        return <FileText className="h-4 w-4" />
      case 'assignment':
        return <BookOpen className="h-4 w-4" />
      case 'retreat':
        return <Users className="h-4 w-4" />
      case 'practicum':
        return <Target className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Curriculum Management</p>
          <h1 className="text-3xl font-bold">Milestones</h1>
          <p className="text-muted-foreground mt-2">
            Define key checkpoints, assignments, and events for each program.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMilestone(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingMilestone ? 'Edit Milestone' : 'New Milestone'}</DialogTitle>
              <DialogDescription>
                {editingMilestone
                  ? 'Update the milestone details below.'
                  : 'Add a milestone to track student progress.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label>Program</Label>
                <Controller
                  control={control}
                  name="program_id"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPrograms.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.program_id && <p className="text-sm text-destructive">{errors.program_id.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Midterm Exam" {...register('title')} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the milestone"
                  rows={3}
                  {...register('description')}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="retreat">Retreat</SelectItem>
                          <SelectItem value="practicum">Practicum</SelectItem>
                          <SelectItem value="checkpoint">Checkpoint</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    min={1}
                    max={8}
                    {...register('semester', { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" min={1} max={6} {...register('year', { valueAsNumber: true })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input id="due_date" type="datetime-local" {...register('due_date')} />
                {errors.due_date && <p className="text-sm text-destructive">{errors.due_date.message}</p>}
              </div>
              {selectedProgramId && (
                <div className="grid gap-2">
                  <Label>Course (Optional)</Label>
                  <Controller
                    control={control}
                    name="course_id"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {mockCourses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.course_code} - {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingMilestone ? 'Update Milestone' : 'Create Milestone'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Milestones</CardDescription>
            <CardTitle className="text-3xl">{milestones.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-3xl">
              {milestones.filter((m) => new Date(m.due_date) > new Date()).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{milestones.filter((m) => m.completed).length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Semester/Year</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {milestones.map((milestone) => {
              const program = mockPrograms.find((p) => p.id === milestone.program_id)
              return (
                <TableRow key={milestone.id}>
                  <TableCell>{getTypeIcon(milestone.type)}</TableCell>
                  <TableCell className="font-medium">{milestone.title}</TableCell>
                  <TableCell>{program?.title || 'N/A'}</TableCell>
                  <TableCell>
                    Sem {milestone.semester}, Year {milestone.year}
                  </TableCell>
                  <TableCell>{format(new Date(milestone.due_date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(milestone)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(milestone.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


'use client'

import { useMemo, useState, useEffect } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { mockPrograms, mockProgramCourses, mockCourses } from '@/lib/data/mock-data'
import { getPrograms, createProgram, updateProgram, deleteProgram } from '@/lib/actions/program.actions'
import type { Program } from '@/types'
import { Pencil, Trash2, Plus, Search, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const programSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  duration_years: z.number().min(1, 'Duration must be at least 1 year'),
  level: z.enum(['Certificate', 'Diploma', 'Degree']),
  mode: z.enum(['Full-time', 'Part-time', 'Online', 'Hybrid']),
  description: z.string().max(260, 'Keep the description concise').optional(),
})

type ProgramFormValues = z.infer<typeof programSchema>

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load programs from database
  useEffect(() => {
    async function loadPrograms() {
      try {
        const data = await getPrograms()
        setPrograms(data)
      } catch (error) {
        console.error('Failed to load programs:', error)
        // Fallback to mock data if database not available
        setPrograms(mockPrograms)
      } finally {
        setIsLoading(false)
      }
    }
    loadPrograms()
  }, [])

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: '',
      duration_years: 2,
      level: 'Diploma',
      mode: 'Full-time',
      description: '',
    },
  })

  const programStats = useMemo(() => {
    const total = programs.length
    const averageDuration =
      total === 0 ? 0 : programs.reduce((sum, program) => sum + program.duration_years, 0) / total
    const totalCourses = mockProgramCourses.length
    const coverage =
      total === 0 || mockCourses.length === 0
        ? 0
        : Math.min(100, Math.round((totalCourses / (mockCourses.length * total)) * 100))
    return {
      total,
      averageDuration: averageDuration.toFixed(1),
      totalCourses,
      coverage,
    }
  }, [programs])

  const filteredPrograms = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return programs.filter(
      (program) =>
        program.title.toLowerCase().includes(term) ||
        program.level?.toLowerCase().includes(term)
    )
  }, [programs, searchTerm])

  async function onSubmit(data: ProgramFormValues) {
    try {
      if (editingProgram) {
        // Update existing program
        const updated = await updateProgram(editingProgram.id, data)
        setPrograms((prev) =>
          prev.map((p) => (p.id === editingProgram.id ? updated : p))
        )
      } else {
        // Create new program
        const newProgram = await createProgram(data)
        setPrograms((prev) => [newProgram, ...prev])
      }
      reset()
      setEditingProgram(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save program:', error)
      alert('Failed to save program. Please check console for details.')
    }
  }

  function handleEdit(program: Program) {
    setEditingProgram(program)
    setValue('title', program.title)
    setValue('duration_years', program.duration_years)
    setValue('level', program.level || 'Diploma')
    setValue('mode', program.mode || 'Full-time')
    setValue('description', program.description || '')
    setIsDialogOpen(true)
  }

  async function handleDelete(programId: string) {
    if (!confirm('Remove this program from the catalog?')) return
    try {
      await deleteProgram(programId)
      setPrograms((prev) => prev.filter((program) => program.id !== programId))
    } catch (error) {
      console.error('Failed to delete program:', error)
      alert('Failed to delete program. Please check console for details.')
    }
  }

  function handleDialogClose() {
    setIsDialogOpen(false)
    setEditingProgram(null)
    reset()
  }

  const programRows = filteredPrograms.map((program) => {
    const courseCount = mockProgramCourses.filter((pc) => pc.program_id === program.id).length
    return {
      ...program,
      courseCount,
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading programs...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Catalog Management</p>
          <h1 className="text-3xl font-bold">Academic Programs</h1>
          <p className="text-muted-foreground mt-2">
            Launch new offerings, track enrollments, and keep curriculum metadata tidy.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProgram(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingProgram ? 'Edit Program' : 'New Academic Program'}</DialogTitle>
              <DialogDescription>
                {editingProgram
                  ? 'Update the program details below.'
                  : 'Capture the essentials of the program before publishing it to students.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Program Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Diploma in Theology"
                  {...register('title')}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="duration_years">Duration (Years)</Label>
                  <Input
                    id="duration_years"
                    type="number"
                    min={1}
                    max={6}
                    {...register('duration_years', { valueAsNumber: true })}
                  />
                  {errors.duration_years && (
                    <p className="text-sm text-destructive">{errors.duration_years.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Study Mode</Label>
                  <Controller
                    control={control}
                    name="mode"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Full-time', 'Part-time', 'Online', 'Hybrid'].map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {mode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Program Level</Label>
                  <Controller
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Certificate', 'Diploma', 'Degree'].map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Quick Summary</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a one-paragraph overview students will see on the catalog."
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingProgram ? 'Update Program' : 'Publish Program'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Programs</CardDescription>
            <CardTitle className="text-3xl">{programStats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Across {programStats.totalCourses} linked courses.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Duration</CardDescription>
            <CardTitle className="text-3xl">{programStats.averageDuration} yrs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Balanced catalog of quick and in-depth tracks.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Course Coverage</CardDescription>
            <CardTitle className="text-3xl">
              {programStats.coverage}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Portion of courses mapped to at least one program.</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search programs"
            className="pl-9"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredPrograms.length} of {programs.length} programs
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Linked Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programRows.map((program) => (
              <TableRow key={program.id} className="hover:bg-muted/40">
                <TableCell className="space-y-1">
                  <p className="font-semibold">{program.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {program.description || 'No description provided'}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{program.level}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{program.mode}</Badge>
                </TableCell>
                <TableCell>{program.duration_years} yrs</TableCell>
                <TableCell>
                  <Badge variant="muted">{program.courseCount} courses</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(program)}
                      title="Edit program"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/programs/${program.id}`)}
                      title="View details"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(program.id)}
                      title="Delete program"
                    >
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


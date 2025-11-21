'use client'

import { useState, useMemo } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { mockPrograms, mockCourses, mockProgramCourses } from '@/lib/data/mock-data'
import { Users, Search, Eye, Mail, Phone, GraduationCap, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock student data
const mockStudents = [
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    program_id: 'program-1',
    program_title: 'Diploma in Theology',
    enrollment_date: '2024-01-15',
    status: 'active',
    progress: 45,
    courses_completed: 2,
    courses_total: 8,
  },
  {
    id: 'student-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    program_id: 'program-2',
    program_title: 'Bachelor of Christian Education',
    enrollment_date: '2023-09-01',
    status: 'active',
    progress: 78,
    courses_completed: 12,
    courses_total: 16,
  },
  {
    id: 'student-3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '(555) 345-6789',
    program_id: 'program-1',
    program_title: 'Diploma in Theology',
    enrollment_date: '2024-02-20',
    status: 'active',
    progress: 25,
    courses_completed: 1,
    courses_total: 8,
  },
]

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [programFilter, setProgramFilter] = useState<string>('all')
  const router = useRouter()

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter
      const matchesProgram = programFilter === 'all' || student.program_id === programFilter
      return matchesSearch && matchesStatus && matchesProgram
    })
  }, [students, searchTerm, statusFilter, programFilter])

  const stats = useMemo(() => {
    const total = students.length
    const active = students.filter((s) => s.status === 'active').length
    const averageProgress =
      total === 0
        ? 0
        : Math.round(students.reduce((sum, s) => sum + s.progress, 0) / total)
    return { total, active, averageProgress }
  }, [students])

  function handleViewStudent(studentId: string) {
    router.push(`/admin/students/${studentId}`)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Student Management</p>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-2">
            Manage student enrollments, track progress, and view academic records.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Enroll New Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enroll New Student</DialogTitle>
              <DialogDescription>Add a new student to the system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Student enrollment form will be implemented here.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Enroll Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{stats.active} active enrollments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Progress</CardDescription>
            <CardTitle className="text-3xl">{stats.averageProgress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={stats.averageProgress} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Students</CardDescription>
            <CardTitle className="text-3xl">{stats.active}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Programs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {mockPrograms.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{student.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{student.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{student.program_title}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.courses_completed}/{student.courses_total} courses
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(student.enrollment_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{student.progress}%</span>
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'success' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewStudent(student.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


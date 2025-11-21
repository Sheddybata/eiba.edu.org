'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap, BookOpen, TrendingUp } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { mockPrograms, mockCourses, mockProgramCourses } from '@/lib/data/mock-data'

// Mock student detail data
const mockStudentDetail = {
  id: 'student-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  program_id: 'program-1',
  program_title: 'Diploma in Theology',
  enrollment_date: '2024-01-15',
  status: 'active',
  overall_progress: 45,
  courses: [
    {
      id: 'course-1',
      course_code: 'CTH 101',
      title: 'Old Testament Survey',
      progress: 65,
      grade: 'A-',
      semester: 1,
      year: 1,
      status: 'in-progress',
    },
    {
      id: 'course-2',
      course_code: 'CTH 102',
      title: 'New Testament Foundations',
      progress: 25,
      grade: null,
      semester: 1,
      year: 1,
      status: 'in-progress',
    },
  ],
  milestones: [
    {
      id: 'm1',
      title: 'Old Testament Survey - Midterm Exam',
      due_date: '2024-03-15',
      status: 'upcoming',
      type: 'exam',
    },
    {
      id: 'm2',
      title: 'Worship Reflection Essay',
      due_date: '2024-03-10',
      status: 'completed',
      type: 'assignment',
    },
  ],
}

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  // In real app, fetch student data by ID
  const student = mockStudentDetail

  if (!student) {
    return (
      <div className="space-y-2">
        <p className="text-lg font-semibold">Student not found</p>
        <Button variant="link" onClick={() => router.push('/admin/students')}>
          Return to students
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/students')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm font-medium text-primary">Student Profile</p>
          <h1 className="text-3xl font-bold">{student.name}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Personal and enrollment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p>{student.email}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p>{student.phone}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Enrollment Date</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{new Date(student.enrollment_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={student.status === 'active' ? 'success' : 'secondary'}>
                    {student.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Enrolled Program</Label>
              <div className="flex items-center gap-2 mt-1">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{student.program_title}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Overall Progress
              </Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{student.overall_progress}% Complete</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <Progress value={student.overall_progress} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Phone className="mr-2 h-4 w-4" />
              Contact Student
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              View Transcript
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>Current and completed courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Semester/Year</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.course_code}</p>
                          <p className="text-sm text-muted-foreground">{course.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        Sem {course.semester}, Year {course.year}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress value={course.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">{course.progress}%</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.grade ? (
                          <Badge variant="success">{course.grade}</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.status === 'completed' ? 'success' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Milestones & Assignments</CardTitle>
              <CardDescription>Track student progress on key milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.milestones.map((milestone) => (
                  <div key={milestone.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{milestone.title}</p>
                      <Badge variant={milestone.status === 'completed' ? 'success' : 'secondary'}>
                        {milestone.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        <Calendar className="inline h-3 w-3 mr-1" />
                        Due: {new Date(milestone.due_date).toLocaleDateString()}
                      </span>
                      <Badge variant="outline">{milestone.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Student's recent actions and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Activity log will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


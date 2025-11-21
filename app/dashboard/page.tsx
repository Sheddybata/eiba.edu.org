'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import {
  mockStudent,
  getMockProgramById,
  getMockStudentCourses,
  getMockMilestones,
  getMockAnnouncements,
  getMockUnreadAnnouncementsCount,
  getMockCourseModules,
  getMockCourseResources,
  getMockStudyGroups,
  getMockCommunityEvents,
  getMockTasks,
  mockSupportServices,
  getMockCourseById,
} from '@/lib/data/mock-data'
import type { StudentCourse, Milestone, Announcement, CourseModule, Task } from '@/types'
import {
  GraduationCap,
  Clock3,
  Calendar,
  ArrowRight,
  Bell,
  CheckCircle2,
  Circle,
  BookOpen,
  Users,
  Target,
  Timer,
  Play,
  Pause,
  Square,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Video,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Flame,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'

export default function StudentDashboardPage() {
  const [semester, setSemester] = useState('1')
  const [year, setYear] = useState('1')
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null)
  const [isCourseSheetOpen, setIsCourseSheetOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [announcements, setAnnouncements] = useState(getMockAnnouncements(mockStudent.program_id || undefined))
  const [tasks, setTasks] = useState(getMockTasks())
  const [focusTimer, setFocusTimer] = useState({ minutes: 25, seconds: 0, isRunning: false, isPaused: false })
const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
const [readingPageIndex, setReadingPageIndex] = useState(0)
const [readingFontSize, setReadingFontSize] = useState(1)

  const program = useMemo(() => {
    if (!mockStudent.program_id) return null
    return getMockProgramById(mockStudent.program_id) || null
  }, [])

  const courses: StudentCourse[] = useMemo(() => {
    if (!program) return []
    return getMockStudentCourses(program.id, Number(semester), Number(year))
  }, [program, semester, year])


  const unreadCount = useMemo(() => announcements.filter((a) => !a.read).length, [announcements])

  const studyGroups = useMemo(() => {
    if (!program) return []
    return getMockStudyGroups(program.id)
  }, [program])

  const communityEvents = useMemo(() => {
    if (!program) return []
    return getMockCommunityEvents(program.id)
  }, [program])

  const overallProgress = useMemo(() => {
    if (courses.length === 0) return 0
    return Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
  }, [courses])

  const completedTasks = useMemo(() => tasks.filter((t) => t.completed).length, [tasks])
  const totalTasks = tasks.length

  function handleCourseClick(course: StudentCourse) {
    setSelectedCourse(course)
    setIsCourseSheetOpen(true)
  }

  function handleMarkAnnouncementRead(id: string) {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }

  function handleMarkAllRead() {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })))
  }

  function handleToggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const [milestones, setMilestones] = useState<Milestone[]>([])

  // Initialize milestones when program/semester/year changes
  useEffect(() => {
    if (program) {
      setMilestones(getMockMilestones(program.id, Number(semester), Number(year)))
    }
  }, [program, semester, year])

  function handleToggleMilestone(id: string) {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)))
  }

  function handleStartTimer() {
    setFocusTimer((prev) => ({ ...prev, isRunning: true, isPaused: false }))
  }

  function handlePauseTimer() {
    setFocusTimer((prev) => ({ ...prev, isRunning: false, isPaused: true }))
  }

  function handleStopTimer() {
    setFocusTimer({ minutes: 25, seconds: 0, isRunning: false, isPaused: false })
  }

  const courseModules = useMemo(() => {
    if (!selectedCourse) return []
    return getMockCourseModules(selectedCourse.id)
  }, [selectedCourse])

useEffect(() => {
  if (courseModules.length > 0) {
    setActiveModuleId(courseModules[0].id)
    setReadingPageIndex(0)
    setReadingFontSize(1)
  } else {
    setActiveModuleId(null)
  }
}, [courseModules])

useEffect(() => {
  setReadingPageIndex(0)
}, [activeModuleId])

  const courseResources = useMemo(() => {
    if (!selectedCourse) return []
    return getMockCourseResources(selectedCourse.id)
  }, [selectedCourse])

  const courseDetail = useMemo(() => {
    if (!selectedCourse) return null
    return getMockCourseById(selectedCourse.id)
  }, [selectedCourse])

const activeModule = useMemo(() => {
  if (!activeModuleId) return null
  return courseModules.find((module) => module.id === activeModuleId) || null
}, [activeModuleId, courseModules])

const readingPages = activeModule?.readingPages ?? []
const readingProgress = readingPages.length ? ((readingPageIndex + 1) / readingPages.length) * 100 : 0
const currentReadingPage = readingPages[readingPageIndex]

function handleModuleSelect(value: string) {
  setActiveModuleId(value)
}

function handleReadingNextPage() {
  if (!readingPages.length) return
  setReadingPageIndex((prev) => Math.min(prev + 1, readingPages.length - 1))
}

function handleReadingPrevPage() {
  if (!readingPages.length) return
  setReadingPageIndex((prev) => Math.max(prev - 1, 0))
}

function handleAdjustFont(delta: number) {
  setReadingFontSize((prev) => {
    const next = Math.max(0.85, Math.min(1.6, parseFloat((prev + delta).toFixed(2))))
    return next
  })
}

  function getMilestoneIcon(type: Milestone['type']) {
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
        return <CheckCircle className="h-4 w-4" />
    }
  }

  function getAnnouncementIcon(type: Announcement['type']) {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  function formatDueDate(dateString: string) {
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return `${formatDistanceToNow(date)} ago`
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return (
    <div className="container mx-auto p-6 md:p-10 space-y-8">
      {/* Header with Notifications */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-primary">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight">Your Learning Dashboard</h1>
          <p className="text-muted-foreground">
            Track your program progress, upcoming sessions, and keep momentum going this semester.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* My Program Card */}
      {program && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">My Program</CardTitle>
                <CardDescription>{program.title}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{program.level}</Badge>
              <Badge variant="outline">{program.duration_years} year track</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current focus</p>
              <p className="text-lg font-semibold">
                Semester {semester}, Year {year}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">View Program Roadmap</Button>
              <Button>
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Analytics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Progress</CardDescription>
            <CardTitle className="text-3xl">{overallProgress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasks Completed</CardDescription>
            <CardTitle className="text-3xl">
              {completedTasks}/{totalTasks}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% done
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Study Streak</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              7 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Weekly Hours</CardDescription>
            <CardTitle className="text-3xl">8.5/12</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={71} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Courses & Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Courses */}
          <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Select a semester and year to view enrolled courses.</CardDescription>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <Tabs value={semester} onValueChange={setSemester} className="w-full md:w-auto">
                  <TabsList>
                    <TabsTrigger value="1">Semester 1</TabsTrigger>
                    <TabsTrigger value="2">Semester 2</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="md:w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                  No courses scheduled for this term yet.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((course) => (
                    <Card
                      key={course.id}
                      className="border-muted/60 cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => handleCourseClick(course)}
                    >
                      <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{course.course_code}</span>
                          <span>{course.credits ?? 3} credits</span>
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-xs text-muted-foreground">Instructor • {course.instructor}</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-semibold">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Roadmap & Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Roadmap</CardTitle>
              <CardDescription>Upcoming milestones and checkpoints for this semester.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.length === 0 ? (
                <p className="text-sm text-muted-foreground">No milestones scheduled for this term.</p>
              ) : (
                milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-1">{getMilestoneIcon(milestone.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{milestone.title}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleMilestone(milestone.id)}
                        >
                          {milestone.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDueDate(milestone.due_date)}</span>
                        <Badge variant="outline" className="ml-2">
                          {milestone.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Community & Study Groups */}
          <Card>
            <CardHeader>
              <CardTitle>Community Pulse</CardTitle>
              <CardDescription>Study groups and upcoming events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Study Groups</h4>
                <div className="space-y-3">
                  {studyGroups.map((group) => (
                    <div key={group.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{group.name}</p>
                        <Badge variant="secondary">{group.member_count} members</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                      {group.meeting_schedule && (
                        <p className="text-xs text-muted-foreground">
                          <Clock3 className="inline h-3 w-3 mr-1" />
                          {group.meeting_schedule}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Upcoming Events</h4>
                <div className="space-y-3">
                  {communityEvents.map((event) => (
                    <div key={event.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{event.title}</p>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {format(new Date(event.event_date), 'MMM d, yyyy')}
                          {event.event_time && ` • ${event.event_time}`}
                        </span>
                        {event.location && (
                          <span>
                            <Users className="inline h-3 w-3 mr-1" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Recent announcements and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.slice(0, 5).map((announcement) => (
                <div
                  key={announcement.id}
                  className={`rounded-lg border p-3 ${!announcement.read ? 'bg-primary/5 border-primary/20' : ''}`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {getAnnouncementIcon(announcement.type)}
                    <p className="font-medium text-sm flex-1">{announcement.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{announcement.message}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{announcement.author}</span>
                    <span>{formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => setIsNotificationsOpen(true)}>
                View All
              </Button>
            </CardContent>
          </Card>

          {/* Productivity Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Productivity Tools</CardTitle>
              <CardDescription>Stay focused and organized.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Focus Timer */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Focus Timer</h4>
                <div className="rounded-lg border p-4 space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold">
                      {String(focusTimer.minutes).padStart(2, '0')}:{String(focusTimer.seconds).padStart(2, '0')}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Pomodoro Session</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {!focusTimer.isRunning && !focusTimer.isPaused && (
                      <Button size="sm" onClick={handleStartTimer}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    {focusTimer.isRunning && (
                      <Button size="sm" variant="outline" onClick={handlePauseTimer}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    {(focusTimer.isRunning || focusTimer.isPaused) && (
                      <Button size="sm" variant="outline" onClick={handleStopTimer}>
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Planner */}
              <div>
                <h4 className="text-sm font-semibold mb-3">My Tasks</h4>
                <div className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => handleToggleTask(task.id)}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}
                        >
                          {task.title}
                        </p>
                        {task.due_date && (
                          <p className="text-xs text-muted-foreground">{formatDueDate(task.due_date)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support & Services */}
          <Card>
            <CardHeader>
              <CardTitle>Support & Services</CardTitle>
              <CardDescription>Get help when you need it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockSupportServices.map((service) => (
                <div key={service.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{service.name}</p>
                    {service.available && <Badge variant="success" className="text-xs">Available</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex gap-2">
                    {service.contact_email && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    )}
                    {service.booking_url && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Book
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Detail Sheet */}
      <Sheet open={isCourseSheetOpen} onOpenChange={setIsCourseSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedCourse && courseDetail && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCourse.course_code} - {selectedCourse.title}</SheetTitle>
                <SheetDescription>
                  Instructor: {selectedCourse.instructor} • {selectedCourse.credits ?? 3} Credits
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Progress</h3>
                  <Progress value={selectedCourse.progress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">{selectedCourse.progress}% Complete</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Course Modules</h3>
                  <div className="space-y-3">
                    {courseModules.map((module) => (
                      <div key={module.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{module.title}</p>
                          {module.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        {module.resources.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {module.resources.map((resource) => (
                              <div key={resource.id} className="flex items-center gap-2 text-sm">
                                {resource.type === 'syllabus' && <FileText className="h-4 w-4" />}
                                {resource.type === 'slides' && <FileText className="h-4 w-4" />}
                                {resource.type === 'video' && <Video className="h-4 w-4" />}
                                {resource.type === 'link' && <LinkIcon className="h-4 w-4" />}
                                <a href={resource.url} className="text-primary hover:underline">
                                  {resource.title}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {courseModules.length > 0 && (
                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold">Immersive Module Experience</p>
                        <p className="text-xs text-muted-foreground">
                          Watch the pre-recorded teaching and work through the guided pages.
                        </p>
                      </div>
                      {activeModuleId && (
                        <Select value={activeModuleId} onValueChange={handleModuleSelect}>
                          <SelectTrigger className="md:w-72">
                            <SelectValue placeholder="Choose module" />
                          </SelectTrigger>
                          <SelectContent>
                            {courseModules.map((module) => (
                              <SelectItem key={module.id} value={module.id}>
                                {module.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {activeModule?.videoUrl && (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          Pre-recorded session
                        </p>
                        <video
                          src={activeModule.videoUrl}
                          controls
                          className="w-full rounded-lg border"
                          poster="/logo/ebomi-logo.jpg"
                        >
                          Your browser does not support embedded videos.
                        </video>
                      </div>
                    )}

                    {readingPages.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium">
                              On-screen course material • Page {readingPageIndex + 1} of {readingPages.length}
                            </p>
                            <Progress value={readingProgress} className="h-2" />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleAdjustFont(-0.1)}
                              title="Decrease font size"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleAdjustFont(0.1)}
                              title="Increase font size"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-lg border bg-muted/40 p-4" style={{ fontSize: `${readingFontSize}rem` }}>
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                            {currentReadingPage?.title}
                          </p>
                          <p className="text-muted-foreground leading-relaxed">{currentReadingPage?.content}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={handleReadingPrevPage}
                            disabled={readingPageIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous page
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={handleReadingNextPage}
                            disabled={readingPageIndex === readingPages.length - 1}
                          >
                            Next page
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Resources</h3>
                  <div className="space-y-2">
                    {courseResources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          {resource.type === 'syllabus' && <FileText className="h-4 w-4" />}
                          {resource.type === 'slides' && <FileText className="h-4 w-4" />}
                          {resource.type === 'video' && <Video className="h-4 w-4" />}
                          {resource.type === 'link' && <LinkIcon className="h-4 w-4" />}
                          <div>
                            <p className="text-sm font-medium">{resource.title}</p>
                            {resource.description && (
                              <p className="text-xs text-muted-foreground">{resource.description}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Contact Instructor</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Office Hours
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Notifications Sheet */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>All your announcements and updates.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{unreadCount} unread</p>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`rounded-lg border p-4 ${!announcement.read ? 'bg-primary/5 border-primary/20' : ''}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {getAnnouncementIcon(announcement.type)}
                    <div className="flex-1">
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                    </div>
                    {!announcement.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAnnouncementRead(announcement.id)}
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>{announcement.author}</span>
                    <span>{formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

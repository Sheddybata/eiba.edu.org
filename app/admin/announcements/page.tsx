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
import { mockAnnouncements } from '@/lib/data/mock-data'
import type { Announcement } from '@/types'
import { Plus, Trash2, Pencil, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { format } from 'date-fns'

const announcementSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  message: z.string().min(10, 'Message is required'),
  type: z.enum(['info', 'warning', 'success', 'urgent']),
  target_audience: z.enum(['all', 'program', 'course']),
  target_id: z.string().optional(),
})

type AnnouncementFormValues = z.infer<typeof announcementSchema>

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      type: 'info',
      target_audience: 'all',
    },
  })

  function onSubmit(data: AnnouncementFormValues) {
    if (editingAnnouncement) {
      // Update existing announcement
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingAnnouncement.id
            ? {
                ...a,
                title: data.title,
                message: data.message,
                type: data.type,
                target_audience: data.target_audience,
                target_id: data.target_id || undefined,
              }
            : a
        )
      )
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: `announcement-${crypto.randomUUID()}`,
        title: data.title,
        message: data.message,
        type: data.type,
        created_at: new Date().toISOString(),
        author: 'Admin User',
        read: false,
        target_audience: data.target_audience,
        target_id: data.target_id || undefined,
      }
      setAnnouncements((prev) => [newAnnouncement, ...prev])
    }
    reset()
    setEditingAnnouncement(null)
    setIsDialogOpen(false)
  }

  function handleEdit(announcement: Announcement) {
    setEditingAnnouncement(announcement)
    setValue('title', announcement.title)
    setValue('message', announcement.message)
    setValue('type', announcement.type)
    setValue('target_audience', announcement.target_audience || 'all')
    setValue('target_id', announcement.target_id || '')
    setIsDialogOpen(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  function handleDialogClose() {
    setIsDialogOpen(false)
    setEditingAnnouncement(null)
    reset()
  }

  function getTypeIcon(type: Announcement['type']) {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Communication</p>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-2">
            Broadcast important updates, grades, and information to students.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAnnouncement(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement
                  ? 'Update the announcement details below.'
                  : 'Create a new announcement for students.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., New Course Materials Available" {...register('title')} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter the announcement message"
                  rows={4}
                  {...register('message')}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
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
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Target Audience</Label>
                  <Controller
                    control={control}
                    name="target_audience"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Students</SelectItem>
                          <SelectItem value="program">Specific Program</SelectItem>
                          <SelectItem value="course">Specific Course</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingAnnouncement ? 'Update Announcement' : 'Publish Announcement'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Announcements</CardDescription>
            <CardTitle className="text-3xl">{announcements.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unread by Students</CardDescription>
            <CardTitle className="text-3xl">{announcements.filter((a) => !a.read).length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">
              {announcements.filter(
                (a) => new Date(a.created_at).getMonth() === new Date().getMonth()
              ).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>{getTypeIcon(announcement.type)}</TableCell>
                <TableCell className="font-medium">{announcement.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{announcement.target_audience}</Badge>
                </TableCell>
                <TableCell>{announcement.author}</TableCell>
                <TableCell>{format(new Date(announcement.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(announcement)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement.id)}>
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


'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  getApplications,
  getApplicationStats,
  updateApplicationStatus,
} from '@/lib/actions/application.actions'
import type { Application } from '@/types'
import { Mail, Phone, MapPin, Calendar, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  waitlisted: 'bg-gray-100 text-gray-800',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0,
    waitlisted: 0,
  })
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [newStatus, setNewStatus] = useState<string>('pending')

  useEffect(() => {
    loadApplications()
    loadStats()
  }, [statusFilter])

  useEffect(() => {
    const filtered = applications.filter((app) => {
      const matchesSearch =
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.program_title?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
    setFilteredApplications(filtered)
  }, [applications, searchTerm])

  async function loadApplications() {
    const apps = await getApplications(statusFilter === 'all' ? undefined : statusFilter)
    setApplications(apps)
    setFilteredApplications(apps)
  }

  async function loadStats() {
    const statsData = await getApplicationStats()
    setStats(statsData)
  }

  function handleViewApplication(app: Application) {
    setSelectedApplication(app)
    setAdminNotes(app.admin_notes || '')
    setNewStatus(app.status)
    setIsDialogOpen(true)
  }

  async function handleUpdateStatus() {
    if (!selectedApplication) return

    try {
      await updateApplicationStatus(selectedApplication.id, {
        status: newStatus as any,
        admin_notes: adminNotes,
      })
      setIsDialogOpen(false)
      loadApplications()
      loadStats()
    } catch (error) {
      console.error('Failed to update application:', error)
      alert('Failed to update application. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground">Review and manage student applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reviewing</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.reviewing}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Waitlisted</CardDescription>
            <CardTitle className="text-2xl text-gray-600">{stats.waitlisted}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by name, email, or program..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="waitlisted">Waitlisted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.full_name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.program_title || 'Not specified'}</TableCell>
                    <TableCell>{app.preferred_schedule}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[app.status]}>{app.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(app)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review application and update status</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedApplication.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedApplication.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedApplication.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedApplication.country}</span>
                  </div>
                </div>
              </div>

              {/* Program Information */}
              <div>
                <h3 className="font-semibold mb-3">Program & Schedule</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Program:</strong> {selectedApplication.program_title || 'Not specified'}
                  </p>
                  <p>
                    <strong>Schedule:</strong> {selectedApplication.preferred_schedule}
                  </p>
                  {selectedApplication.desired_start_term && (
                    <p>
                      <strong>Start Term:</strong> {selectedApplication.desired_start_term}
                    </p>
                  )}
                  {selectedApplication.payment_plan && (
                    <p>
                      <strong>Payment Plan:</strong> {selectedApplication.payment_plan}
                    </p>
                  )}
                </div>
              </div>

              {/* Testimony */}
              <div>
                <h3 className="font-semibold mb-3">Testimony</h3>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                  {selectedApplication.testimony}
                </p>
              </div>

              {/* Ministry Context */}
              {selectedApplication.ministry_context && (
                <div>
                  <h3 className="font-semibold mb-3">Ministry Context</h3>
                  <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                    {selectedApplication.ministry_context}
                  </p>
                </div>
              )}

              {/* Reference */}
              <div>
                <h3 className="font-semibold mb-3">Pastoral Reference</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedApplication.reference_name}
                  </p>
                  <p>
                    <strong>Relationship:</strong> {selectedApplication.reference_relationship}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedApplication.reference_email}
                  </p>
                  {selectedApplication.reference_phone && (
                    <p>
                      <strong>Phone:</strong> {selectedApplication.reference_phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-4 border-t pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="waitlisted">Waitlisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Submitted</Label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(selectedApplication.created_at), 'PPpp')}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateStatus}>Update Status</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


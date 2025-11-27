'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  getCurriculumDocuments,
  uploadCurriculumDocument,
  deleteCurriculumDocument,
} from '@/lib/actions/curriculum.actions'
import type { CurriculumDocument } from '@/types'
import { getPrograms } from '@/lib/actions/program.actions'
import { getCourses } from '@/lib/actions/course.actions'
import { Upload, FileText, Trash2, Download, FolderOpen } from 'lucide-react'
import { format } from 'date-fns'

const categoryColors = {
  syllabus: 'bg-blue-100 text-blue-800',
  curriculum: 'bg-purple-100 text-purple-800',
  handbook: 'bg-green-100 text-green-800',
  guide: 'bg-yellow-100 text-yellow-800',
  template: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
}

export default function CurriculumPage() {
  const [documents, setDocuments] = useState<CurriculumDocument[]>([])
  const [programs, setPrograms] = useState<Array<{ id: string; title: string }>>([])
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    program_id: '',
    course_id: '',
    category: 'curriculum' as const,
  })

  useEffect(() => {
    loadDocuments()
    loadPrograms()
    loadCourses()
  }, [])

  async function loadDocuments() {
    const docs = await getCurriculumDocuments()
    setDocuments(docs)
  }

  async function loadPrograms() {
    const progs = await getPrograms()
    setPrograms(progs.map((p) => ({ id: p.id, title: p.title })))
  }

  async function loadCourses() {
    const crs = await getCourses()
    setCourses(crs.map((c) => ({ id: c.id, title: c.title })))
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!formData.title) {
        setFormData({ ...formData, title: file.name })
      }
    }
  }

  async function handleUpload() {
    if (!selectedFile || !formData.title) {
      alert('Please select a file and provide a title')
      return
    }

    setIsUploading(true)

    try {
      // TODO: Upload file to Supabase Storage first
      // For now, we'll use a placeholder URL
      // In production, you'll need to:
      // 1. Upload to Supabase Storage bucket
      // 2. Get the public URL
      // 3. Then save the document record

      const fileUrl = URL.createObjectURL(selectedFile) // Temporary - replace with Supabase Storage URL

      await uploadCurriculumDocument({
        title: formData.title,
        description: formData.description,
        file_path: selectedFile.name,
        file_url: fileUrl,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        program_id: formData.program_id || undefined,
        course_id: formData.course_id || undefined,
        category: formData.category,
      })

      setIsDialogOpen(false)
      setSelectedFile(null)
      setFormData({
        title: '',
        description: '',
        program_id: '',
        course_id: '',
        category: 'curriculum',
      })
      loadDocuments()
      alert('Document uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload document. Please check console for details.')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await deleteCurriculumDocument(id)
      loadDocuments()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete document')
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Curriculum Documents</h1>
          <p className="text-muted-foreground">Manage course materials, syllabi, and guides</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No documents uploaded yet
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[doc.category]}>{doc.category}</Badge>
                    </TableCell>
                    <TableCell>{doc.program_id ? 'Linked' : '—'}</TableCell>
                    <TableCell>{doc.course_id ? 'Linked' : '—'}</TableCell>
                    <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                    <TableCell>{format(new Date(doc.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Curriculum Document</DialogTitle>
            <DialogDescription>
              Upload course materials, syllabi, handbooks, or other curriculum documents
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>File</Label>
              <Input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.pptx,.ppt"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Document title"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the document"
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="syllabus">Syllabus</SelectItem>
                    <SelectItem value="curriculum">Curriculum</SelectItem>
                    <SelectItem value="handbook">Handbook</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Program (Optional)</Label>
                <Select
                  value={formData.program_id}
                  onValueChange={(value) => setFormData({ ...formData, program_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Course (Optional)</Label>
              <Select
                value={formData.course_id}
                onValueChange={(value) => setFormData({ ...formData, course_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


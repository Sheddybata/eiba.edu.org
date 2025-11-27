'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Calendar, Phone, Mail, Heart, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { submitApplication } from '@/lib/actions/application.actions'
import { getPrograms } from '@/lib/actions/program.actions'
import type { Program } from '@/types'

const scheduleOptions = [
  'Full-time (residency)',
  'Hybrid (evening / weekend)',
  'Online (self-paced with live cohorts)',
]

const references = [
  'Pastor / Shepherd',
  'Mentor or Spiritual Director',
  'Elders Board',
  'Academic Faculty',
]

export default function ApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [programs, setPrograms] = useState<Array<{ id: string; title: string }>>([])

  // Load programs on mount
  useEffect(() => {
    async function loadPrograms() {
      try {
        const progs = await getPrograms()
        setPrograms(progs.map((p: Program) => ({ id: p.id, title: p.title })))
      } catch (error) {
        console.error('Failed to load programs:', error)
        // Fallback to all 10 programs if API fails
        setPrograms([
          { id: '1', title: 'School of Biblical Foundations' },
          { id: '2', title: 'School of Ministry & Fivefold Leadership' },
          { id: '3', title: 'Kingdom Leadership & Governance Program' },
          { id: '4', title: 'School of Prayer & Intercession' },
          { id: '5', title: 'Christian Apologetics & Worldview Studies' },
          { id: '6', title: 'Missions & Evangelism Academy' },
          { id: '7', title: 'Christian Media, Communication & Digital Ministry Program' },
          { id: '8', title: 'Youth Mentorship & Purpose Discovery Academy' },
          { id: '9', title: 'School of Deliverance & Spiritual Warfare' },
          { id: '10', title: 'Christian Entrepreneurship & Kingdom Innovation Program' },
        ])
      }
    }
    loadPrograms()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const selectedProgramId = formData.get('program') as string
    const selectedProgram = programs.find((p) => p.id === selectedProgramId)

    // Validate UUID format - only use program_id if it's a valid UUID
    const isValidUUID = (str: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      return uuidRegex.test(str)
    }

    try {
      await submitApplication({
        full_name: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        country: formData.get('country') as string,
        program_id: selectedProgramId && isValidUUID(selectedProgramId) ? selectedProgramId : undefined,
        program_title: selectedProgram?.title,
        preferred_schedule: formData.get('schedule') as string,
        desired_start_term: formData.get('start') as string || undefined,
        payment_plan: formData.get('paymentPlan') as string || undefined,
        testimony: formData.get('testimony') as string,
        ministry_context: formData.get('ministry') as string || undefined,
        reference_name: formData.get('refName') as string,
        reference_relationship: formData.get('refRelationship') as string,
        reference_email: formData.get('refEmail') as string,
        reference_phone: formData.get('refPhone') as string || undefined,
        reference_notes: formData.get('refNotes') as string || undefined,
      })

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative overflow-hidden border-b border-white/20 text-white"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(7,23,49,0.92), rgba(140,26,34,0.7)), url('/homepage/nextsteps/nextstepbackground.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
          <Badge variant="outline" className="w-fit border-white/50 text-white">
            Application
          </Badge>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            EBOMI Admissions • “Love Is Everything” Cohort
          </h1>
          <p className="text-base md:text-lg text-white/90">
            Complete the form below to begin your journey. Once submitted, an admissions shepherd will reach out within
            48 hours to pray with you, confirm requirements, and walk through tuition options.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              January intake: Jan 2025 • Applications close December 2024
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              +233 (0) 555-123-777
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              admissions@ebomi.edu
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 md:py-16">
        {error && (
          <Card className="border border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <div>
                  <CardTitle className="text-destructive">Submission Error</CardTitle>
                  <CardDescription>{error}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Success Dialog */}
        <Dialog open={submitted} onOpenChange={(open) => !open && setSubmitted(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">Application Received!</DialogTitle>
              <DialogDescription className="text-center text-base pt-2">
                Thank you for your interest in EBOMI International Bible Academy. We've received your application and will review it carefully.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">What happens next?</p>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>We'll email you within 48 hours with next steps</li>
                  <li>Expect a personal call from an admissions shepherd</li>
                  <li>Check your email for confirmation and further instructions</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button className="flex-1" asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setSubmitted(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us how to reach you and serve your household.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Prophet. Dr. Isa El-buba Sadiq"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="prophet.isa@ebomi.org" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+234 700 111 2233" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country / City</Label>
                  <Input id="country" name="country" placeholder="Accra, Ghana" required />
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Program & Schedule</CardTitle>
                <CardDescription>Choose the track and timing that aligns with your calling.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Program</Label>
                  <Select required name="program">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.length > 0 ? (
                        programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.title}
                          </SelectItem>
                        ))
                      ) : (
                        // Fallback: All 10 programs
                        <>
                          <SelectItem value="1">School of Biblical Foundations</SelectItem>
                          <SelectItem value="2">School of Ministry & Fivefold Leadership</SelectItem>
                          <SelectItem value="3">Kingdom Leadership & Governance Program</SelectItem>
                          <SelectItem value="4">School of Prayer & Intercession</SelectItem>
                          <SelectItem value="5">Christian Apologetics & Worldview Studies</SelectItem>
                          <SelectItem value="6">Missions & Evangelism Academy</SelectItem>
                          <SelectItem value="7">Christian Media, Communication & Digital Ministry Program</SelectItem>
                          <SelectItem value="8">Youth Mentorship & Purpose Discovery Academy</SelectItem>
                          <SelectItem value="9">School of Deliverance & Spiritual Warfare</SelectItem>
                          <SelectItem value="10">Christian Entrepreneurship & Kingdom Innovation Program</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Preferred Schedule</Label>
                  <Select required name="schedule">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {scheduleOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start">Desired Start Term</Label>
                  <Input id="start" name="start" defaultValue="January 2025" placeholder="January 2025" />
                </div>
                <div className="grid gap-2">
                  <Label>Covenant Payment Interest</Label>
                  <Select name="paymentPlan">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Pay-in-full</SelectItem>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-secondary text-white">
                  Story of calling
                </Badge>
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Share your journey</CardTitle>
              <CardDescription>
                Help us understand the work God is doing in your life. These responses stay confidential with EBOMI
                leaders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="testimony">Faith & testimony</Label>
                <Textarea
                  id="testimony"
                  name="testimony"
                  rows={4}
                  placeholder="Describe your salvation story, present ministry context, and what you sense the Lord inviting you to next."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ministry">Current ministry or vocation</Label>
                <Textarea
                  id="ministry"
                  name="ministry"
                  rows={3}
                  placeholder="List your ministry responsibilities, workplace role, or community leadership."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pastoral Reference</CardTitle>
              <CardDescription>Provide a leader who can speak to your character and formation journey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="refName">Name</Label>
                  <Input
                    id="refName"
                    name="refName"
                    placeholder="Pastor. Choice El-buba"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Relationship</Label>
                  <Select name="refRelationship" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {references.map((reference) => (
                        <SelectItem key={reference} value={reference}>
                          {reference}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="refEmail">Email</Label>
                  <Input
                    id="refEmail"
                    name="refEmail"
                    type="email"
                    placeholder="choice.elbuba@ebomi.org"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="refPhone">Phone</Label>
                  <Input id="refPhone" name="refPhone" type="tel" placeholder="+234 710 555 8899" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="refNotes">Notes for our admissions team</Label>
                <Textarea
                  id="refNotes"
                  name="refNotes"
                  rows={3}
                  placeholder="Any context we should know before reaching out?"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              By submitting, you agree to EBOMI’s Love Is Everything covenant and privacy policy.
            </p>
            <Button type="submit" size="lg" className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit application'}
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}



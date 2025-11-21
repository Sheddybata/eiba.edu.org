'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Calendar, Phone, Mail, Heart } from 'lucide-react'

const programOptions = [
  { id: 'diploma', label: 'Diploma in Theology' },
  { id: 'certificate', label: 'Certificate in Pastoral Ministry' },
  { id: 'bachelor', label: 'Bachelor of Christian Education' },
]

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1800)
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
              Fall intake: Aug 12 • Deadline July 15
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
        {submitted && (
          <Card className="border border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-primary">Application received</CardTitle>
                  <CardDescription>
                    We’ll email within 48 hours with next steps. Expect a personal call from an admissions shepherd.
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/">Return to home</Link>
              </Button>
            </CardHeader>
          </Card>
        )}

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
                      {programOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
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
                  <Input id="start" name="start" placeholder="Fall 2025" />
                </div>
                <div className="grid gap-2">
                  <Label>Covenant Payment Interest</Label>
                  <Select name="paymentPlan">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Pay-in-full (5% discount)</SelectItem>
                      <SelectItem value="monthly">Monthly covenant plan</SelectItem>
                      <SelectItem value="sponsor">Church sponsor / scholarship</SelectItem>
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
      </div>
    </div>
  )
}



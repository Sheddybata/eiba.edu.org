'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpenCheck,
  ClipboardList,
  DollarSign,
  GraduationCap,
  Handshake,
  Sparkles,
  Users,
  ArrowRight,
} from 'lucide-react'

const journeySteps = [
  {
    title: 'Eligibility & Discernment',
    summary: 'Confirm your calling and readiness with our pastoral team.',
    icon: BookOpenCheck,
    details: [
      'Personal confession of faith in Jesus Christ',
      'Pastoral reference or church endorsement',
      'High school diploma / prior theological exposure',
    ],
  },
  {
    title: 'Application & Registration',
    summary: 'Complete your documents and select the ideal learning rhythm.',
    icon: ClipboardList,
    details: [
      'Complete the EBOMI application form',
      'Schedule a short interview with admissions',
      'Select your preferred learning mode',
    ],
  },
  {
    title: 'Fees & Covenant',
    summary: 'Choose a covenant plan and sign the Love Is Everything pledge.',
    icon: DollarSign,
    details: [
      'Review tuition and ministry partnership options',
      'Choose between full, installment, or sponsorship plans',
      'Sign the Love Is Everything learner covenant',
    ],
  },
]

const tracks = [
  {
    name: 'Diploma in Theology',
    duration: '2 years',
    mode: 'Hybrid / Online',
    focus: 'Biblical literacy, spiritual formation, ministry practice.',
    modules: ['OT/NT Survey', 'Worship & Liturgy', 'Missional Leadership'],
  },
  {
    name: 'Certificate in Pastoral Ministry',
    duration: '1 year',
    mode: 'Weekend intensives',
    focus: 'Shepherding, counseling, congregational leadership.',
    modules: ['Shepherd Care Lab', 'Kingdom Counseling', 'Preaching Studio'],
  },
  {
    name: 'Bachelor of Christian Education',
    duration: '4 years',
    mode: 'Full-time residency',
    focus: 'Educational design, teaching practicums, research.',
    modules: ['Instructional Design', 'Field Practicum', 'Capstone Research'],
  },
]

const heroStats = [
  {
    label: 'Programs',
    value: '10',
    detail: '10 Specialized Schools',
    icon: GraduationCap,
  },
  {
    label: 'New Cohorts',
    value: 'Jan 2025',
    detail: 'Next intake kicks off',
    icon: Users,
  },
  {
    label: 'Scholarships',
    value: '65%',
    detail: 'Learners receive aid',
    icon: Handshake,
  },
  {
    label: 'Mentors',
    value: '18',
    detail: 'Pastors & faculty shepherds',
    icon: Sparkles,
  },
]

const paymentTimelines = [
  {
    title: 'Choose your covenant plan',
    description: 'Pay-in-full discount or monthly auto-debit with zero hidden fees.',
  },
  {
    title: 'Submit sponsorship requests',
    description: 'Partner churches may underwrite up to 50% of tuition.',
  },
  {
    title: 'Confirm ministry commitment',
    description: 'Sign the Love Is Everything covenant and financial agreement.',
  },
  {
    title: 'Receive onboarding kit',
    description: 'Budget tracker, devotional plan, and giving statements.',
  },
]

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative overflow-hidden border-b border-white/20 bg-secondary text-secondary-foreground"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(8,22,48,0.92), rgba(139,25,30,0.65)), url('/homepage/nextsteps/nextstepbackground.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
          <Badge variant="outline" className="w-fit border-white/40 text-white">
            Programs & Enrollment
          </Badge>
          <h1 className="font-serif text-4xl leading-tight text-white md:text-5xl">Choose your EBOMI journey.</h1>
          <p className="max-w-3xl text-base md:text-lg text-white/85">
            Each program is carefully designed to weave Scripture, scholarship, and service. Follow the pathway below to
            confirm eligibility, register with confidence, and activate your tuition plan.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-1">
              <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link href="/apply">Apply Now</Link>
              </Button>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Secure your seat</p>
            </div>
            <div className="space-y-1">
              <Button
                variant="outline"
                className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                asChild
              >
                <Link href="/contact">Talk to Enrollment</Link>
              </Button>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Pray & plan with us</p>
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl border border-white/30 bg-white/10 p-6 text-white backdrop-blur-xl md:grid-cols-4">
            {heroStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/70">
                    <Icon className="h-4 w-4" />
                    {stat.label}
                  </div>
                  <p className="text-3xl font-serif">{stat.value}</p>
                  <p className="text-sm text-white/80">{stat.detail}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 md:py-16">
        <section className="grid gap-6 md:grid-cols-3">
          {journeySteps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={step.title}
                className="border-white/40 bg-white/10 shadow-xl shadow-primary/10 backdrop-blur-xl"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="rounded-full bg-secondary text-secondary-foreground">
                      Step {index + 1}
                    </Badge>
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-serif text-secondary">{step.title}</CardTitle>
                    <p className="text-sm text-secondary/80">{step.summary}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-secondary/85">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 rounded-2xl bg-white/60 px-3 py-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="space-y-6">
          <div>
            <Badge variant="secondary">Programs</Badge>
            <h2 className="mt-3 font-serif text-3xl text-secondary">10 Specialized Schools</h2>
            <p className="text-muted-foreground">
              Each school is designed to equip you for a specific calling. Choose the path that aligns with your God-given purpose.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'School of Biblical Foundations',
                description: 'A diploma program focused on essential doctrines, Bible interpretation, spiritual disciplines, and Christian ethics.',
                level: 'Diploma',
                price: '₦29,000',
                image: '/programs/SchoolofBiblicalFoundations.png',
              },
              {
                title: 'School of Ministry & Fivefold Leadership',
                description: 'Training for pastors, teachers, prophets, evangelists, and apostles—equipping believers for effective ministry and service.',
                level: 'Diploma',
                price: '₦32,000',
                image: '/programs/SchoolofMinistry&FivefoldLeadership.png',
              },
              {
                title: 'Kingdom Leadership & Governance Program',
                description: 'A leadership course preparing believers to influence politics, policy, and governance with integrity and biblical values.',
                level: 'Certificate',
                price: '₦11,000',
                image: '/programs/KingdomLeadership&GovernanceProgram.png',
              },
              {
                title: 'School of Prayer & Intercession',
                description: 'A deep spiritual formation track on prophetic intercession, warfare prayer, and national transformation through prayer.',
                level: 'Certificate',
                price: '₦10,000',
                image: '/programs/SchoolofPrayer&Intercession.png',
              },
              {
                title: 'Christian Apologetics & Worldview Studies',
                description: 'Equipping students to defend the faith, engage culture, and address societal issues with Scripture-based reasoning.',
                level: 'Certificate',
                price: '₦10,000',
                image: '/programs/ChristianApologetics&WorldviewStudies.png',
              },
              {
                title: 'Missions & Evangelism Academy',
                description: 'Focused on cross-cultural missions, urban evangelism, digital evangelism, and humanitarian outreach skills.',
                level: 'Certificate',
                price: '₦10,000',
                image: '/programs/Missions&EvangelismAcademy.png',
              },
              {
                title: 'Christian Media, Communication & Digital Ministry Program',
                description: 'Training in content creation, media ethics, storytelling, social media ministry, and church communications.',
                level: 'Certificate',
                price: '₦13,000',
                image: '/programs/ChristianMedia,Communication&DigitalMinistryProgram.png',
              },
              {
                title: 'Youth Mentorship & Purpose Discovery Academy',
                description: 'A program helping young believers discover their calling, build character, and understand kingdom assignment early in life.',
                level: 'Certificate',
                price: '₦8,900',
                image: '/programs/YouthMentorship&PurposeDiscoveryAcademy.png',
              },
              {
                title: 'School of Deliverance & Spiritual Warfare',
                description: 'Biblically grounded training on deliverance ministry, spiritual authority, and breaking strongholds responsibly and safely.',
                level: 'Certificate',
                price: '₦8,500',
                image: '/programs/SchoolofDeliverance&Spiritual%20Warfare.png',
              },
              {
                title: 'Christian Entrepreneurship & Kingdom Innovation Program',
                description: 'Equipping believers to build businesses, nonprofits, and community-impact projects rooted in kingdom principles.',
                level: 'Certificate',
                price: '₦10,000',
                image: '/programs/ChristianEntrepreneurship&KingdomInnovationProgram.png',
              },
            ].map((school, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/30 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-3xl"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(8,22,48,0.60), rgba(139,25,30,0.50)), url("${encodeURI(school.image)}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="relative z-10 flex h-full flex-col justify-between bg-white/5 p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="border-white/40 bg-white/20 text-white backdrop-blur-sm">
                        {school.level}
                      </Badge>
                      <span className="text-xl font-bold text-white drop-shadow-lg">{school.price}</span>
                    </div>
                    <h4 className="font-serif text-xl leading-tight text-white drop-shadow-md">
                      {school.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-white/90 drop-shadow-sm">
                      {school.description}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4 w-full bg-white/95 text-primary hover:bg-white"
                    asChild
                  >
                    <Link href="/apply">
                      Apply Now <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="border border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle>Registration Checklist</CardTitle>
              <CardDescription>Complete these steps to secure your seat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ol className="space-y-3">
                {[
                  'Submit application & testimony',
                  'Upload identification & transcripts',
                  'Meet with admissions shepherd',
                  'Confirm financial plan & sign covenant',
                ].map((item, idx) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl bg-white px-3 py-2 text-secondary">
                    <span className="text-lg font-semibold text-primary">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border border-accent/30 bg-accent/10">
            <CardHeader>
              <CardTitle>Covenant Payment Journey</CardTitle>
              <CardDescription>Flexible pathways for every household.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 h-full w-px bg-primary/30" />
                <ol className="space-y-5">
                  {paymentTimelines.map((step, idx) => (
                    <li key={step.title} className="relative space-y-2 rounded-2xl bg-white/80 p-4 text-secondary">
                      <span className="absolute -left-3 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-secondary/80">{step.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary via-secondary to-secondary/80 p-8 text-white">
          <div className="grid gap-8 md:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">Ready to begin?</p>
              <h3 className="font-serif text-3xl">Let us walk with you.</h3>
              <p className="text-white/85">
                Our admissions shepherds are available to pray with you, answer questions about tuition, and help you find
                the right EBOMI cohort.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" className="bg-white/90 text-primary hover:bg-white" asChild>
                  <Link href="/apply">Apply Online</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  asChild
                >
                  <Link href="/contact">Schedule a Call</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 text-white/90 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">Testimony</p>
              <blockquote className="mt-3 font-serif text-xl leading-relaxed">
                “EBOMI didn’t just train me—it discipled me. Admissions prayed with me through finances, and now our
                missionary interns receive the same shepherding I experienced.”
              </blockquote>
              <p className="mt-4 text-sm text-white/80">— Pastor Jeremiah El-buba</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}



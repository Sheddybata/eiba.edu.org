import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Sparkles } from 'lucide-react'

const highlights = [
  {
    title: 'Spirit-led Curriculum',
    description: 'Courses scaffolded with theology, ministry practice, and spiritual direction.',
  },
  {
    title: 'Global Cohorts',
    description: 'Students from 12 nations growing together in hybrid learning spaces.',
  },
  {
    title: 'Pastoral Care',
    description: 'On-demand chaplaincy and mentoring woven into every learning path.',
  },
  {
    title: 'Missional Outcomes',
    description: 'Graduate ready to plant fellowships, launch ministries, and serve communities.',
  },
]

const pathways = [
  {
    title: 'Student Experience',
    body: 'Track milestones, map your program, and live out “love is everything” in daily rhythms.',
    background: '/homepage/guidedpathways/StudentExperience.png',
    highlights: ['Learning roadmap', 'Spiritual disciplines', 'Peer circles'],
  },
  {
    title: 'Administrative Suite',
    body: 'Design programs, publish courses, manage announcements, and keep the academy in sync.',
    background: '/homepage/guidedpathways/AdministrativeSuite.png',
    highlights: ['Program oversight', 'Announcements', 'Quality reviews'],
  },
  {
    title: 'Faculty Hub',
    body: 'Craft resources, guide cohorts, and celebrate mastery with data-informed insights.',
    background: '/homepage/guidedpathways/FacultyHub.png',
    highlights: ['Module authoring', 'Mentoring tools', 'Assessment dashboards'],
  },
]

const testimonials = [
  {
    quote: '“EBOMI helped me steward prophetic ministry with academic rigor. The portal keeps me anchored in love.”',
    name: 'Prophet. Dr. Isa El-buba Sadiq',
    role: 'Founder, Evangelistic Bible Outreach Ministry',
  },
  {
    quote:
      '“Our students feel seen. I can shepherd cohorts while reviewing their growth in real time—an answered prayer.”',
    name: 'Pastor Jerry Ogbebor',
    role: 'Faculty Mentor & Cohort Shepherd',
  },
  {
    quote:
      '“As a pastor’s wife and ministry leader, the guided pathway ensures my women’s fellowship grows with sound doctrine.”',
    name: 'Pastor. Choice El-buba',
    role: 'Director, Love Is Everything Women Network',
  },
  {
    quote:
      '“EBOMI’s blended curriculum gave me language for missions and mercy. Every module carried the presence of God.”',
    name: 'Pastor Jeremiah El-buba',
    role: 'Lead Pastor, Love Is Everything Church',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-10 md:py-16">
        <header className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-white/70 p-6 shadow-xl shadow-primary/5 backdrop-blur md:flex-row">
          <div className="flex items-center gap-4">
            <Image
              src="/logo/ebomi-logo.jpg"
              alt="EBOMI Logo"
              width={72}
              height={72}
              className="rounded-2xl border border-primary/20 bg-white p-2"
              priority
            />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary">Ebomi International Bible Academy</p>
              <h1 className="font-serif text-3xl text-secondary">Love Is Everything</h1>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
            <Link href="/login" className="rounded-full bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20">
              Login
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
              Formation • Excellence • Missions
            </Badge>
            <h2 className="font-serif text-4xl leading-tight text-secondary md:text-5xl">
              A bespoke learning sanctuary for Christian leaders, scholars, and creatives.
            </h2>
            <p className="text-lg text-muted-foreground">
              EBOMI Portal brings together the Word of God into course design, cohort care, and progress analytics in a
              single sacred experience. Every interaction keeps our ethos at the center: Love is Everything.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/login">
                  Access Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div>
                <p className="text-2xl font-semibold text-primary">1.2k</p>
                Active learners
              </div>
              <div>
                <p className="text-2xl font-semibold text-secondary">38</p>
                Countries represented
              </div>
              <div>
                <p className="text-2xl font-semibold text-accent">94%</p>
                Completion satisfaction
              </div>
            </div>
          </div>

          <Card className="border-primary/20 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-secondary">Daily Formation Snapshot</CardTitle>
              <CardDescription>Where students spend their attention today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-dashed border-primary/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-secondary">Course Progress</p>
                  <span>72% on track</span>
                </div>
                <Progress value={72} className="mt-3 h-3" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">Upcoming Milestones</p>
                  <p className="text-3xl font-semibold text-secondary">18</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
                <div className="rounded-2xl border bg-primary/5 p-4">
                  <p className="text-sm text-muted-foreground">Pastoral Check-ins</p>
                  <p className="text-3xl font-semibold text-primary">42</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
              </div>
              <div className="rounded-2xl border border-secondary/20 p-4">
                <p className="text-sm text-muted-foreground">Today&apos;s Benediction</p>
                <p className="font-serif text-lg text-secondary">
                  “By this all people will know that you are my disciples, if you have love for one another.”
                </p>
                <p className="text-xs text-muted-foreground">John 13:35</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Highlights */}
        <section className="grid gap-6 md:grid-cols-4">
          {highlights.map((item) => (
            <Card
              key={item.title}
              className="overflow-hidden border border-white/30 bg-white/10 shadow-lg shadow-primary/10 backdrop-blur-xl"
            >
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl font-serif text-secondary">{item.title}</CardTitle>
                <CardDescription className="text-base text-secondary/80">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        {/* Pathways */}
        <section className="space-y-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Badge variant="secondary" className="w-fit bg-secondary text-secondary-foreground">
              Portals
            </Badge>
            <h3 className="font-serif text-3xl text-secondary md:text-4xl">Guided pathways for every calling</h3>
            <p className="max-w-3xl text-muted-foreground">
              Whether you are a student, faculty member, or administrator, EBOMI Portal adapts to your rhythm of service.
            </p>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/10" asChild>
              <Link href="/programs">Explore Programs</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pathways.map((pathway) => (
              <div
                key={pathway.title}
                className="relative overflow-hidden rounded-[32px] border border-white/30 bg-white/10 p-6 text-white shadow-2xl shadow-black/20 backdrop-blur-xl"
                style={{
                  backgroundImage: `linear-gradient(145deg, rgba(8,17,40,0.8), rgba(15,80,120,0.55)), url(${pathway.background})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.4em] text-white/70">Pathway</p>
                  <h4 className="font-serif text-2xl">{pathway.title}</h4>
                  <p className="text-sm text-white/80">{pathway.body}</p>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-white/90">
                  {pathway.highlights.map((detail) => (
                    <li key={detail} className="rounded-full bg-white/15 px-3 py-1">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-secondary/10 bg-secondary/5">
              <CardHeader>
                <Sparkles className="h-6 w-6 text-secondary" />
                <CardTitle className="font-serif text-xl text-secondary">Stories of Transformation</CardTitle>
                <CardDescription className="text-base text-secondary">
                  {testimonial.quote}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold text-secondary">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* CTA */}
        <section
          className="overflow-hidden rounded-[40px] border border-white/40 p-10 md:p-14 text-white shadow-2xl shadow-black/40"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(2,25,51,0.9), rgba(118,36,36,0.7)), url('/homepage/nextsteps/nextstepbackground.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.4em] text-white/80">Next steps</p>
              <h3 className="font-serif text-4xl leading-tight">
                Your calling deserves a formation home. Step into the EBOMI Academy.
              </h3>
              <p className="text-lg text-white/85">
                Every cohort journey is soaked in prayer, mentored by seasoned faculty, and backed by a pastoral support
                team that refuses to let you walk alone. Apply now to secure your seat in the next intake and experience
                the beauty of Scripture-centered learning.
              </p>
              <div className="rounded-3xl border border-white/40 bg-white/10 p-6 text-sm leading-relaxed text-white/90 backdrop-blur">
                <p className="font-semibold uppercase tracking-[0.3em] text-white">Why learners choose EBOMI</p>
                <ul className="mt-4 space-y-2 text-white/90">
                  <li>• Hybrid formats that fit ministry, work, and family rhythms</li>
                  <li>• Scholarships + covenant payment plans for every household</li>
                  <li>• Spiritual direction, prayer rooms, and ministry placement support</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6 rounded-3xl border border-white/30 bg-white/10 p-8 text-white backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Enrollment window</p>
              <div className="space-y-3">
                <p className="text-5xl font-serif">Fall 2025</p>
                <p className="text-white/80">Applications close July 15 • Cohorts launch August 12</p>
              </div>
              <div className="space-y-3 text-sm text-white/90">
                <p>What you&apos;ll receive:</p>
                <ul className="space-y-1">
                  <li>• Access to the full EBOMI learning portal</li>
                  <li>• Live mentorship circles and chapel gatherings</li>
                  <li>• Immediate onboarding kit with devotional plan</li>
                </ul>
              </div>
              <Button variant="secondary" className="w-full bg-white/95 text-primary hover:bg-white" asChild>
                <Link href="/programs">Apply Now</Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="pb-10 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EBOMI International Bible Academy · Love Is Everything
        </footer>
      </div>
    </main>
  )
}


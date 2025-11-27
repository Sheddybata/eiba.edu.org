'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react'
import { signIn } from '@/lib/actions/auth.actions'

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'faculty'>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signIn({ email, password })
      // Redirect based on role
      if (role === 'faculty') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-secondary/90 text-secondary-foreground lg:flex">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/90 to-secondary/70" />
        <div className="relative z-10 flex max-w-md flex-col gap-8 p-12 text-secondary-foreground">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/10 p-4">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">Ebomi Academy</p>
              <h1 className="font-serif text-4xl text-white">Faith. Scholarship. Service.</h1>
            </div>
          </div>
          <p className="text-lg text-white/90">
            Step into a learning experience crafted for Kingdom-minded scholars. Earn your credential, deepen your
            theology, and stay rooted in the Gospel.
          </p>
          <div className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-white/40 text-white">
                Trusted Network
              </Badge>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <blockquote className="font-serif text-xl leading-relaxed text-white">
              “This portal keeps our students, faculty, and pastors aligned around a shared mission—to form disciples who
              love like Jesus.”
            </blockquote>
            <p className="text-sm text-white/70">Rev. Miriam Osei • Dean of Students</p>
          </div>
          <Image
            src="/logo/ebomi-logo.jpg"
            alt="EBOMI Logo"
            width={180}
            height={180}
            className="self-start rounded-xl border border-white/40 bg-white/80 p-4 shadow-2xl"
            priority
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <Card className="w-full max-w-xl shadow-lg border-primary/10">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-serif text-primary">Welcome to EBOMI</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Choose your role to access the right experience. Every path upholds our motto: Love Is Everything.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={role} onValueChange={(value) => setRole(value as typeof role)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
              </TabsList>
              <TabsContent value="student" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Continue your formation journey. Review your roadmap, track courses, and stay connected to your cohort.
                </p>
              </TabsContent>
              <TabsContent value="faculty" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Publish modules, steward milestones, and pastor students toward excellence.
                </p>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@ebomi.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                  Remember me
                </label>
                <Link href="#" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    Continue as {role.charAt(0).toUpperCase() + role.slice(1)} <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
              Need an account?{' '}
              <Link href="/apply" className="font-medium text-primary hover:underline">
                Talk to our enrollment team
              </Link>{' '}
              to receive your login credentials.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



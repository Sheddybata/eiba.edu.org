'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, GraduationCap, Bell, Target, Users, FileText, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Programs',
      href: '/admin/programs',
      icon: GraduationCap,
    },
    {
      title: 'Courses',
      href: '/admin/courses',
      icon: BookOpen,
    },
    {
      title: 'Announcements',
      href: '/admin/announcements',
      icon: Bell,
    },
    {
      title: 'Milestones',
      href: '/admin/milestones',
      icon: Target,
    },
    {
      title: 'Students',
      href: '/admin/students',
      icon: Users,
    },
    {
      title: 'Applications',
      href: '/admin/applications',
      icon: FileText,
    },
    {
      title: 'Curriculum',
      href: '/admin/curriculum',
      icon: FolderOpen,
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          <div className="border-b p-6">
            <h1 className="text-xl font-bold">EIBA Portal</h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}


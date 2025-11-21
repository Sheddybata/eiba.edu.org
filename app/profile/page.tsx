'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockStudent, getMockProgramById } from '@/lib/data/mock-data'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Bell,
  Lock,
  Save,
} from 'lucide-react'

export default function ProfilePage() {
  const program = getMockProgramById(mockStudent.program_id || 'program-1')

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main Street, City, State 12345',
    dateOfBirth: '1995-05-15',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '(555) 987-6543',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    courseUpdates: true,
    gradeUpdates: true,
    announcementUpdates: true,
    milestoneReminders: true,
  })

  function handleProfileUpdate() {
    // In real app, save to backend
    alert('Profile updated successfully!')
  }

  function handlePasswordChange() {
    // In real app, handle password change
    alert('Password change functionality will be implemented here.')
  }

  return (
    <div className="container mx-auto p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-9"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-9"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="dob"
                      type="date"
                      className="pl-9"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pl-9"
                    rows={2}
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={profileData.emergencyPhone}
                    onChange={(e) => setProfileData({ ...profileData, emergencyPhone: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleProfileUpdate}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Your enrollment and program details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {program && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{program.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{program.level}</Badge>
                        <Badge variant="outline">{program.mode}</Badge>
                        <Badge variant="outline">{program.duration_years} year program</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Enrollment Date</Label>
                      <p className="mt-1">January 15, 2024</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Expected Graduation</Label>
                      <p className="mt-1">December 2025</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive updates and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Select
                    value={notificationSettings.emailNotifications ? 'enabled' : 'disabled'}
                    onValueChange={(value) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: value === 'enabled',
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                  </div>
                  <Select
                    value={notificationSettings.smsNotifications ? 'enabled' : 'disabled'}
                    onValueChange={(value) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: value === 'enabled',
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <p className="font-medium">Notification Types</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Course Updates</Label>
                    <Select
                      value={notificationSettings.courseUpdates ? 'enabled' : 'disabled'}
                      onValueChange={(value) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          courseUpdates: value === 'enabled',
                        })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Grade Updates</Label>
                    <Select
                      value={notificationSettings.gradeUpdates ? 'enabled' : 'disabled'}
                      onValueChange={(value) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          gradeUpdates: value === 'enabled',
                        })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Announcements</Label>
                    <Select
                      value={notificationSettings.announcementUpdates ? 'enabled' : 'disabled'}
                      onValueChange={(value) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          announcementUpdates: value === 'enabled',
                        })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Milestone Reminders</Label>
                    <Select
                      value={notificationSettings.milestoneReminders ? 'enabled' : 'disabled'}
                      onValueChange={(value) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          milestoneReminders: value === 'enabled',
                        })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleProfileUpdate}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="currentPassword" type="password" className="pl-9" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="newPassword" type="password" className="pl-9" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="confirmPassword" type="password" className="pl-9" />
                  </div>
                </div>
                <Button onClick={handlePasswordChange}>
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


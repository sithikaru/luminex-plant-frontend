"use client"
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import Sidebar from '@/components/layouts/Sidebar'
import useAuthGuard from '@/hooks/useAuthGuard'
import { ROLE } from '@/lib/constants'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  // client guard (app router layouts are client by default if hook used)
  useAuthGuard([ROLE.SUPER_ADMIN])
  return <DashboardLayout sidebar={<Sidebar />}>{children}</DashboardLayout>
}

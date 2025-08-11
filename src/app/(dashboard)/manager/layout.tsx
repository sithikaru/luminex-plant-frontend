import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import Sidebar from '@/components/layouts/Sidebar'
import useAuthGuard from '@/hooks/useAuthGuard'
import { ROLE } from '@/lib/constants'

export default function ManagerShell({ children }: { children: React.ReactNode }) {
  useAuthGuard([ROLE.SUPER_ADMIN, ROLE.MANAGER])
  return <DashboardLayout sidebar={<Sidebar />}>{children}</DashboardLayout>
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  BarChart,
  Leaf,
  Users,
  Settings
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['SUPER_ADMIN', 'MANAGER', 'FIELD_OFFICER']
  },
  {
    label: 'Batches',
    href: '/batches',
    icon: <Leaf className="h-5 w-5" />,
    roles: ['SUPER_ADMIN', 'MANAGER', 'FIELD_OFFICER']
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart className="h-5 w-5" />,
    roles: ['SUPER_ADMIN', 'MANAGER']
  },
  {
    label: 'Users',
    href: '/users',
    icon: <Users className="h-5 w-5" />,
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['SUPER_ADMIN']
  }
]

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const role = (session?.user as any)?.role ?? 'GUEST'

  return (
    <aside className="h-full w-full p-4 overflow-y-auto bg-white border-r">
      <h2 className="text-lg font-bold mb-6">LuminexPlant</h2>
      <nav className="space-y-2">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium transition',
                  isActive ? 'bg-slate-200 text-black' : 'text-slate-700'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
      </nav>
    </aside>
  )
}

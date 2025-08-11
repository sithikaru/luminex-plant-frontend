'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ROLE } from '@/lib/constants'
import { cn } from '@/lib/utils'

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={cn(
      'block px-4 py-2 hover:bg-gray-100 rounded-md text-sm'
    )}>
      {label}
    </Link>
  )
}

export default function Sidebar() {
  const { data } = useSession()
  const role = (data?.user as any)?.role

  return (
    <aside className="h-full p-4">
      <div className="font-semibold mb-3">Navigation</div>
      {role === ROLE.SUPER_ADMIN && (
        <nav className="space-y-1">
          <NavItem href="/admin" label="Dashboard" />
          <NavItem href="/admin/species" label="Species" />
          <NavItem href="/admin/zones" label="Zones" />
          <NavItem href="/admin/beds" label="Beds" />
          <NavItem href="/manager/batches" label="Batches" />
        </nav>
      )}
      {role === ROLE.MANAGER && (
        <nav className="space-y-1">
          <NavItem href="/manager" label="Dashboard" />
          <NavItem href="/manager/batches" label="Batches" />
        </nav>
      )}
      {role === ROLE.FIELD_OFFICER && (
        <nav className="space-y-1">
          <NavItem href="/officer" label="My Tasks" />
        </nav>
      )}
    </aside>
  )
}

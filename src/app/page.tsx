import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ROLE } from '@/lib/constants'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  const role = (session.user as any)?.role as string
  if (role === ROLE.SUPER_ADMIN) redirect('/admin')
  if (role === ROLE.MANAGER) redirect('/manager')
  redirect('/officer')
}

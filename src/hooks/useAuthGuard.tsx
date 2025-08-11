'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ROLE } from '@/lib/constants'

export default function useAuthGuard(required?: (keyof typeof ROLE)[]) {
  const { status, data } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.replace('/login')
      return
    }
    if (required && required.length > 0) {
      const role = (data?.user as any)?.role
      if (!role || !required.includes(role)) {
        // redirect based on role if possible
        const r = role === ROLE.SUPER_ADMIN ? '/admin' :
                  role === ROLE.MANAGER ? '/manager' : '/officer'
        router.replace(r)
      }
    }
  }, [status, data, router, required])
}

'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginSchema } from '@/lib/validations'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ROLE } from '@/lib/constants'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const sp = useSearchParams()

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const email = String(fd.get('email') || '')
        const password = String(fd.get('password') || '')

        const parsed = loginSchema.safeParse({ email, password })
        if (!parsed.success) {
            toast.error('Invalid form', { description: parsed.error.issues[0].message })
            return
        }

        try {
            setLoading(true)
            const res = await signIn('credentials', { email, password, redirect: false })
            if (!res || res.error) {
                toast.error('Login failed', { description: res?.error ?? 'Invalid credentials' })
                return
            }
            // decide route by role
            const role = (await (await fetch('/api/auth/session')).json()).user?.role
            const callbackUrl = sp.get('callbackUrl')
            if (callbackUrl) router.replace(callbackUrl)
            else if (role === ROLE.SUPER_ADMIN) router.replace('/admin')
            else if (role === ROLE.MANAGER) router.replace('/manager')
            else router.replace('/officer')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid place-items-center p-4">
            <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4">
                <h1 className="text-xl font-semibold">Sign in</h1>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
        </div>
    )
}

'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())
    try {
      setLoading(true)
      await api.post('/auth/register', payload)
      await api.post('/auth/register', payload)
      toast('User created')
    } catch (e: any) {
      toast(`Error: ${e.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4">
        <h1 className="text-xl font-semibold">Register User</h1>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>First name</Label><Input name="firstName" required /></div>
          <div><Label>Last name</Label><Input name="lastName" required /></div>
        </div>
        <div><Label>Email</Label><Input name="email" type="email" required /></div>
        <div><Label>Password</Label><Input name="password" type="password" required /></div>
        <div><Label>Role</Label><Input name="role" placeholder="SUPER_ADMIN|MANAGER|FIELD_OFFICER" required /></div>
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Create'}</Button>
      </form>
    </div>
  )
}

import { NextAuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { API_BASE_URL } from './constants'

type LoginResponse = {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'SUPER_ADMIN' | 'MANAGER' | 'FIELD_OFFICER'
  }
  token: string
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })
        if (!res.ok) return null
        const data = (await res.json()) as LoginResponse
        const user: User & { token: string; role: string } = {
          id: data.user.id,
          name: `${data.user.firstName} ${data.user.lastName}`,
          email: data.user.email,
          token: data.token,
          role: data.user.role,
        }
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.token = (user as any).token
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        role: token.role as string,
        token: token.token as string,
      } as any
      return session
    },
  },
}

import type { Metadata } from 'next'
import './globals.css'
import SessionProviderClient from '@/providers/SessionProviderClient'
import QueryProvider from '@/providers/QueryProvider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'LuminexPlant',
  description: 'Digital Plant Processing & Tracking System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProviderClient>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </SessionProviderClient>
      </body>
    </html>
  )
}

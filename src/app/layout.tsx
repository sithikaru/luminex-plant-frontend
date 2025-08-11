import type { Metadata } from 'next'
import './globals.css'
import SessionProviderClient from '@/providers/SessionProviderClient'
import QueryProvider from '@/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/providers/toast-provider'

export const metadata: Metadata = {
  title: 'LuminexPlant - Digital Plant Tracking System',
  description: 'Complete digital plant processing & tracking system for modern agriculture',
  keywords: ['plant tracking', 'agriculture', 'batch management', 'growth analytics'],
  authors: [{ name: 'LuminexPlant Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviderClient>
            <QueryProvider>
              {children}
              <ToastProvider />
            </QueryProvider>
          </SessionProviderClient>
        </ThemeProvider>
      </body>
    </html>
  )
}

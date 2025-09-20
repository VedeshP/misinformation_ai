import type { Metadata } from 'next'
import React from 'react'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ReactQueryProvider } from '@/lib/react-query-provider'
import { ThemeProvider } from '@/components/theme-provider'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'TrueAI - Detect Misinformation with AI',
  description: 'Fact-check faster. Analyze smarter. Detect misinformation with AI-powered analysis.',
  keywords: ['AI', 'fact-checking', 'misinformation', 'verification', 'analysis'],
  authors: [{ name: 'TrueAI Team' }],
  openGraph: {
    title: 'TrueAI - Detect Misinformation with AI',
    description: 'Fact-check faster. Analyze smarter. Detect misinformation with AI-powered analysis.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
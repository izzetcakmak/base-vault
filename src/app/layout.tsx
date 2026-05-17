import type { Metadata } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'

const mono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Base Vault — On-Chain Mystery',
  description: 'A cryptic on-chain puzzle game on Base. Can you crack the Vault?',
  openGraph: {
    title:       'Base Vault',
    description: 'A cryptic on-chain puzzle game on Base.',
    images:      ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-black text-green-400 flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

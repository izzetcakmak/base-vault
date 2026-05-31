import type { Metadata } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import { Providers } from './providers'
import { MiniAppReady } from '@/components/MiniAppReady'
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
  other: {
    'base:app_id': '6a0a5cae3b8fba876d20b052',
    'talentapp:project_verification': '69afd0c6770e5d70c9b79b2a240e5820a289c9e0b370d96ddf7bd1f2b0d677ed5f0be1bda871dcd82cacd047a18db2b3c2f8f69ae51a52a87dcaf07e8db06add',
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: 'https://basevault.xyz/og.png',
      button: {
        title: 'Enter the Vault →',
        action: {
          type: 'launch_frame',
          name: 'Base Vault',
          url: 'https://basevault.xyz',
          splashImageUrl: 'https://basevault.xyz/splash.png',
          splashBackgroundColor: '#000000',
        },
      },
    }),
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-black text-green-400 flex flex-col">
        <Providers>{children}</Providers>
        <MiniAppReady />
      </body>
    </html>
  )
}

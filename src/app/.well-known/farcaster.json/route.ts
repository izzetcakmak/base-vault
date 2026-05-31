import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_URL ?? 'https://basevault.xyz'

  const manifest = {
    accountAssociation: {
      header:    process.env.FARCASTER_HEADER    ?? '',
      payload:   process.env.FARCASTER_PAYLOAD   ?? '',
      signature: process.env.FARCASTER_SIGNATURE ?? '',
    },
    frame: {
      version:              '1',
      name:                 'Base Vault',
      iconUrl:              `${url}/icon.png`,
      splashImageUrl:       `${url}/splash.png`,
      splashBackgroundColor: '#000000',
      homeUrl:              url,
      description:          'An on-chain mystery game on Base. Crack ciphers, mint rare NFTs.',
      primaryCategory:      'games',
      tags:                 ['game', 'nft', 'puzzle', 'base', 'onchain'],
    },
  }

  return NextResponse.json(manifest)
}

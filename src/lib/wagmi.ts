import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  okxWallet,
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
  injectedWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { base, baseSepolia } from 'wagmi/chains'
import { createConfig, http } from 'wagmi'
import { getAddress } from 'viem'

// Her kaynaktan gelen adresi (env ya da sabit) geçerli EIP-55 checksum'a çevirir.
// Önce lowercase yapar ki yanlış büyük/küçük harf checksum hatası vermesin.
const addr = (a: string): `0x${string}` => getAddress(a.toLowerCase())

// Default to Base mainnet. Only use testnet when explicitly requested.
const isTestnet =
  process.env.NEXT_PUBLIC_NETWORK === 'sepolia' ||
  process.env.NEXT_PUBLIC_NETWORK === 'baseSepolia'
const chain = isTestnet ? baseSepolia : base

export const config = getDefaultConfig({
  appName: 'Base Vault',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '2f05ae7f1116030fde2d36508f472bfb',
  chains: [chain],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        okxWallet,
        coinbaseWallet,
        trustWallet,
        rainbowWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  ssr: true,
})

// Contract adresleri — Base mainnet (env yoksa bu sabitler kullanılır)
// Tüm adresler getAddress ile normalize edilir → checksum hatası olmaz.
export const CONTRACTS = {
  VAULT_KEY:    addr(process.env.NEXT_PUBLIC_VAULT_KEY    || '0xAc9F3e3D0F2bb1AACb625C67c6eDFeBf397b4463'),
  MASTER_KEY:   addr(process.env.NEXT_PUBLIC_MASTER_KEY   || '0x647A6CF58ABaFBF04b14d7E83dDaAC476D8386eF'),
  VAULT_LEGEND: addr(process.env.NEXT_PUBLIC_VAULT_LEGEND || '0x01CC8dfb1B4eD8518fcb5e9A9049B846fdB5F0e8'),
  USDC:         addr('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
  // Testnet mock USDC (sepolia'da gerçek USDC yok)
  MOCK_USDC:    (isTestnet && process.env.NEXT_PUBLIC_MOCK_USDC
                  ? addr(process.env.NEXT_PUBLIC_MOCK_USDC)
                  : undefined) as `0x${string}` | undefined,
}

// Fiyatlar (USDC — 6 decimal)
export const PRICES = {
  TIER2: BigInt(33 * 1e6),  // 33 USDC
  TIER3: BigInt(66 * 1e6),  // 66 USDC
}

// ERC-8021 attribution suffix — Builder Code: bc_6nhhetq2
// Format: hex(code) + len_byte + schemaId(0x00) + ercMarker
export const BUILDER_CODE_SUFFIX = '0x62635f366e6868657471320b0080218021802180218021802180218021' as `0x${string}`

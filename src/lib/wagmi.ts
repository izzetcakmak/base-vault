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

const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia

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

// Contract adresleri
export const CONTRACTS = {
  VAULT_KEY:    process.env.NEXT_PUBLIC_VAULT_KEY    as `0x${string}`,
  MASTER_KEY:   process.env.NEXT_PUBLIC_MASTER_KEY   as `0x${string}`,
  VAULT_LEGEND: process.env.NEXT_PUBLIC_VAULT_LEGEND as `0x${string}`,
  USDC:         '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
  // Testnet mock USDC (sepolia'da gerçek USDC yok)
  MOCK_USDC:    process.env.NEXT_PUBLIC_MOCK_USDC    as `0x${string}` | undefined,
}

// Fiyatlar (USDC — 6 decimal)
export const PRICES = {
  TIER2: BigInt(33 * 1e6),  // 33 USDC
  TIER3: BigInt(66 * 1e6),  // 66 USDC
}

// ERC-8021 attribution suffix — Builder Code: bc_6nhhetq2
// Format: hex(code) + len_byte + schemaId(0x00) + ercMarker
export const BUILDER_CODE_SUFFIX = '0x62635f366e6868657471320b0080218021802180218021802180218021' as `0x${string}`

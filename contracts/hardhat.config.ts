import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'
dotenv.config()

const PRIVATE_KEY  = process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== '0xYOUR_PRIVATE_KEY_HERE'
  ? process.env.PRIVATE_KEY
  : '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' // hardhat default test key
const BASESCAN_KEY = process.env.BASESCAN_API_KEY  || ''
const BASE_API_KEY = process.env.BASE_API_KEY      || ''

const config: HardhatUserConfig = {
  paths: {
    sources: './src',       // Solidity dosyaları src/ klasöründe
    tests:   './test',
    cache:   './cache',
    artifacts: './artifacts',
  },
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'cancun',
    },
  },
  networks: {
    // Base Sepolia — testnet (ücretsiz deploy)
    baseSepolia: {
      url: 'https://sepolia.base.org',
      chainId: 84532,
      accounts: [PRIVATE_KEY],
    },
    base: {
      url: 'https://mainnet.base.org',
      chainId: 8453,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: BASESCAN_KEY,
      base:        BASESCAN_KEY,
    },
    customChains: [
      {
        network: 'baseSepolia',
        chainId: 84532,
        urls: {
          apiURL:     'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL:     'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
    ],
  },
}

export default config

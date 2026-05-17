/**
 * Hardhat runner'a bağımlı olmayan direkt deploy scripti
 * Çalıştır: node scripts/deploy-direct.js
 */
require('dotenv').config()
const { ethers } = require('ethers')
const fs = require('fs')
const path = require('path')

const RPC_URL    = 'https://mainnet.base.org'
const CHAIN_ID   = 8453   // Base Mainnet

const IS_TESTNET = false

// IPFS URI'ler (Pinata'ya yükleyince güncelleyeceksin)
const VAULT_KEY_URI    = 'ipfs://QmVaultKeyMetadata'
const MASTER_KEY_URI   = 'ipfs://QmMasterKeyMetadata'
const VAULT_LEGEND_URI = 'ipfs://QmVaultLegendMetadata'

// Artifact'tan ABI + bytecode yükle
function loadArtifact(name) {
  const p = path.join(__dirname, '..', 'artifacts', 'src', `${name}.sol`, `${name}.json`)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

async function deploy(abi, bytecode, args, label, wallet) {
  console.log(`\n📦 Deploying ${label}...`)
  const factory  = new ethers.ContractFactory(abi, bytecode, wallet)
  const contract = await factory.deploy(...args)
  console.log(`   TX: ${contract.deploymentTransaction().hash}`)
  await contract.waitForDeployment()
  const addr = await contract.getAddress()
  console.log(`✅ ${label}: ${addr}`)
  // ABI'yi açıkça bağlı yeni instance döndür
  return new ethers.Contract(addr, abi, wallet)
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  const treasury = wallet.address

  const network = await provider.getNetwork()
  const balance = await provider.getBalance(wallet.address)

  console.log('================================================')
  console.log('BASE VAULT — DEPLOY')
  console.log('================================================')
  console.log('Network  :', network.name, '(chainId:', network.chainId.toString() + ')')
  console.log('Deployer :', wallet.address)
  console.log('Treasury :', treasury)
  console.log('Bakiye   :', ethers.formatEther(balance), 'ETH')
  console.log('================================================')

  // — MockUSDC (testnet) —
  let usdcAddress
  const MockUSDCArt    = loadArtifact('MockUSDC')
  const VaultKeyArt    = loadArtifact('VaultKey')
  const MasterKeyArt   = loadArtifact('MasterKey')
  const VaultLegendArt = loadArtifact('VaultLegend')

  if (IS_TESTNET) {
    const mockUsdc = await deploy(MockUSDCArt.abi, MockUSDCArt.bytecode, [], 'MockUSDC', wallet)
    usdcAddress    = await mockUsdc.getAddress()
    const mintTx   = await mockUsdc.mint(wallet.address, ethers.parseUnits('10000', 6))
    await mintTx.wait()
    console.log('   ✓ 10,000 test USDC minted to deployer')
  } else {
    usdcAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    console.log('\n💵 Mainnet USDC:', usdcAddress)
  }

  // — VaultKey (Tier 2) —
  const vaultKey     = await deploy(VaultKeyArt.abi, VaultKeyArt.bytecode, [usdcAddress, treasury, VAULT_KEY_URI], 'VaultKey (Tier 2)', wallet)
  const vaultKeyAddr = await vaultKey.getAddress()

  // — MasterKey (Tier 3) —
  const masterKey     = await deploy(MasterKeyArt.abi, MasterKeyArt.bytecode, [usdcAddress, vaultKeyAddr, treasury, MASTER_KEY_URI], 'MasterKey (Tier 3)', wallet)
  const masterKeyAddr = await masterKey.getAddress()

  // — VaultLegend (Tier 4) —
  const vaultLegend     = await deploy(VaultLegendArt.abi, VaultLegendArt.bytecode, [masterKeyAddr, treasury, VAULT_LEGEND_URI], 'VaultLegend (Tier 4)', wallet)
  const vaultLegendAddr = await vaultLegend.getAddress()

  // — MasterKey → VaultLegend bağla —
  console.log('\n🔗 MasterKey → VaultLegend bağlanıyor...')
  const linkTx = await masterKey.setVaultLegend(vaultLegendAddr)
  await linkTx.wait()
  console.log('✅ Bağlandı!')

  // — Kalan bakiye —
  const remaining = await provider.getBalance(wallet.address)
  const spent     = balance - remaining

  // — Özet —
  console.log('\n================================================')
  console.log('DEPLOY TAMAMLANDI! 🎉')
  console.log('================================================')
  console.log('Harcanan ETH :', ethers.formatEther(spent))
  console.log('Kalan ETH    :', ethers.formatEther(remaining))
  console.log('')
  console.log('.env.local dosyana bunları yapıştır:')
  console.log('')
  console.log(`NEXT_PUBLIC_VAULT_KEY=${vaultKeyAddr}`)
  console.log(`NEXT_PUBLIC_MASTER_KEY=${masterKeyAddr}`)
  console.log(`NEXT_PUBLIC_VAULT_LEGEND=${vaultLegendAddr}`)
  if (IS_TESTNET) {
    console.log(`NEXT_PUBLIC_MOCK_USDC=${usdcAddress}`)
    console.log('')
    console.log('Basescan:')
    console.log(`  VaultKey    → https://sepolia.basescan.org/address/${vaultKeyAddr}`)
    console.log(`  MasterKey   → https://sepolia.basescan.org/address/${masterKeyAddr}`)
    console.log(`  VaultLegend → https://sepolia.basescan.org/address/${vaultLegendAddr}`)
  }
  console.log('================================================')
}

main().catch(err => {
  console.error('\n❌ DEPLOY HATASI:', err.message)
  process.exit(1)
})

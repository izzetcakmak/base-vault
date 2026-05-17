/**
 * Tier 3 tamamlayana VaultLegend (Tier 4) NFT ver
 * Çalıştır: node scripts/reward-tier4.js
 */
require('dotenv').config()
const { ethers } = require('ethers')
const fs = require('fs')
const path = require('path')

const RPC_URL     = 'https://sepolia.base.org'
const MASTER_KEY  = '0x39502A29649fac2095C87aC6B5619bd398258FB7'
const VAULT_LEGEND = '0x9DC96E4F6Aabde457D8e1Eb61417c58Fc0a0dc0B'

// Ödül verilecek adres (şu an deployer = senin adresin)
const PLAYER = '0xD4F1254C803662c46D9c21f80F4F3c15FF57e2c9'

const MASTER_KEY_ABI = [
  'function completeTier3(address player) external',
  'function tier3Completed(address) view returns (bool)',
  'function hasMinted(address) view returns (bool)',
]

const LEGEND_ABI = [
  'function totalMinted() view returns (uint256)',
  'function hasLegend(address) view returns (bool)',
  'function ownerOf(uint256) view returns (address)',
]

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  console.log('=== TIER 4 REWARD ===')
  console.log('Owner (sen):', wallet.address)
  console.log('Oyuncu     :', PLAYER)

  const masterKey   = new ethers.Contract(MASTER_KEY,   MASTER_KEY_ABI, wallet)
  const vaultLegend = new ethers.Contract(VAULT_LEGEND, LEGEND_ABI,     wallet)

  // Kontroller
  const hasMK        = await masterKey.hasMinted(PLAYER)
  const alreadyDone  = await masterKey.tier3Completed(PLAYER)
  const alreadyLegend = await vaultLegend.hasLegend(PLAYER)

  console.log('\nMasterKey sahibi?     :', hasMK)
  console.log('Tier3 tamamlandı mı?  :', alreadyDone)
  console.log('Legend var mı zaten?  :', alreadyLegend)

  if (!hasMK) {
    console.log('\n❌ Bu adres MasterKey sahibi değil!')
    return
  }
  if (alreadyLegend) {
    console.log('\n⚠️  Bu adres zaten Vault Legend sahibi!')
    const total = await vaultLegend.totalMinted()
    console.log('Total Legend minted:', total.toString())
    return
  }

  console.log('\n📦 completeTier3 çağrılıyor → VaultLegend mint tetiklenecek...')
  const tx = await masterKey.completeTier3(PLAYER)
  console.log('TX:', tx.hash)
  console.log('Bekleniyor...')
  await tx.wait()

  const total     = await vaultLegend.totalMinted()
  const hasLegend = await vaultLegend.hasLegend(PLAYER)
  const owner     = await vaultLegend.ownerOf(total)

  console.log('\n=== SONUÇ ===')
  console.log('✅ VaultLegend mint edildi!')
  console.log('Token ID   :', total.toString())
  console.log('Sahip      :', owner)
  console.log('Legend var?:', hasLegend)
  console.log('Basescan   : https://sepolia.basescan.org/tx/' + tx.hash)
}

main().catch(e => console.error('❌ HATA:', e.message))

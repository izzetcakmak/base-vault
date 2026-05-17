/**
 * Mainnet deploy devam scripti
 * VaultKey + MasterKey zaten deploy edildi, sadece VaultLegend kaldı.
 */
require('dotenv').config()
const { ethers } = require('ethers')
const fs   = require('fs')
const path = require('path')

const RPC_URL = 'https://mainnet.base.org'

// Zaten deploy edilmiş adresler
const VAULT_KEY_ADDR  = '0xAc9F3e3D0F2bb1AACb625C67c6eDFeBf397b4463'
const MASTER_KEY_ADDR = '0x647A6CF58ABaFBF04b14d7E83dDaAC476D8386eF'

const VAULT_LEGEND_URI = 'ipfs://QmVaultLegendMetadata'

function loadArtifact(name) {
  const p = path.join(__dirname, '..', 'artifacts', 'src', `${name}.sol`, `${name}.json`)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  const balance  = await provider.getBalance(wallet.address)

  console.log('=== MAINNET DEPLOY (DEVAM) ===')
  console.log('Deployer :', wallet.address)
  console.log('Bakiye   :', ethers.formatEther(balance), 'ETH')
  console.log('')
  console.log('✅ VaultKey  :', VAULT_KEY_ADDR)
  console.log('✅ MasterKey :', MASTER_KEY_ADDR)
  console.log('')

  // VaultLegend deploy
  console.log('📦 VaultLegend deploy ediliyor...')
  const art     = loadArtifact('VaultLegend')
  const factory = new ethers.ContractFactory(art.abi, art.bytecode, wallet)
  const contract = await factory.deploy(MASTER_KEY_ADDR, wallet.address, VAULT_LEGEND_URI)
  console.log('TX:', contract.deploymentTransaction().hash)
  console.log('Onay bekleniyor...')
  await contract.waitForDeployment()
  const vaultLegendAddr = await contract.getAddress()
  console.log('✅ VaultLegend:', vaultLegendAddr)

  // MasterKey → VaultLegend bağla
  console.log('')
  console.log('🔗 MasterKey → VaultLegend bağlanıyor...')
  const masterKey = new ethers.Contract(
    MASTER_KEY_ADDR,
    ['function setVaultLegend(address) external'],
    wallet
  )
  const linkTx = await masterKey.setVaultLegend(vaultLegendAddr)
  console.log('TX:', linkTx.hash)
  await linkTx.wait()
  console.log('✅ Bağlandı!')

  const remaining = await provider.getBalance(wallet.address)

  console.log('')
  console.log('================================================')
  console.log('MAINNET DEPLOY TAMAMLANDI! 🎉')
  console.log('================================================')
  console.log('Kalan ETH:', ethers.formatEther(remaining))
  console.log('')
  console.log('.env.local dosyana bunları yapıştır:')
  console.log('')
  console.log(`NEXT_PUBLIC_VAULT_KEY=${VAULT_KEY_ADDR}`)
  console.log(`NEXT_PUBLIC_MASTER_KEY=${MASTER_KEY_ADDR}`)
  console.log(`NEXT_PUBLIC_VAULT_LEGEND=${vaultLegendAddr}`)
  console.log('')
  console.log('Basescan:')
  console.log(`  VaultKey    → https://basescan.org/address/${VAULT_KEY_ADDR}`)
  console.log(`  MasterKey   → https://basescan.org/address/${MASTER_KEY_ADDR}`)
  console.log(`  VaultLegend → https://basescan.org/address/${vaultLegendAddr}`)
  console.log('================================================')
}

main().catch(e => console.error('❌ HATA:', e.message))

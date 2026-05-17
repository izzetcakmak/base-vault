/**
 * deploy-legend-v2.js
 *
 * VaultLegend V2 (Allowlist + Phase) deploy eder ve
 * MasterKey'i yeni adrese bağlar.
 *
 * Kullanım:
 *   node scripts/deploy-legend-v2.js
 */

const { ethers } = require('ethers')
const fs   = require('fs')
const path = require('path')

// ── Config ───────────────────────────────────────────────────────
require('dotenv').config()

const PRIVATE_KEY   = process.env.PRIVATE_KEY
const RPC_URL       = 'https://mainnet.base.org'

// Mevcut deploy edilmiş adresler
const MASTER_KEY_ADDR = '0x647A6CF58ABaFBF04b14d7E83dDaAC476D8386eF'

// Geçici placeholder URI — Pinata kurulunca güncellenecek
const BASE_TOKEN_URI = 'https://base-vault.vercel.app/api/metadata'

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet   = new ethers.Wallet(PRIVATE_KEY, provider)

  console.log('🔑 Deployer :', wallet.address)
  const bal = await provider.getBalance(wallet.address)
  console.log('💰 Balance  :', ethers.formatEther(bal), 'ETH\n')

  // ── ABI + Bytecode yükle ─────────────────────────────────────
  const artifactPath = path.join(
    __dirname, '../artifacts/src/VaultLegend.sol/VaultLegend.json'
  )

  if (!fs.existsSync(artifactPath)) {
    console.error('❌ Artifact bulunamadı! Önce compile edin:')
    console.error('   cd contracts && npx hardhat compile')
    process.exit(1)
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
  const factory  = new ethers.ContractFactory(
    artifact.abi, artifact.bytecode, wallet
  )

  // ── Deploy VaultLegend V2 ────────────────────────────────────
  console.log('🚀 VaultLegend V2 deploy ediliyor...')
  console.log('   MasterKey :', MASTER_KEY_ADDR)
  console.log('   Royalty   :', wallet.address)
  console.log('   BaseURI   :', BASE_TOKEN_URI)

  const vaultLegend = await factory.deploy(
    MASTER_KEY_ADDR,
    wallet.address,   // royalty receiver = deployer
    BASE_TOKEN_URI,
    { gasLimit: 3_000_000 }
  )

  console.log('⏳ Deploy TX:', vaultLegend.deploymentTransaction().hash)
  await vaultLegend.waitForDeployment()
  const legendAddr = await vaultLegend.getAddress()
  console.log('✅ VaultLegend V2 :', legendAddr)

  // ── MasterKey → yeni VaultLegend bağla ──────────────────────
  const masterKeyABI = [
    'function setVaultLegend(address) external',
    'function owner() view returns (address)',
  ]
  const masterKey = new ethers.Contract(MASTER_KEY_ADDR, masterKeyABI, wallet)

  console.log('\n🔗 MasterKey → setVaultLegend() çağırılıyor...')
  const tx = await masterKey.setVaultLegend(legendAddr, { gasLimit: 100_000 })
  console.log('⏳ TX:', tx.hash)
  await tx.wait()
  console.log('✅ MasterKey güncellendi!')

  // ── Özet ────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60))
  console.log('📋 DEPLOY ÖZETI')
  console.log('═'.repeat(60))
  console.log('VaultLegend V2 :', legendAddr)
  console.log('MasterKey      :', MASTER_KEY_ADDR)
  console.log('')
  console.log('🔧 .env.local güncelleyin:')
  console.log(`NEXT_PUBLIC_VAULT_LEGEND=${legendAddr}`)
  console.log('')
  console.log('🔧 Vercel env güncelleyin:')
  console.log(`npx vercel env add NEXT_PUBLIC_VAULT_LEGEND`)
  console.log('═'.repeat(60))

  // ── Dosyaya kaydet ───────────────────────────────────────────
  const deployLog = {
    network: 'base-mainnet',
    timestamp: new Date().toISOString(),
    deployer: wallet.address,
    vaultLegendV2: legendAddr,
    masterKey: MASTER_KEY_ADDR,
    baseTokenURI: BASE_TOKEN_URI,
  }
  fs.writeFileSync(
    path.join(__dirname, '../deploy-legend-v2.json'),
    JSON.stringify(deployLog, null, 2)
  )
  console.log('\n💾 deploy-legend-v2.json kaydedildi.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})

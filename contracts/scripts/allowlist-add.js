/**
 * allowlist-add.js
 *
 * Tier 3 tamamlayan oyuncuları VaultLegend allowlist'ine ekler.
 *
 * Kullanım:
 *   node scripts/allowlist-add.js 0xABC... 0xDEF...
 *   node scripts/allowlist-add.js --file wallets.txt
 *
 * wallets.txt formatı (her satırda bir adres):
 *   0xAddress1
 *   0xAddress2
 */

const { ethers } = require('ethers')
const fs   = require('fs')
const path = require('path')

require('dotenv').config()

const PRIVATE_KEY     = process.env.PRIVATE_KEY
const RPC_URL         = 'https://mainnet.base.org'
const VAULT_LEGEND    = process.env.VAULT_LEGEND_V2 || '0x1D92f579d02C6f0354541DFa8Caed9f86d220D46'

const ABI = [
  'function addToAllowlist(address[] calldata) external',
  'function allowlisted(address) view returns (bool)',
  'function hasMinted(address) view returns (bool)',
  'function totalMinted() view returns (uint256)',
  'function currentPhase() view returns (uint8)',
  'function phaseMinted() view returns (uint256, uint256, uint256)',
  'event Allowlisted(address indexed wallet)',
]

async function main() {
  const args = process.argv.slice(2)

  // Adres listesini topla
  let wallets = []

  if (args[0] === '--file') {
    const filePath = args[1]
    if (!filePath || !fs.existsSync(filePath)) {
      console.error('❌ Dosya bulunamadı:', filePath)
      process.exit(1)
    }
    wallets = fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .map(l => l.trim())
      .filter(l => ethers.isAddress(l))
  } else {
    wallets = args.filter(a => ethers.isAddress(a))
  }

  if (wallets.length === 0) {
    console.error('❌ Geçerli adres bulunamadı!')
    console.error('   Kullanım: node allowlist-add.js 0xABC 0xDEF')
    console.error('         ya: node allowlist-add.js --file wallets.txt')
    process.exit(1)
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet   = new ethers.Wallet(PRIVATE_KEY, provider)
  const contract = new ethers.Contract(VAULT_LEGEND, ABI, wallet)

  console.log('🔑 Deployer    :', wallet.address)
  console.log('📋 VaultLegend :', VAULT_LEGEND)
  console.log('')

  // Mevcut durumu göster
  const total     = await contract.totalMinted()
  const phase     = await contract.currentPhase()
  const [p1,p2,p3] = await contract.phaseMinted()
  console.log(`📊 Mevcut Durum: ${total}/333 mint edildi`)
  console.log(`   Phase 1 (Early):  ${p1}/33`)
  console.log(`   Phase 2 (Core):   ${p2}/100`)
  console.log(`   Phase 3 (Final):  ${p3}/200`)
  console.log(`   Aktif Phase: ${phase}`)
  console.log('')

  // Zaten mint etmiş olanları filtrele
  console.log(`📝 ${wallets.length} adres kontrol ediliyor...`)
  const toAdd = []
  for (const addr of wallets) {
    const alreadyMinted  = await contract.hasMinted(addr)
    const alreadyListed  = await contract.allowlisted(addr)

    if (alreadyMinted) {
      console.log(`   ⏭  ${addr} — Zaten mint etmiş, atlanıyor`)
    } else if (alreadyListed) {
      console.log(`   ⚠️  ${addr} — Zaten allowlist'te`)
    } else {
      console.log(`   ✓  ${addr} — Eklenecek`)
      toAdd.push(addr)
    }
  }

  if (toAdd.length === 0) {
    console.log('\nℹ️  Eklenecek yeni adres yok.')
    return
  }

  console.log(`\n🚀 ${toAdd.length} adres allowlist'e ekleniyor...`)
  const tx = await contract.addToAllowlist(toAdd, {
    gasLimit: 50_000 + toAdd.length * 30_000
  })
  console.log('⏳ TX:', tx.hash)
  console.log('   Basescan:', `https://basescan.org/tx/${tx.hash}`)

  const receipt = await tx.wait()
  console.log(`✅ Başarılı! Gas kullanıldı: ${receipt.gasUsed.toString()}`)

  // Log dosyasına kaydet
  const logEntry = {
    timestamp: new Date().toISOString(),
    txHash: tx.hash,
    addedWallets: toAdd,
    totalMintedBefore: total.toString(),
  }
  const logPath = path.join(__dirname, '../allowlist-log.json')
  let log = []
  if (fs.existsSync(logPath)) {
    log = JSON.parse(fs.readFileSync(logPath, 'utf8'))
  }
  log.push(logEntry)
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2))
  console.log('💾 allowlist-log.json güncellendi.')
  console.log('')
  console.log('ℹ️  Oyunculara şu linki gönderin:')
  console.log('   https://base-vault.vercel.app → "Claim Your Legend" butonu')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})

/**
 * allowlist-check.js
 *
 * VaultLegend durumunu ve belirli adreslerin allowlist/mint durumunu kontrol eder.
 *
 * Kullanım:
 *   node scripts/allowlist-check.js
 *   node scripts/allowlist-check.js 0xABC... 0xDEF...
 */

const { ethers } = require('ethers')
require('dotenv').config()

const RPC_URL      = 'https://mainnet.base.org'
const VAULT_LEGEND = process.env.VAULT_LEGEND_V2 || '0x1D92f579d02C6f0354541DFa8Caed9f86d220D46'

const ABI = [
  'function totalMinted() view returns (uint256)',
  'function currentPhase() view returns (uint8)',
  'function phaseMinted() view returns (uint256, uint256, uint256)',
  'function allowlisted(address) view returns (bool)',
  'function hasMinted(address) view returns (bool)',
  'function tokenPhase(uint256) view returns (uint8)',
  'function ownerOf(uint256) view returns (address)',
]

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const contract = new ethers.Contract(VAULT_LEGEND, ABI, provider)
  const args     = process.argv.slice(2).filter(a => ethers.isAddress(a))

  console.log('═'.repeat(60))
  console.log(' BASE VAULT — VaultLegend Durum Raporu')
  console.log('═'.repeat(60))
  console.log(' Contract   :', VAULT_LEGEND)
  console.log(' Network    : Base Mainnet')
  console.log('─'.repeat(60))

  const total = await contract.totalMinted()
  const phase = await contract.currentPhase()
  const [p1, p2, p3] = await contract.phaseMinted()
  const remaining = 333n - total

  console.log(` Toplam Mint : ${total}/333  (${remaining} kaldı)`)
  console.log(` Aktif Phase : Phase ${phase}`)
  console.log('')
  console.log(` Phase 1 — Early Legends  : ${p1}/33`)
  console.log(` Phase 2 — Core Legends   : ${p2}/100`)
  console.log(` Phase 3 — Final Legends  : ${p3}/200`)

  const p1pct = Number(p1) * 100 / 33
  const p2pct = Number(p2) * 100 / 100
  const p3pct = Number(p3) * 100 / 200
  console.log('')
  console.log(` Phase 1 doluluk: ${'█'.repeat(Math.floor(p1pct/5))}${'░'.repeat(20-Math.floor(p1pct/5))} ${p1pct.toFixed(0)}%`)
  console.log(` Phase 2 doluluk: ${'█'.repeat(Math.floor(p2pct/5))}${'░'.repeat(20-Math.floor(p2pct/5))} ${p2pct.toFixed(0)}%`)
  console.log(` Phase 3 doluluk: ${'█'.repeat(Math.floor(p3pct/5))}${'░'.repeat(20-Math.floor(p3pct/5))} ${p3pct.toFixed(0)}%`)

  // Adres sorgulama
  if (args.length > 0) {
    console.log('\n' + '─'.repeat(60))
    console.log(' Adres Sorgusu')
    console.log('─'.repeat(60))
    for (const addr of args) {
      const listed  = await contract.allowlisted(addr)
      const minted  = await contract.hasMinted(addr)
      const status  = minted  ? '✅ Mint edildi'
                    : listed  ? '🟡 Allowlist\'te (henüz mint etmedi)'
                    : '❌ Allowlist\'te değil'
      console.log(` ${addr}`)
      console.log(`   → ${status}`)
    }
  }

  console.log('\n' + '═'.repeat(60))
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})

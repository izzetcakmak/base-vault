/**
 * verify.ts  — Basescan'de 3 kontratı verify eder
 *
 * Kullanım:
 *   npx hardhat run scripts/verify.ts --network base
 *
 * Önce contracts/.env dosyasına BASESCAN_API_KEY ekle:
 *   BASESCAN_API_KEY=YOUR_KEY_HERE
 *
 * API key: https://basescan.org/myapikey (ücretsiz)
 */

import { run } from 'hardhat'

// ── Deploy edilmiş adresler ────────────────────────────────────────────────────
const VAULT_KEY_ADDR    = '0xAc9F3e3D0F2bb1AACb625C67c6eDFeBf397b4463'
const MASTER_KEY_ADDR   = '0x647A6CF58ABaFBF04b14d7E83dDaAC476D8386eF'
const VAULT_LEGEND_ADDR = '0x01CC8dfb1B4eD8518fcb5e9A9049B846fdB5F0e8'

// ── Constructor argümanları (deploy anındaki değerler) ────────────────────────
const USDC_MAINNET  = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const TREASURY      = '0xD4F1254C803662c46D9c21f80F4F3c15FF57e2c9'

const VAULT_KEY_URI    = 'ipfs://QmVaultKeyMetadata'
const MASTER_KEY_URI   = 'ipfs://QmMasterKeyMetadata'
const VAULT_LEGEND_URI = 'ipfs://QmVaultLegendMetadata'

async function main() {
  console.log('🔍 Basescan verify başlıyor...\n')

  // ── 1. VaultKey ───────────────────────────────────────────────────────────
  console.log('1/3 VaultKey verify ediliyor...')
  try {
    await run('verify:verify', {
      address: VAULT_KEY_ADDR,
      constructorArguments: [USDC_MAINNET, TREASURY, VAULT_KEY_URI],
    })
    console.log('✅ VaultKey verified!\n')
  } catch (e: any) {
    if (e.message?.includes('Already Verified')) {
      console.log('ℹ️  VaultKey zaten verify edilmiş.\n')
    } else {
      console.error('❌ VaultKey verify hatası:', e.message, '\n')
    }
  }

  // ── 2. MasterKey ─────────────────────────────────────────────────────────
  console.log('2/3 MasterKey verify ediliyor...')
  try {
    await run('verify:verify', {
      address: MASTER_KEY_ADDR,
      constructorArguments: [USDC_MAINNET, VAULT_KEY_ADDR, TREASURY, MASTER_KEY_URI],
    })
    console.log('✅ MasterKey verified!\n')
  } catch (e: any) {
    if (e.message?.includes('Already Verified')) {
      console.log('ℹ️  MasterKey zaten verify edilmiş.\n')
    } else {
      console.error('❌ MasterKey verify hatası:', e.message, '\n')
    }
  }

  // ── 3. VaultLegend ───────────────────────────────────────────────────────
  console.log('3/3 VaultLegend verify ediliyor...')
  try {
    await run('verify:verify', {
      address: VAULT_LEGEND_ADDR,
      constructorArguments: [MASTER_KEY_ADDR, TREASURY, VAULT_LEGEND_URI],
    })
    console.log('✅ VaultLegend verified!\n')
  } catch (e: any) {
    if (e.message?.includes('Already Verified')) {
      console.log('ℹ️  VaultLegend zaten verify edilmiş.\n')
    } else {
      console.error('❌ VaultLegend verify hatası:', e.message, '\n')
    }
  }

  console.log('========================================')
  console.log('VERIFY TAMAMLANDI')
  console.log('========================================')
  console.log('Kontrat linkleri:')
  console.log(`VaultKey    → https://basescan.org/address/${VAULT_KEY_ADDR}#code`)
  console.log(`MasterKey   → https://basescan.org/address/${MASTER_KEY_ADDR}#code`)
  console.log(`VaultLegend → https://basescan.org/address/${VAULT_LEGEND_ADDR}#code`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

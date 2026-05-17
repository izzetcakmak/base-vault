/**
 * update-masterkey-legend.js
 * MasterKey kontratını yeni VaultLegend adresine bağlar.
 */
const { ethers } = require('ethers')
require('dotenv').config()

const PRIVATE_KEY       = process.env.PRIVATE_KEY
const RPC_URL           = 'https://mainnet.base.org'
const MASTER_KEY_ADDR   = '0x647A6CF58ABaFBF04b14d7E83dDaAC476D8386eF'
const VAULT_LEGEND_V2   = '0xEDcC258A8705cBb3DD87Ed70C498d8d74cEE8dD7'

async function main() {
  const provider  = new ethers.JsonRpcProvider(RPC_URL)
  const wallet    = new ethers.Wallet(PRIVATE_KEY, provider)

  const abi = ['function setVaultLegend(address) external']
  const masterKey = new ethers.Contract(MASTER_KEY_ADDR, abi, wallet)

  console.log('🔗 MasterKey → setVaultLegend(', VAULT_LEGEND_V2, ')')
  const tx = await masterKey.setVaultLegend(VAULT_LEGEND_V2, {
    gasLimit: 100_000,
    maxFeePerGas: ethers.parseUnits('0.015', 'gwei'),
  })
  console.log('⏳ TX:', tx.hash)
  console.log('   Basescan: https://basescan.org/tx/' + tx.hash)
  const receipt = await tx.wait()
  console.log('✅ Bağlantı güncellendi! Gas:', receipt.gasUsed.toString())
}

main().catch(e => { console.error(e); process.exit(1) })

/**
 * deploy-legend-v3.js
 * VaultLegend V3 — düz metadata URI (ipfs://.../1.json)
 * 0 NFT mint edildi, güvenle yeniden deploy edebiliriz.
 */
const { ethers } = require('ethers')
const fs   = require('fs')
const path = require('path')
require('dotenv').config()

const PRIVATE_KEY     = process.env.PRIVATE_KEY
const RPC_URL         = 'https://mainnet.base.org'
const MASTER_KEY_ADDR = '0x647A6CF58ABaFBF04b14d7E83dDaAC476D8386eF'

// IPFS base URI — sonunda / olmalı
const BASE_TOKEN_URI = 'ipfs://bafybeiebtflkwwbi4ha76i4wogwqpvrrqc7l2jdk3etvxf4o6pqduqgvzu/base-vault-legends-metadata/'

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet   = new ethers.Wallet(PRIVATE_KEY, provider)

  console.log('🔑 Deployer :', wallet.address)
  const bal = await provider.getBalance(wallet.address)
  console.log('💰 Balance  :', ethers.formatEther(bal), 'ETH\n')

  const artifactPath = path.join(__dirname, '../artifacts/src/VaultLegend.sol/VaultLegend.json')
  const artifact     = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
  const factory      = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet)

  console.log('🚀 VaultLegend V3 deploy ediliyor...')
  console.log('   BaseURI:', BASE_TOKEN_URI)

  const vaultLegend = await factory.deploy(
    MASTER_KEY_ADDR,
    wallet.address,
    BASE_TOKEN_URI,
    { gasLimit: 3_000_000 }
  )
  console.log('⏳ TX:', vaultLegend.deploymentTransaction().hash)
  await vaultLegend.waitForDeployment()
  const legendAddr = await vaultLegend.getAddress()
  console.log('✅ VaultLegend V3 :', legendAddr)

  // MasterKey güncelle
  const mkABI = ['function setVaultLegend(address) external']
  const masterKey = new ethers.Contract(MASTER_KEY_ADDR, mkABI, wallet)
  console.log('\n🔗 MasterKey güncelleniyor...')
  const tx2 = await masterKey.setVaultLegend(legendAddr, { gasLimit: 100_000 })
  console.log('⏳ TX:', tx2.hash)
  await tx2.wait()
  console.log('✅ MasterKey → V3 bağlandı!\n')

  console.log('═'.repeat(55))
  console.log('📋 YENİ ADRES:', legendAddr)
  console.log('═'.repeat(55))
  console.log('NEXT_PUBLIC_VAULT_LEGEND=' + legendAddr)
  console.log('═'.repeat(55))

  fs.writeFileSync(
    path.join(__dirname, '../deploy-legend-v3.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      deployer: wallet.address,
      vaultLegendV3: legendAddr,
      masterKey: MASTER_KEY_ADDR,
      baseTokenURI: BASE_TOKEN_URI,
    }, null, 2)
  )
}

main().catch(e => { console.error(e); process.exit(1) })

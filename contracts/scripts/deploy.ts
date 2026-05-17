import { ethers, network, run } from 'hardhat'

// ─── Ayarlar ─────────────────────────────────────────────────────────────────
// Base mainnet USDC
const USDC_MAINNET  = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
// Base Sepolia'da gerçek USDC yok — mock deploy edilmiş adres kullanıyoruz
// (testnet'te mint flow test etmek için aşağıda MockUSDC deploy ediyoruz)
const IS_TESTNET    = network.name === 'baseSepolia'

// IPFS — deploy sonrası Pinata'ya yükleyip güncelleyebilirsin
const VAULT_KEY_URI    = 'ipfs://QmVaultKeyMetadata'
const MASTER_KEY_URI   = 'ipfs://QmMasterKeyMetadata'
const VAULT_LEGEND_URI = 'ipfs://QmVaultLegendMetadata'

async function main() {
  const [deployer] = await ethers.getSigners()
  const treasury   = deployer.address   // Gelir senin cüzdanına gider

  console.log('\n========================================')
  console.log('BASE VAULT — DEPLOY')
  console.log('========================================')
  console.log('Network  :', network.name)
  console.log('Deployer :', deployer.address)
  console.log('Treasury :', treasury)
  console.log('Balance  :', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH')
  console.log('========================================\n')

  let usdcAddress: string

  // ── Testnet: Mock USDC deploy et ──────────────────────────────
  if (IS_TESTNET) {
    console.log('📦 Deploying MockUSDC (testnet only)...')
    const MockUSDC = await ethers.getContractFactory('MockUSDC')
    const mockUsdc = await MockUSDC.deploy()
    await mockUsdc.waitForDeployment()
    usdcAddress = await mockUsdc.getAddress()
    console.log('✅ MockUSDC    :', usdcAddress)

    // Deployer'a 10,000 USDC mint et (test için)
    const mintTx = await (mockUsdc as any).mint(deployer.address, ethers.parseUnits('10000', 6))
    await mintTx.wait()
    console.log('   Minted 10,000 test USDC to deployer\n')
  } else {
    usdcAddress = USDC_MAINNET
    console.log('💵 Using mainnet USDC:', usdcAddress, '\n')
  }

  // ── 1. VaultKey (Tier 2) ──────────────────────────────────────
  console.log('📦 Deploying VaultKey (Tier 2)...')
  const VaultKey = await ethers.getContractFactory('VaultKey')
  const vaultKey = await VaultKey.deploy(usdcAddress, treasury, VAULT_KEY_URI)
  await vaultKey.waitForDeployment()
  const vaultKeyAddr = await vaultKey.getAddress()
  console.log('✅ VaultKey    :', vaultKeyAddr)

  // ── 2. MasterKey (Tier 3) ─────────────────────────────────────
  console.log('📦 Deploying MasterKey (Tier 3)...')
  const MasterKey = await ethers.getContractFactory('MasterKey')
  const masterKey = await MasterKey.deploy(usdcAddress, vaultKeyAddr, treasury, MASTER_KEY_URI)
  await masterKey.waitForDeployment()
  const masterKeyAddr = await masterKey.getAddress()
  console.log('✅ MasterKey   :', masterKeyAddr)

  // ── 3. VaultLegend (Tier 4) ───────────────────────────────────
  console.log('📦 Deploying VaultLegend (Tier 4)...')
  const VaultLegend = await ethers.getContractFactory('VaultLegend')
  const vaultLegend = await VaultLegend.deploy(masterKeyAddr, treasury, VAULT_LEGEND_URI)
  await vaultLegend.waitForDeployment()
  const vaultLegendAddr = await vaultLegend.getAddress()
  console.log('✅ VaultLegend :', vaultLegendAddr)

  // ── 4. Bağla: MasterKey → VaultLegend ─────────────────────────
  console.log('\n🔗 Linking MasterKey → VaultLegend...')
  const linkTx = await (masterKey as any).setVaultLegend(vaultLegendAddr)
  await linkTx.wait()
  console.log('✅ Linked!\n')

  // ── Verify (Basescan) ─────────────────────────────────────────
  if (!IS_TESTNET || process.env.BASESCAN_API_KEY) {
    console.log('🔍 Verifying contracts on Basescan...')
    await new Promise(r => setTimeout(r, 10000)) // indexer bekle

    try {
      await run('verify:verify', { address: vaultKeyAddr,    constructorArguments: [usdcAddress, treasury, VAULT_KEY_URI]    })
      await run('verify:verify', { address: masterKeyAddr,   constructorArguments: [usdcAddress, vaultKeyAddr, treasury, MASTER_KEY_URI] })
      await run('verify:verify', { address: vaultLegendAddr, constructorArguments: [masterKeyAddr, treasury, VAULT_LEGEND_URI] })
      console.log('✅ Verified!\n')
    } catch (e) {
      console.log('⚠️  Verify failed (manuel yapabilirsin):', e)
    }
  }

  // ── Özet ──────────────────────────────────────────────────────
  console.log('========================================')
  console.log('DEPLOY TAMAMLANDI')
  console.log('========================================')
  console.log('Bu adresleri .env.local dosyana yaz:\n')
  console.log(`NEXT_PUBLIC_VAULT_KEY=${vaultKeyAddr}`)
  console.log(`NEXT_PUBLIC_MASTER_KEY=${masterKeyAddr}`)
  console.log(`NEXT_PUBLIC_VAULT_LEGEND=${vaultLegendAddr}`)
  if (IS_TESTNET) {
    console.log(`\nMockUSDC (testnet): ${usdcAddress}`)
    console.log('Basescan: https://sepolia.basescan.org/address/' + vaultKeyAddr)
  } else {
    console.log('Basescan: https://basescan.org/address/' + vaultKeyAddr)
  }
  console.log('========================================')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

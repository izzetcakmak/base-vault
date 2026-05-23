import { ethers, run } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('\n========================================')
  console.log('BASE VAULT — VaultPoints + VaultLeaderboard')
  console.log('Deployer:', deployer.address)
  console.log('Balance :', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH')
  console.log('========================================\n')

  // ── 1. VaultPoints ──────────────────────────────────────────────────────
  console.log('📦 Deploying VaultPoints...')
  const VaultPoints = await ethers.getContractFactory('VaultPoints')
  const vaultPoints = await VaultPoints.deploy()
  await vaultPoints.waitForDeployment()
  const vpAddr = await vaultPoints.getAddress()
  console.log('✅ VaultPoints    :', vpAddr)

  // ── 2. VaultLeaderboard ─────────────────────────────────────────────────
  console.log('📦 Deploying VaultLeaderboard...')
  const VaultLeaderboard = await ethers.getContractFactory('VaultLeaderboard')
  const vaultLeaderboard = await VaultLeaderboard.deploy()
  await vaultLeaderboard.waitForDeployment()
  const lbAddr = await vaultLeaderboard.getAddress()
  console.log('✅ VaultLeaderboard:', lbAddr)

  // ── Verify ──────────────────────────────────────────────────────────────
  console.log('\n🔍 Basescan verify bekleniyor (10sn)...')
  await new Promise(r => setTimeout(r, 10000))

  for (const [name, addr, args] of [
    ['VaultPoints',     vpAddr, []],
    ['VaultLeaderboard', lbAddr, []],
  ] as [string, string, any[]][]) {
    try {
      await run('verify:verify', { address: addr, constructorArguments: args })
      console.log(`✅ ${name} verified!`)
    } catch (e: any) {
      if (e.message?.includes('Already Verified')) {
        console.log(`ℹ️  ${name} zaten verified.`)
      } else {
        console.log(`⚠️  ${name} verify sonra yapılacak:`, e.message?.slice(0, 80))
      }
    }
  }

  console.log('\n========================================')
  console.log('DEPLOY TAMAMLANDI')
  console.log('VaultPoints    :', vpAddr)
  console.log('VaultLeaderboard:', lbAddr)
  console.log('Basescan:')
  console.log('  https://basescan.org/address/' + vpAddr)
  console.log('  https://basescan.org/address/' + lbAddr)
  console.log('========================================')
}

main().catch(err => { console.error(err); process.exit(1) })

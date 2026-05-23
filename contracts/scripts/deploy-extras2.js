const { ethers, run } = require('hardhat');

async function main() {
  process.stdout.write('========================================\n');
  process.stdout.write('BASE VAULT — VaultPoints + VaultLeaderboard DEPLOY\n');

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  process.stdout.write('Deployer: ' + deployer.address + '\n');
  process.stdout.write('Balance : ' + ethers.formatEther(balance) + ' ETH\n');
  process.stdout.write('========================================\n');

  // VaultPoints
  process.stdout.write('Deploying VaultPoints...\n');
  const VaultPoints = await ethers.getContractFactory('VaultPoints');
  const vp = await VaultPoints.deploy();
  await vp.waitForDeployment();
  const vpAddr = await vp.getAddress();
  process.stdout.write('VaultPoints: ' + vpAddr + '\n');

  // VaultLeaderboard
  process.stdout.write('Deploying VaultLeaderboard...\n');
  const VaultLeaderboard = await ethers.getContractFactory('VaultLeaderboard');
  const lb = await VaultLeaderboard.deploy();
  await lb.waitForDeployment();
  const lbAddr = await lb.getAddress();
  process.stdout.write('VaultLeaderboard: ' + lbAddr + '\n');

  process.stdout.write('\nWaiting 10s for Basescan indexer...\n');
  await new Promise(r => setTimeout(r, 10000));

  for (const [name, addr] of [['VaultPoints', vpAddr], ['VaultLeaderboard', lbAddr]]) {
    try {
      await run('verify:verify', { address: addr, constructorArguments: [] });
      process.stdout.write('✅ ' + name + ' VERIFIED\n');
    } catch (e) {
      if (e.message && e.message.includes('Already Verified')) {
        process.stdout.write('ℹ️  ' + name + ' already verified\n');
      } else {
        process.stdout.write('⚠️  ' + name + ' verify later: ' + (e.message || '').slice(0, 80) + '\n');
      }
    }
  }

  process.stdout.write('\n========================================\n');
  process.stdout.write('DONE\n');
  process.stdout.write('VaultPoints    : ' + vpAddr + '\n');
  process.stdout.write('VaultLeaderboard: ' + lbAddr + '\n');
  process.stdout.write('https://basescan.org/address/' + vpAddr + '\n');
  process.stdout.write('https://basescan.org/address/' + lbAddr + '\n');
}

main().catch(e => { process.stderr.write('ERROR: ' + e.toString() + '\n'); process.exit(1); });

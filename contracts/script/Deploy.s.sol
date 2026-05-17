// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/VaultKey.sol";
import "../src/MasterKey.sol";
import "../src/VaultLegend.sol";

/**
 * @notice Base Vault deploy scripti
 * @dev Çalıştır:
 *   forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
 */
contract Deploy is Script {
    // Base mainnet USDC
    address constant USDC_BASE = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    // IPFS metadata base URI (Pinata'ya yükledikten sonra güncelle)
    string constant VKEY_URI  = "ipfs://QmVaultKeyMetadata";
    string constant MKEY_URI  = "ipfs://QmMasterKeyMetadata";
    string constant VLEG_URI  = "ipfs://QmVaultLegendMetadata";

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerKey);
        address treasury    = vm.envOr("TREASURY_ADDRESS", deployer);

        console.log("=== BASE VAULT DEPLOY ===");
        console.log("Deployer / Treasury:", deployer);

        vm.startBroadcast(deployerKey);

        // 1. VaultKey (Tier 2)
        VaultKey vaultKey = new VaultKey(USDC_BASE, treasury, VKEY_URI);
        console.log("VaultKey deployed:", address(vaultKey));

        // 2. MasterKey (Tier 3)
        MasterKey masterKey = new MasterKey(USDC_BASE, address(vaultKey), treasury, MKEY_URI);
        console.log("MasterKey deployed:", address(masterKey));

        // 3. VaultLegend (Tier 4) — royalty deployer'a gider
        VaultLegend vaultLegend = new VaultLegend(address(masterKey), deployer, VLEG_URI);
        console.log("VaultLegend deployed:", address(vaultLegend));

        // 4. MasterKey'e VaultLegend adresini bağla
        masterKey.setVaultLegend(address(vaultLegend));
        console.log("VaultLegend linked to MasterKey");

        vm.stopBroadcast();

        console.log("=== DEPLOY TAMAMLANDI ===");
        console.log("Asagidaki adresleri .env.local'e kaydet:");
        console.log("NEXT_PUBLIC_VAULT_KEY=", address(vaultKey));
        console.log("NEXT_PUBLIC_MASTER_KEY=", address(masterKey));
        console.log("NEXT_PUBLIC_VAULT_LEGEND=", address(vaultLegend));
    }
}

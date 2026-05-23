// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VaultPoints — Base Vault In-Game Reward Token
 * @notice Players earn VP tokens by completing game tiers.
 *         Tier 1 = 100 VP, Tier 2 = 500 VP, Tier 3 = 1000 VP
 * @dev Only owner (game contract / deployer) can mint.
 */
contract VaultPoints is ERC20, Ownable {

    // ─── Tier ödül miktarları ────────────────────────────────────────────────
    uint256 public constant TIER1_REWARD = 100  * 1e18;
    uint256 public constant TIER2_REWARD = 500  * 1e18;
    uint256 public constant TIER3_REWARD = 1000 * 1e18;

    // ─── Oyuncu bazlı ödül takibi ────────────────────────────────────────────
    mapping(address => uint8) public highestTierCompleted;

    // ─── Yetkili mint adresleri (game contracts) ─────────────────────────────
    mapping(address => bool) public isMinter;

    // ─── Events ──────────────────────────────────────────────────────────────
    event TierRewarded(address indexed player, uint8 tier, uint256 amount);
    event MinterUpdated(address indexed minter, bool status);

    // ─── Constructor ─────────────────────────────────────────────────────────
    constructor() ERC20("Vault Points", "VP") Ownable(msg.sender) {}

    // ─── Mint (sadece owner veya yetkili minter) ──────────────────────────────
    modifier onlyMinter() {
        require(isMinter[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    /// @notice Oyuncuya tier tamamlama ödülü ver
    function rewardTier(address player, uint8 tier) external onlyMinter {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(tier > highestTierCompleted[player], "Already rewarded");

        uint256 amount;
        if (tier == 1) amount = TIER1_REWARD;
        else if (tier == 2) amount = TIER2_REWARD;
        else amount = TIER3_REWARD;

        highestTierCompleted[player] = tier;
        _mint(player, amount);

        emit TierRewarded(player, tier, amount);
    }

    /// @notice Serbest mint (owner only, özel durumlar için)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Minter yetkisi ver / al
    function setMinter(address minter, bool status) external onlyOwner {
        isMinter[minter] = status;
        emit MinterUpdated(minter, status);
    }
}

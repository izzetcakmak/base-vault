// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VaultLeaderboard — Base Vault On-Chain Leaderboard
 * @notice Records player completion times and ranks them on-chain.
 *         Fully transparent — anyone can verify scores on Base.
 */
contract VaultLeaderboard is Ownable {

    // ─── Veri yapıları ───────────────────────────────────────────────────────
    struct Entry {
        address player;
        uint8   tier;           // 1, 2 veya 3
        uint32  completionTime; // saniye cinsinden (Unix timestamp)
        uint32  score;          // tier × 1000 − geçen süre bonusu
    }

    // ─── State ────────────────────────────────────────────────────────────────
    Entry[] public leaderboard;

    // Oyuncu başına en iyi skor
    mapping(address => mapping(uint8 => uint32)) public bestScore;

    // Yetkili yazıcılar (game backend)
    mapping(address => bool) public isRecorder;

    uint256 public constant MAX_ENTRIES = 333;

    // ─── Events ───────────────────────────────────────────────────────────────
    event ScoreRecorded(address indexed player, uint8 tier, uint32 score, uint32 timestamp);
    event RecorderUpdated(address indexed recorder, bool status);

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor() Ownable(msg.sender) {}

    // ─── Modifier ─────────────────────────────────────────────────────────────
    modifier onlyRecorder() {
        require(isRecorder[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    // ─── Skor kaydet ──────────────────────────────────────────────────────────
    /// @notice Oyuncu tamamlama skorunu kaydet
    function recordScore(address player, uint8 tier, uint32 completionTime) external onlyRecorder {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(player != address(0), "Invalid player");

        // Basit skor hesabı: tier × 1000, erken tamamlayana bonus
        uint32 score = uint32(tier) * 1000;
        if (completionTime > 0 && completionTime < 3600) {
            // 1 saat içinde tamamlarsa bonus puan (max 500)
            uint32 bonus = uint32((3600 - completionTime) / 7);
            score += bonus;
        }

        // Sadece daha iyi skor varsa ekle
        if (score > bestScore[player][tier]) {
            bestScore[player][tier] = score;

            if (leaderboard.length < MAX_ENTRIES) {
                leaderboard.push(Entry({
                    player:         player,
                    tier:           tier,
                    completionTime: completionTime,
                    score:          score
                }));
            }

            emit ScoreRecorded(player, tier, score, completionTime);
        }
    }

    // ─── Okuma fonksiyonları ──────────────────────────────────────────────────
    /// @notice Toplam kayıtlı oyuncu sayısı
    function totalEntries() external view returns (uint256) {
        return leaderboard.length;
    }

    /// @notice Sayfa sayfa oku
    function getEntries(uint256 offset, uint256 limit) external view returns (Entry[] memory) {
        uint256 end = offset + limit;
        if (end > leaderboard.length) end = leaderboard.length;
        Entry[] memory result = new Entry[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = leaderboard[i];
        }
        return result;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────
    function setRecorder(address recorder, bool status) external onlyOwner {
        isRecorder[recorder] = status;
        emit RecorderUpdated(recorder, status);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VaultLegend V2 — Base Vault Tier 4 NFT (NADİR)
 *
 * ┌─────────────────────────────────────────────┐
 * │  PHASE 1 — Early Legends    Token  1–33     │
 * │  PHASE 2 — Core Legends     Token 34–133    │
 * │  PHASE 3 — Final Legends    Token 134–333   │
 * └─────────────────────────────────────────────┘
 *
 * Mint Flow:
 *  1. Oyuncu Tier 3 oyununu tamamlar.
 *  2. Owner → addToAllowlist([wallet]) çağırır.
 *  3. Oyuncu → mint() çağırır (OpenSea drop sayfası veya uygulamamız).
 *  4. NFT doğrudan oyuncunun cüzdanına mint edilir.
 *
 * Backward compat: MasterKey hâlâ rewardMint() kullanabilir.
 * Royalty: %7.5 (EIP-2981)
 */
contract VaultLegend is ERC721URIStorage, Ownable {

    // ─── Sabitler ────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY  = 333;
    uint256 public constant PHASE1_END  = 33;   // İlk 33 → Early Legends
    uint256 public constant PHASE2_END  = 133;  // 34–133 → Core Legends
    // 134–333 → Final Legends
    uint96  public constant ROYALTY_BPS = 750;  // %7.5

    // ─── State ───────────────────────────────────────────────────
    address public royaltyReceiver;
    address public masterKey;
    uint256 public totalMinted;
    string  public baseTokenURI;

    mapping(address => bool)    public allowlisted;
    mapping(address => bool)    public hasMinted;
    mapping(uint256 => uint8)   public tokenPhase;

    // ─── Events ──────────────────────────────────────────────────
    event Allowlisted(address indexed wallet);
    event RemovedFromAllowlist(address indexed wallet);
    event LegendMinted(address indexed player, uint256 indexed tokenId, uint8 phase);

    // ─── Constructor ─────────────────────────────────────────────
    constructor(
        address _masterKey,
        address _royaltyReceiver,
        string memory _baseURI
    ) ERC721("Vault Legend", "VLEG") Ownable(msg.sender) {
        masterKey       = _masterKey;
        royaltyReceiver = _royaltyReceiver;
        baseTokenURI    = _baseURI;
    }

    // ════════════════════════════════════════════════════════════
    //  ALLOWLIST ADMIN
    // ════════════════════════════════════════════════════════════

    /// @notice Tier 3 tamamlayan oyuncuları allowlist'e ekle
    function addToAllowlist(address[] calldata wallets) external onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            allowlisted[wallets[i]] = true;
            emit Allowlisted(wallets[i]);
        }
    }

    /// @notice Hatalı eklemeyi geri al
    function removeFromAllowlist(address[] calldata wallets) external onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            allowlisted[wallets[i]] = false;
            emit RemovedFromAllowlist(wallets[i]);
        }
    }

    // ════════════════════════════════════════════════════════════
    //  PLAYER MINT — OpenSea drop / uygulama
    // ════════════════════════════════════════════════════════════

    /**
     * @notice Allowlist'e eklenmiş oyuncu NFT'yi bizzat mint eder.
     *         NFT doğrudan msg.sender cüzdanına doğar.
     */
    function mint() external {
        require(allowlisted[msg.sender],  "Not allowlisted: complete Tier 3 first");
        require(!hasMinted[msg.sender],   "Already minted your Legend");
        require(totalMinted < MAX_SUPPLY, "All 333 Legends have been claimed");

        // Allowlist slotunu tüket
        allowlisted[msg.sender] = false;
        hasMinted[msg.sender]   = true;

        uint256 tokenId = ++totalMinted;
        uint8   phase   = _getPhase(tokenId);
        tokenPhase[tokenId] = phase;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(tokenId, phase));

        emit LegendMinted(msg.sender, tokenId, phase);
    }

    // ════════════════════════════════════════════════════════════
    //  LEGACY — MasterKey backward compat
    // ════════════════════════════════════════════════════════════

    /// @dev MasterKey.completeTier3() hâlâ bu fonksiyonu çağırabilir.
    function rewardMint(address player) external returns (uint256) {
        require(msg.sender == masterKey, "Only MasterKey");
        require(!hasMinted[player],       "Already has Legend");
        require(totalMinted < MAX_SUPPLY, "All Legends claimed");

        hasMinted[player] = true;

        uint256 tokenId = ++totalMinted;
        uint8   phase   = _getPhase(tokenId);
        tokenPhase[tokenId] = phase;

        _safeMint(player, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(tokenId, phase));

        emit LegendMinted(player, tokenId, phase);
        return tokenId;
    }

    // ════════════════════════════════════════════════════════════
    //  VIEW — Phase bilgisi
    // ════════════════════════════════════════════════════════════

    function currentPhase() external view returns (uint8) {
        return _getPhase(totalMinted + 1);
    }

    /// @return p1 Phase 1'de mint edilen sayı
    /// @return p2 Phase 2'de mint edilen sayı
    /// @return p3 Phase 3'te mint edilen sayı
    function phaseMinted() external view returns (uint256 p1, uint256 p2, uint256 p3) {
        uint256 t = totalMinted;
        if (t <= PHASE1_END) {
            p1 = t; p2 = 0; p3 = 0;
        } else if (t <= PHASE2_END) {
            p1 = PHASE1_END;
            p2 = t - PHASE1_END;
            p3 = 0;
        } else {
            p1 = PHASE1_END;
            p2 = PHASE2_END - PHASE1_END;
            p3 = t - PHASE2_END;
        }
    }

    function phaseLabel(uint256 tokenId) external pure returns (string memory) {
        if (tokenId <= PHASE1_END) return "Early Legend";
        if (tokenId <= PHASE2_END) return "Core Legend";
        return "Final Legend";
    }

    // ════════════════════════════════════════════════════════════
    //  EIP-2981 ROYALTY
    // ════════════════════════════════════════════════════════════

    function royaltyInfo(uint256 /*tokenId*/, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        receiver      = royaltyReceiver;
        royaltyAmount = (salePrice * ROYALTY_BPS) / 10000;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return interfaceId == 0x2a55205a // EIP-2981
            || super.supportsInterface(interfaceId);
    }

    // ════════════════════════════════════════════════════════════
    //  ADMIN
    // ════════════════════════════════════════════════════════════

    function setMasterKey(address _masterKey) external onlyOwner {
        masterKey = _masterKey;
    }

    function setRoyaltyReceiver(address _receiver) external onlyOwner {
        royaltyReceiver = _receiver;
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseTokenURI = _baseURI;
    }

    // ════════════════════════════════════════════════════════════
    //  INTERNAL
    // ════════════════════════════════════════════════════════════

    function _getPhase(uint256 tokenId) internal pure returns (uint8) {
        if (tokenId <= PHASE1_END) return 1;
        if (tokenId <= PHASE2_END) return 2;
        return 3;
    }

    function _buildTokenURI(uint256 tokenId, uint8 /*phase*/) internal view returns (string memory) {
        // Düz yapı: baseTokenURI/1.json (OpenSea standart)
        // Phase bilgisi metadata JSON içindeki attribute olarak yer alır.
        return string(abi.encodePacked(
            baseTokenURI, _toString(tokenId), ".json"
        ));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp  = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

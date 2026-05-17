// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./VaultKey.sol";
import "./VaultLegend.sol";

/**
 * @title MasterKey — Base Vault Tier 3 NFT
 * @notice 66 USDC. Tier 2 sahipleri için. Tamamlayana otomatik Tier 4 mint.
 */
contract MasterKey is ERC721URIStorage, Ownable {
    // ─── Sabitler ───────────────────────────────────────────────
    uint256 public constant MINT_PRICE_USDC = 66 * 1e6;
    uint256 public constant MAX_SUPPLY      = 666;

    // ─── State ──────────────────────────────────────────────────
    IERC20      public immutable usdc;
    VaultKey    public immutable vaultKey;
    VaultLegend public           vaultLegend;   // deploy sonrası set edilir
    address     public           treasury;
    uint256     public           totalMinted;
    string      public           baseTokenURI;

    mapping(address => bool) public hasMinted;
    mapping(address => bool) public tier3Completed;

    // ─── Events ─────────────────────────────────────────────────
    event MasterKeyMinted(address indexed player, uint256 indexed tokenId);
    event Tier3Completed(address indexed player, uint256 legendTokenId);

    // ─── Constructor ────────────────────────────────────────────
    constructor(
        address _usdc,
        address _vaultKey,
        address _treasury,
        string memory _baseURI
    ) ERC721("Master Key", "MKEY") Ownable(msg.sender) {
        usdc         = IERC20(_usdc);
        vaultKey     = VaultKey(_vaultKey);
        treasury     = _treasury;
        baseTokenURI = _baseURI;
    }

    // ─── Setup ───────────────────────────────────────────────────
    function setVaultLegend(address _vaultLegend) external onlyOwner {
        vaultLegend = VaultLegend(_vaultLegend);
    }

    // ─── Mint ────────────────────────────────────────────────────
    /// @notice Tier 2 sahibi 66 USDC ödeyerek Master Key mint eder
    function mint() external {
        require(vaultKey.hasMinted(msg.sender), "Need Vault Key first");
        require(!hasMinted[msg.sender], "Already minted");
        require(totalMinted < MAX_SUPPLY, "Sold out");

        require(
            usdc.transferFrom(msg.sender, treasury, MINT_PRICE_USDC),
            "USDC transfer failed"
        );

        uint256 tokenId = ++totalMinted;
        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(tokenId));

        emit MasterKeyMinted(msg.sender, tokenId);
    }

    function mintWithETH() external payable {
        require(vaultKey.hasMinted(msg.sender), "Need Vault Key first");
        require(!hasMinted[msg.sender], "Already minted");
        require(totalMinted < MAX_SUPPLY, "Sold out");
        require(msg.value > 0, "Send ETH");

        (bool ok, ) = treasury.call{value: msg.value}("");
        require(ok, "ETH transfer failed");

        uint256 tokenId = ++totalMinted;
        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(tokenId));

        emit MasterKeyMinted(msg.sender, tokenId);
    }

    // ─── Tier 3 tamamlama → otomatik Tier 4 mint ────────────────
    /// @notice Owner (oyun backend) tier3'ü onaylar → VaultLegend otomatik mint
    function completeTier3(address player) external onlyOwner {
        require(hasMinted[player], "Not a master key holder");
        require(!tier3Completed[player], "Already completed");
        require(address(vaultLegend) != address(0), "VaultLegend not set");

        tier3Completed[player] = true;
        uint256 legendId = vaultLegend.rewardMint(player);

        emit Tier3Completed(player, legendId);
    }

    // ─── Admin ───────────────────────────────────────────────────
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseTokenURI = _baseURI;
    }

    // ─── Internal ────────────────────────────────────────────────
    function _buildTokenURI(uint256 tokenId) internal view returns (string memory) {
        return string(abi.encodePacked(baseTokenURI, "/", _toString(tokenId), ".json"));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
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

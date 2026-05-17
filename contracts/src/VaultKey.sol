// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title VaultKey — Base Vault Tier 2 NFT
 * @notice 33 USDC ödeyerek mint edilir. Tier 2 erişim anahtarı.
 * @dev Owner = deployer (senin cüzdanın). Gelir treasury'e gider.
 */
contract VaultKey is ERC721URIStorage, Ownable {
    // ─── Sabitler ───────────────────────────────────────────────
    uint256 public constant MINT_PRICE_USDC = 33 * 1e6;   // 33 USDC (6 decimals)
    uint256 public constant MAX_SUPPLY      = 3333;

    // ─── State ──────────────────────────────────────────────────
    IERC20  public immutable usdc;
    address public           treasury;
    uint256 public           totalMinted;
    string  public           baseTokenURI;

    // tier2 tamamlama kaydı (oyun ilerlemesi için)
    mapping(address => bool) public hasMinted;
    mapping(address => bool) public tier2Completed;

    // ─── Events ─────────────────────────────────────────────────
    event VaultKeyMinted(address indexed player, uint256 indexed tokenId);
    event Tier2Completed(address indexed player);

    // ─── Constructor ────────────────────────────────────────────
    constructor(
        address _usdc,
        address _treasury,
        string memory _baseURI
    ) ERC721("Vault Key", "VKEY") Ownable(msg.sender) {
        usdc        = IERC20(_usdc);
        treasury    = _treasury;
        baseTokenURI = _baseURI;
    }

    // ─── Mint ────────────────────────────────────────────────────
    /// @notice 33 USDC karşılığında Vault Key NFT mint et
    function mint() external {
        require(!hasMinted[msg.sender], "Already minted");
        require(totalMinted < MAX_SUPPLY, "Sold out");

        // USDC al
        require(
            usdc.transferFrom(msg.sender, treasury, MINT_PRICE_USDC),
            "USDC transfer failed"
        );

        uint256 tokenId = ++totalMinted;
        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(tokenId));

        emit VaultKeyMinted(msg.sender, tokenId);
    }

    /// @notice ETH ile de mint edilebilir (Chainlink fiyat oracle yerine basit override)
    function mintWithETH() external payable {
        require(!hasMinted[msg.sender], "Already minted");
        require(totalMinted < MAX_SUPPLY, "Sold out");
        require(msg.value > 0, "Send ETH");

        (bool ok, ) = treasury.call{value: msg.value}("");
        require(ok, "ETH transfer failed");

        uint256 tokenId = ++totalMinted;
        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(tokenId));

        emit VaultKeyMinted(msg.sender, tokenId);
    }

    // ─── Oyun ilerlemesi ─────────────────────────────────────────
    /// @notice Oyun sunucusu (owner) tier2'yi tamamladı olarak işaretler
    function completeTier2(address player) external onlyOwner {
        require(hasMinted[player], "Not a key holder");
        tier2Completed[player] = true;
        emit Tier2Completed(player);
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

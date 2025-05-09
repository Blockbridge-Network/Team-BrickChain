// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPropertyRegistry.sol";
import "./FractionalOwnership.sol";

contract AssetMarketplace is ReentrancyGuard, Ownable {
    IPropertyRegistry public propertyRegistry;
    IERC20 public bctToken;
    mapping(uint256 => uint256) public propertyPrices;
    mapping(uint256 => bool) public listedProperties;

    event PropertyListed(uint256 indexed propertyId, uint256 price);
    event PropertyUnlisted(uint256 indexed propertyId);
    event PropertySold(uint256 indexed propertyId, address buyer, uint256 price);

    constructor(address _propertyRegistry, address _bctToken) Ownable(msg.sender) {
        propertyRegistry = IPropertyRegistry(_propertyRegistry);
        bctToken = IERC20(_bctToken);
    }

    function listProperty(uint256 propertyId, uint256 price) external {
        require(propertyRegistry.ownerOf(propertyId) == msg.sender, "Not property owner");
        require(!listedProperties[propertyId], "Already listed");
        
        propertyPrices[propertyId] = price;
        listedProperties[propertyId] = true;
        
        emit PropertyListed(propertyId, price);
    }

    function unlistProperty(uint256 propertyId) external {
        require(propertyRegistry.ownerOf(propertyId) == msg.sender, "Not property owner");
        require(listedProperties[propertyId], "Not listed");
        
        delete propertyPrices[propertyId];
        listedProperties[propertyId] = false;
        
        emit PropertyUnlisted(propertyId);
    }

    function buyProperty(uint256 propertyId) external nonReentrant {
        require(listedProperties[propertyId], "Not listed");
        uint256 price = propertyPrices[propertyId];
        address seller = propertyRegistry.ownerOf(propertyId);
        
        require(bctToken.balanceOf(msg.sender) >= price, "Insufficient BCT balance");
        require(bctToken.allowance(msg.sender, address(this)) >= price, "Insufficient allowance");
        
        // Transfer BCT tokens from buyer to seller
        require(bctToken.transferFrom(msg.sender, seller, price), "BCT transfer failed");
        
        // Transfer property ownership
        propertyRegistry.safeTransferFrom(seller, msg.sender, propertyId);
        
        delete propertyPrices[propertyId];
        listedProperties[propertyId] = false;
        
        emit PropertySold(propertyId, msg.sender, price);
    }

    function getListedPrice(uint256 propertyId) external view returns (uint256) {
        require(listedProperties[propertyId], "Not listed");
        return propertyPrices[propertyId];
    }

    function isListed(uint256 propertyId) external view returns (bool) {
        return listedProperties[propertyId];
    }
}
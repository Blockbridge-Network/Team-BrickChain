// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./PropertyRegistry.sol";
import "./FractionalOwnership.sol";

contract InvestmentManager is AccessControl, ReentrancyGuard {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    PropertyRegistry public propertyRegistry;
    FractionalOwnership public fractionalOwnership;

    struct Investment {
        address investor;
        uint256 amount;
        uint256 shares;
        uint256 timestamp;
    }

    mapping(uint256 => Investment[]) public investments; // propertyId => Investment[]
    
    event InvestmentMade(uint256 indexed propertyId, address indexed investor, uint256 amount, uint256 shares);
    event InvestmentClosed(uint256 indexed propertyId, uint256 totalAmount, uint256 totalShares);
    
    constructor(address _propertyRegistry, address _fractionalOwnership) {
        propertyRegistry = PropertyRegistry(_propertyRegistry);
        fractionalOwnership = FractionalOwnership(_fractionalOwnership);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    function invest(uint256 propertyId, uint256 numShares) external payable nonReentrant {
        require(hasRole(OPERATOR_ROLE, msg.sender), "Caller is not an operator");
        require(numShares > 0, "Must invest in at least one share");
        
        (uint256 totalShares, uint256 pricePerToken, bool isActive) = fractionalOwnership.getPropertyDetails(propertyId);
        require(isActive, "Property not available for investment");
        require(pricePerToken * numShares == msg.value, "Incorrect payment amount");

        // Add investment record
        investments[propertyId].push(Investment({
            investor: msg.sender,
            amount: msg.value,
            shares: numShares,
            timestamp: block.timestamp
        }));

        // Mint shares to investor
        fractionalOwnership.mintFractions(propertyId, numShares, pricePerToken, msg.sender);
        
        emit InvestmentMade(propertyId, msg.sender, msg.value, numShares);
    }

    function closeInvestment(uint256 propertyId) external nonReentrant onlyRole(OPERATOR_ROLE) {
        Investment[] storage propertyInvestments = investments[propertyId];
        require(propertyInvestments.length > 0, "No investments found");

        uint256 totalAmount = 0;
        uint256 totalShares = 0;

        for (uint256 i = 0; i < propertyInvestments.length; i++) {
            totalAmount += propertyInvestments[i].amount;
            totalShares += propertyInvestments[i].shares;
        }

        emit InvestmentClosed(propertyId, totalAmount, totalShares);
    }

    function getInvestments(uint256 propertyId) external view returns (Investment[] memory) {
        return investments[propertyId];
    }

    function getInvestmentCount(uint256 propertyId) external view returns (uint256) {
        return investments[propertyId].length;
    }
}
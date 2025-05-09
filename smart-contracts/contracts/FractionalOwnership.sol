// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FractionalOwnership is ERC1155, AccessControl, ERC1155Supply, ReentrancyGuard {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
      struct Property {
        uint256 propertyId;
        uint256 totalSupply;
        uint256 pricePerToken;
        address propertyRegistry;
        bool isActive;
    }
    
    mapping(uint256 => Property) public properties;
    
    constructor(address propertyRegistry_) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, propertyRegistry_);
    }
    
    function mintFractions(
        uint256 propertyId,
        uint256 amount,
        uint256 pricePerToken,
        address propertyRegistry_
    ) external onlyRole(OPERATOR_ROLE) {
        require(!properties[propertyId].isActive, "Property already tokenized");
        
        properties[propertyId] = Property({
            propertyId: propertyId,
            totalSupply: amount,
            pricePerToken: pricePerToken,
            propertyRegistry: propertyRegistry_,
            isActive: true
        });
        
        _mint(msg.sender, propertyId, amount, "");
    }
    
    function getPropertyDetails(uint256 propertyId) external view returns (
        uint256 totalShares,
        uint256 pricePerToken,
        bool isActive
    ) {
        Property memory prop = properties[propertyId];
        return (prop.totalSupply, prop.pricePerToken, prop.isActive);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
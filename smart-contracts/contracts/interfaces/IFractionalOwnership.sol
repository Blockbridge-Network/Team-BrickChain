// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IFractionalOwnership
 * @dev Interface for the FractionalOwnership contract
 */
interface IFractionalOwnership {
    struct FractionInfo {
        uint256 totalFractions;
        uint256 pricePerFraction;
        bool isActive;
    }

    /**
     * @dev Fractionalizes a property into tokens
     * @param propertyId ID of the property to fractionalize
     * @param totalFractions Total number of fractions to create
     * @param pricePerFraction Initial price per fraction
     */
    function fractionalizeProperty(
        uint256 propertyId,
        uint256 totalFractions,
        uint256 pricePerFraction
    ) external;

    /**
     * @dev Allocates fractions to an address
     * @param propertyId ID of the property
     * @param to Address to receive the fractions
     * @param fractionCount Number of fractions to allocate
     */
    function allocateFractions(
        uint256 propertyId,
        address to,
        uint256 fractionCount
    ) external;

    /**
     * @dev Returns the number of fractions owned by an address
     * @param propertyId ID of the property
     * @param owner Address to check
     */
    function getOwnedFractions(uint256 propertyId, address owner) external view returns (uint256);

    /**
     * @dev Returns the property's fraction information
     * @param propertyId ID of the property
     */
    function propertyFractions(uint256 propertyId) external view returns (FractionInfo memory);

    /**
     * @dev Approves or removes operator approval for all fractions
     * @param operator Address to approve/disapprove
     * @param approved True to approve, false to revoke
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Transfers fractions between addresses
     * @param from Address sending the fractions
     * @param to Address receiving the fractions
     * @param propertyId ID of the property
     * @param fractionCount Number of fractions to transfer
     */
    function transferFrom(
        address from,
        address to,
        uint256 propertyId,
        uint256 fractionCount
    ) external;
}

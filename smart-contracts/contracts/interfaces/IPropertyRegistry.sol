// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPropertyRegistry
 * @dev Interface for the PropertyRegistry contract
 */
interface IPropertyRegistry {
    /**
     * @dev Checks if a property is locked
     * @param tokenId The ID of the property to check
     * @return bool True if the property is locked
     */
    function isLocked(uint256 tokenId) external view returns (bool);

    /**
     * @dev Locks a property
     * @param tokenId The ID of the property to lock
     */
    function lockProperty(uint256 tokenId) external;

    /**
     * @dev Unlocks a property
     * @param tokenId The ID of the property to unlock
     */
    function unlockProperty(uint256 tokenId) external;
}

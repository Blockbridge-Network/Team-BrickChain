// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAssetMarketplace
 * @dev Interface for the AssetMarketplace contract
 */
interface IAssetMarketplace {
    struct Listing {
        uint256 propertyId;
        address seller;
        uint256 fractionCount;
        uint256 pricePerFraction;
        bool active;
    }

    /**
     * @dev Creates a new listing for property fractions
     * @param propertyId ID of the property
     * @param fractionCount Number of fractions to list
     * @param pricePerFraction Price per fraction in BCT tokens
     */
    function createListing(
        uint256 propertyId,
        uint256 fractionCount,
        uint256 pricePerFraction
    ) external returns (uint256);

    /**
     * @dev Purchases fractions from a listing
     * @param listingId ID of the listing
     * @param fractionCount Number of fractions to purchase
     */
    function purchaseFractions(uint256 listingId, uint256 fractionCount) external;

    /**
     * @dev Updates the price of an existing listing
     * @param listingId ID of the listing
     * @param newPricePerFraction New price per fraction
     */
    function updateListingPrice(uint256 listingId, uint256 newPricePerFraction) external;

    /**
     * @dev Cancels an active listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external;

    /**
     * @dev Returns the details of a listing
     * @param listingId ID of the listing
     */
    function listings(uint256 listingId) external view returns (Listing memory);

    /**
     * @dev Returns the total number of listings
     */
    function totalListings() external view returns (uint256);
}
